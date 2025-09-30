
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoIcon, Plus } from "lucide-react";

interface FoodCardProps {
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  image?: string;
  onAdd?: () => void;
  onDetails?: () => void;
}

const FoodCard = ({
  title,
  description,
  calories,
  protein,
  carbs,
  fat,
  tags,
  image,
  onAdd,
  onDetails,
}: FoodCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {image && (
        <div className="h-40 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <CardHeader className={image ? "pb-2" : "pb-0"}>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2 flex-grow">
        <div className="flex justify-between text-sm mb-2">
          <div className="text-center">
            <p className="font-medium">{calories}</p>
            <p className="text-xs text-muted-foreground">Calories</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{protein}g</p>
            <p className="text-xs text-muted-foreground">Protein</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{carbs}g</p>
            <p className="text-xs text-muted-foreground">Carbs</p>
          </div>
          <div className="text-center">
            <p className="font-medium">{fat}g</p>
            <p className="text-xs text-muted-foreground">Fat</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-muted">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onDetails}
        >
          <InfoIcon className="h-4 w-4 mr-1" /> Details
        </Button>
        <Button
          size="sm"
          className="w-full"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;
