import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useWaterIntake } from "@/hooks/useWaterIntake";
import { format } from "date-fns"; // Import format for date handling

interface AddWaterEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEntryAdded?: () => void;
}

const AddWaterEntryDialog = ({ isOpen, onOpenChange, onEntryAdded }: AddWaterEntryDialogProps) => {
  const { addEntry } = useWaterIntake();
  const [amountMl, setAmountMl] = useState("");
  const [entryDate, setEntryDate] = useState(format(new Date(), 'yyyy-MM-dd')); // Format to YYYY-MM-DD
  const [entryTime, setEntryTime] = useState(format(new Date(), 'HH:mm')); // Format to HH:mm
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveWaterEntry = async () => {
    if (!amountMl || parseFloat(amountMl) <= 0) {
      toast.error("Please enter a valid water amount.");
      return;
    }

    setIsLoading(true);
    try {
      // Combine date and time to create a full ISO timestamp
      const dateTimeString = `${entryDate}T${entryTime}:00Z`; // Assuming UTC for simplicity, adjust if local time is needed
      const createdAtTimestamp = new Date(dateTimeString).toISOString();

      await addEntry(parseFloat(amountMl), entryDate, createdAtTimestamp);
      
      setAmountMl("");
      setEntryDate(format(new Date(), 'yyyy-MM-dd'));
      setEntryTime(format(new Date(), 'HH:mm'));
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="entry-time" className="text-right">
              Time
            </Label>
            <Input
              id="entry-time"
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              className="col-span-3"
              type="time"
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