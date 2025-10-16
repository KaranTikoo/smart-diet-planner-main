import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

interface FoodDetailDialogProps {
  selectedFood: any;
  onClose: () => void;
  onAddToMealPlan: (food: any) => void;
}

const FoodDetailDialog = ({ 
  selectedFood, 
  onClose, 
  onAddToMealPlan 
}: FoodDetailDialogProps) => {
  if (!selectedFood) return null;

  // Use a fallback image if selectedFood.image is missing or broken
  const imageUrl = selectedFood.image || "/placeholder.svg";

  return (
    <Dialog open={!!selectedFood} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{selectedFood.title}</DialogTitle>
          <DialogDescription>
            {selectedFood.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Use the determined imageUrl */}
          <div className="h-60 overflow-hidden rounded-md">
            <img src={imageUrl} alt={selectedFood.title} className="w-full h-full object-cover" onError={(e) => {
              // Fallback to a generic placeholder if the image fails to load
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }} />
          </div>
          
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{selectedFood.calories}</p>
              <p className="text-xs text-muted-foreground">Calories</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{selectedFood.protein}g</p>
              <p className="text-xs text-muted-foreground">Protein</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{selectedFood.carbs}g</p>
              <p className="text-xs text-muted-foreground">Carbs</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">{selectedFood.fat}g</p>
              <p className="text-xs text-muted-foreground">Fat</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Ingredients</h4>
            <ul className="list-disc pl-5 space-y-1">
              {selectedFood.ingredients.map((ingredient: string, index: number) => (
                <li key={index} className="capitalize">{ingredient}</li>
              ))}
            </ul>
          </div>
          
          <div className="flex items-center gap-2">
            <p className="text-sm">Preparation Time:</p>
            <p className="text-sm font-medium">{selectedFood.prepTime} minutes</p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onAddToMealPlan(selectedFood)}>
              Add to Meal Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FoodDetailDialog;