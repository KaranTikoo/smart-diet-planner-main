
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import SearchFilters from "@/components/search/SearchFilters";
import FoodCard from "@/components/ui/FoodCard";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { toast } from "sonner";
import FoodSearchBar from "@/components/food-search/FoodSearchBar";
import FoodDetailDialog from "@/components/food-search/FoodDetailDialog";
import MobileFiltersDialog from "@/components/food-search/MobileFiltersDialog";
import NoResultsMessage from "@/components/food-search/NoResultsMessage";
import { mockFoodDatabase } from "@/data/mockFoodDatabase";

const FoodSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState(mockFoodDatabase);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setFoods(mockFoodDatabase);
      return;
    }
    
    const filteredFoods = mockFoodDatabase.filter((food) => 
      food.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFoods(filteredFoods);
    
    if (filteredFoods.length === 0) {
      toast.info("No foods found matching your search");
    }
  };

  const handleFoodDetails = (food: any) => {
    setSelectedFood(food);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    
    let filteredFoods = [...mockFoodDatabase];
    
    // Apply search query filter
    if (searchQuery.trim()) {
      filteredFoods = filteredFoods.filter((food) => 
        food.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        food.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply calorie range filter
    filteredFoods = filteredFoods.filter(
      (food) => food.calories >= filters.caloriesRange[0] && food.calories <= filters.caloriesRange[1]
    );
    
    // Apply meal type filter
    if (filters.mealType && filters.mealType !== "any_meal") {
      filteredFoods = filteredFoods.filter((food) => food.mealType === filters.mealType);
    }
    
    // Apply diet types filter
    if (filters.dietTypes.length > 0) {
      filteredFoods = filteredFoods.filter((food) => 
        filters.dietTypes.some((diet: string) => food.dietTypes.includes(diet))
      );
    }
    
    // Apply ingredients filter
    if (filters.ingredients.length > 0) {
      filteredFoods = filteredFoods.filter((food) => 
        filters.ingredients.every((ingredient: string) => 
          food.ingredients.some((foodIng) => foodIng.toLowerCase().includes(ingredient.toLowerCase()))
        )
      );
    }
    
    // Apply prep time filter
    if (filters.prepTime && filters.prepTime !== "any_time") {
      switch (filters.prepTime) {
        case "under15":
          filteredFoods = filteredFoods.filter((food) => food.prepTime < 15);
          break;
        case "under30":
          filteredFoods = filteredFoods.filter((food) => food.prepTime < 30);
          break;
        case "under60":
          filteredFoods = filteredFoods.filter((food) => food.prepTime < 60);
          break;
        case "over60":
          filteredFoods = filteredFoods.filter((food) => food.prepTime >= 60);
          break;
        default:
          break;
      }
    }
    
    setFoods(filteredFoods);
    setIsFiltersModalOpen(false);
    
    if (filteredFoods.length === 0) {
      toast.info("No foods found matching your filters");
    }
  };

  const handleAddToMealPlan = (food: any) => {
    toast.success(`Added ${food.title} to your meal plan`);
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
                  onDetails={() => handleFoodDetails(food)}
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
