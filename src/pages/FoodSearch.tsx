import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SearchFilters from "@/components/search/SearchFilters";
import FoodCard from "@/components/ui/FoodCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import FoodSearchBar from "@/components/food-search/FoodSearchBar";
import FoodDetailDialog from "@/components/food-search/FoodDetailDialog";
import MobileFiltersDialog from "@/components/food-search/MobileFiltersDialog"; // Corrected import path
import NoResultsMessage from "@/components/food-search/NoResultsMessage";
import { mockFoodDatabase } from "@/data/mockFoodDatabase";
import { FoodItem } from "@/types/food";

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<any>({});
  const [foods, setFoods] = useState<FoodItem[]>([]); // Initialize as empty, let useEffect populate
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Centralized function to apply all filters and search query
  const getFilteredFoods = useCallback((currentSearchQuery: string, currentFilters: any): FoodItem[] => {
    let filtered = [...mockFoodDatabase];

    // Apply search query filter
    if (currentSearchQuery.trim()) {
      filtered = filtered.filter((food) => 
        food.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
        food.ingredients.some(ing => ing.toLowerCase().includes(currentSearchQuery.toLowerCase()))
      );
    }

    // Apply calorie range filter
    if (currentFilters.caloriesRange && (currentFilters.caloriesRange[0] !== 0 || currentFilters.caloriesRange[1] !== 1000)) {
      filtered = filtered.filter(
        (food) => food.calories >= currentFilters.caloriesRange[0] && food.calories <= currentFilters.caloriesRange[1]
      );
    }
    
    // Apply meal type filter
    if (currentFilters.mealType && currentFilters.mealType !== "any_meal") {
      filtered = filtered.filter((food) => food.mealType === currentFilters.mealType);
    }
    
    // Apply diet types filter
    if (currentFilters.dietTypes && currentFilters.dietTypes.length > 0) {
      filtered = filtered.filter((food) => 
        currentFilters.dietTypes.some((diet: string) => food.dietTypes.includes(diet))
      );
    }
    
    // Apply ingredients filter
    if (currentFilters.ingredients && currentFilters.ingredients.length > 0) {
      filtered = filtered.filter((food) => 
        currentFilters.ingredients.every((ingredient: string) => 
          food.ingredients.some((foodIng) => foodIng.toLowerCase().includes(ingredient.toLowerCase()))
        )
      );
    }
    
    // Apply prep time filter
    if (currentFilters.prepTime && currentFilters.prepTime !== "any_time") {
      switch (currentFilters.prepTime) {
        case "under15":
          filtered = filtered.filter((food) => food.prepTime < 15);
          break;
        case "under30":
          filtered = filtered.filter((food) => food.prepTime < 30);
          break;
        case "under60":
          filtered = filtered.filter((food) => food.prepTime < 60);
          break;
        case "over60":
          filtered = filtered.filter((food) => food.prepTime >= 60);
          break;
        default:
          break;
      }
    }
    return filtered;
  }, []); // mockFoodDatabase is a constant, no need to list as dependency

  // Effect to re-filter foods whenever searchQuery or appliedFilters change
  useEffect(() => {
    const newFilteredFoods = getFilteredFoods(searchQuery, appliedFilters);
    setFoods(newFilteredFoods);
    // Only show toast if there's an active search or filter and no results
    if (newFilteredFoods.length === 0 && (searchQuery.trim() || Object.keys(appliedFilters).length > 0)) {
      toast.info("No foods found matching your criteria.");
    }
  }, [searchQuery, appliedFilters, getFilteredFoods]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The useEffect will handle updating `foods` and showing toast.
    // No need to call setFoods directly here.
    // The `setSearchQuery` is already called by the Input onChange.
    // This function primarily prevents default form submission.
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters); // This will trigger the useEffect to re-filter
    setIsFiltersModalOpen(false);
  };

  const handleAddToMealPlan = (food: FoodItem) => {
    toast.success(`Added ${food.title} to your meal plan`);
    // Further logic to actually add to meal plan (e.g., via a hook or context)
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Food Search</h1>
          <p className="text-muted-foreground">
            Find nutritious foods and recipes for your meal plan
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Search and Filters */}
          <div className="w-full md:w-1/4 space-y-4">
            <FoodSearchBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
            
            <div className="md:hidden">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setIsFiltersModalOpen(true)}
              >
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
            
            <div className="hidden md:block">
              <SearchFilters onApplyFilters={handleApplyFilters} />
            </div>
          </div>

          {/* Results */}
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {foods.map((food) => (
                <FoodCard
                  key={food.id}
                  title={food.title}
                  description={food.description}
                  calories={food.calories}
                  protein={food.protein}
                  carbs={food.carbs}
                  fat={food.fat}
                  tags={food.tags}
                  image={food.image}
                  onDetails={() => setSelectedFood(food)}
                  onAdd={() => handleAddToMealPlan(food)}
                />
              ))}
            </div>
            
            {foods.length === 0 && <NoResultsMessage />}
          </div>
        </div>

        {/* Food Details Dialog */}
        <FoodDetailDialog 
          selectedFood={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToMealPlan={handleAddToMealPlan}
        />

        {/* Mobile Filters Modal */}
        <MobileFiltersDialog 
          isOpen={isFiltersModalOpen}
          onOpenChange={setIsFiltersModalOpen}
          onApplyFilters={handleApplyFilters}
        />
      </div>
    </MainLayout>
  );
};

export default FoodSearch;