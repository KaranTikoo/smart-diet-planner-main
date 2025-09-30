
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import SearchFilters from "@/components/search/SearchFilters";

interface MobileFiltersDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: any) => void;
}

const MobileFiltersDialog = ({ 
  isOpen, 
  onOpenChange, 
  onApplyFilters 
}: MobileFiltersDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Search Filters</DialogTitle>
          <DialogDescription>
            Refine your food search with these filters
          </DialogDescription>
        </DialogHeader>
        <SearchFilters onApplyFilters={onApplyFilters} />
      </DialogContent>
    </Dialog>
  );
};

export default MobileFiltersDialog;
