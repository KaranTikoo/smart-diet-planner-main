import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWaterIntake } from "@/hooks/useWaterIntake";

interface AddWaterEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryAdded?: () => void;
}

const AddWaterEntryDialog = ({ isOpen, onOpenChange, onEntryAdded }: AddWaterEntryDialogProps) => {
  const { addEntry } = useWaterIntake();
  const [amountMl, setAmountMl] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveWaterEntry = async () => {
    if (!amountMl || parseFloat(amountMl) <= 0) {
      toast.error("Please enter a valid water amount.");
      return;
    }

    setIsLoading(true);
    try {
      await addEntry(parseFloat(amountMl), entryDate);
      
      setAmountMl("");
      setEntryDate(new Date().toISOString().split('T')[0]);
      onOpenChange(false);
      if (onEntryAdded) {
        onEntryAdded();
      }
    } catch (error) {
      console.error("Error adding water entry:", error);
      toast.error("Failed to add water entry.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Water Intake</DialogTitle>
          <DialogDescription>
            Record your daily water consumption.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="water-amount" className="text-right">
              Amount (ml)
            </Label>
            <Input
              id="water-amount"
              value={amountMl}
              onChange={(e) => setAmountMl(e.target.value)}
              className="col-span-3"
              type="number"
              placeholder="e.g., 500"
              min="1"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-date" className="text-right">
              Date
            </Label>
            <Input
              id="entry-date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="col-span-3"
              type="date"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSaveWaterEntry} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWaterEntryDialog;