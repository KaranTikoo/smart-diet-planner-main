
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AddEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newEntry: {
    weight: string;
    calories: string;
    date: string;
  };
  setNewEntry: (entry: {
    weight: string;
    calories: string;
    date: string;
  }) => void;
  onSave: () => void;
}

const AddEntryDialog = ({ 
  isOpen, 
  onOpenChange, 
  newEntry, 
  setNewEntry, 
  onSave 
}: AddEntryDialogProps) => {
  const handleSaveEntry = () => {
    if (!newEntry.weight || !newEntry.calories) {
      toast.error("Please fill all required fields");
      return;
    }
    onSave();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Progress Entry</DialogTitle>
          <DialogDescription>
            Track your weight and calorie consumption.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-date" className="text-right">
              Date
            </Label>
            <Input
              id="entry-date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
              className="col-span-3"
              type="date"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-weight" className="text-right">
              Weight (kg)
            </Label>
            <Input
              id="entry-weight"
              value={newEntry.weight}
              onChange={(e) => setNewEntry({...newEntry, weight: e.target.value})}
              className="col-span-3"
              type="number"
              step="0.1"
              placeholder="e.g., 75.5"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-calories" className="text-right">
              Calories
            </Label>
            <Input
              id="entry-calories"
              value={newEntry.calories}
              onChange={(e) => setNewEntry({...newEntry, calories: e.target.value})}
              className="col-span-3"
              type="number"
              placeholder="e.g., 1800"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveEntry}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;
