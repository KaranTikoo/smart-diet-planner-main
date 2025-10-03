import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Info } from "lucide-react";

interface FoodCardProps {
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  image?: string;
  onDetails: () => void;
  onAdd: () => void;
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
  onDetails,
  onAdd,
}: FoodCardProps) => {
  return (
    <Card className="flex flex-col h-full">
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/400x200?text=No+Image"; // Fallback image
              e.currentTarget.onerror = null; // Prevent infinite loop
            }}
          />
        </div>
      )}
      <CardHeader className="flex-grow">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{calories} kcal</span>
          <span className="text-muted-foreground">{protein}g P / {carbs}g C / {fat}g F</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-4">
        <Button variant="outline" size="sm" onClick={onDetails} className="flex-1">
          <Info className="mr-2 h-4 w-4" /> Details
        </Button>
        <Button size="sm" onClick={onAdd} className="flex-1">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodCard;