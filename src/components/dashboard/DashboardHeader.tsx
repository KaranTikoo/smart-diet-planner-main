
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  buttonText?: string;
  buttonIcon?: React.ReactNode;
  onButtonClick?: () => void;
}

const DashboardHeader = ({
  title,
  description,
  buttonText = "Add Entry",
  buttonIcon = <PlusCircle className="mr-2 h-4 w-4" />,
  onButtonClick
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {onButtonClick && (
        <Button className="mt-4 sm:mt-0" onClick={onButtonClick}>
          {buttonIcon} {buttonText}
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
