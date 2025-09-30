
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

interface ProgressHeaderProps {
  period: string;
  setPeriod: (value: string) => void;
  onAddEntry: () => void;
}

const ProgressHeader = ({ period, setPeriod, onAddEntry }: ProgressHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
      <DashboardHeader 
        title="Progress Tracker"
        description="Monitor your nutrition and weight goals"
        buttonText="Add Entry"
        buttonIcon={<Plus className="mr-2 h-4 w-4" />}
        onButtonClick={onAddEntry}
      />
      <div className="flex items-center mt-4 sm:mt-0 ml-auto">
        <Tabs value={period} onValueChange={setPeriod} className="mr-4">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default ProgressHeader;
