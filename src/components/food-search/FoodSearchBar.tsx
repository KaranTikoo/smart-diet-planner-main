
import { Search, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FoodSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
}

const FoodSearchBar = ({ searchQuery, setSearchQuery, onSearch }: FoodSearchBarProps) => {
  return (
    <form onSubmit={onSearch} className="flex space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search foods..."
          className="pl-10"
        />
      </div>
      <Button type="submit" size="icon">
        <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default FoodSearchBar;
