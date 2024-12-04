import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomizationFields, RoadmapPhase } from "@/types";
import { FormProps } from "./types";
import { Button } from "@/components/ui/button";
import { Milestone, PlusCircle, Trash2, Calendar } from "lucide-react";

interface RoadmapFormProps extends FormProps {
  fields: CustomizationFields;
  onChange: (fields: Partial<CustomizationFields>) => void;
}

export function RoadmapForm({ fields, onChange }: RoadmapFormProps) {
  const addPhase = () => {
    const newPhase: RoadmapPhase = {
      title: '',
      description: '',
      date: `Q${((fields.roadmap?.phases.length || 0) % 4) + 1} ${new Date().getFullYear()}`
    };
    onChange({
      roadmap: {
        phases: [...(fields.roadmap?.phases || []), newPhase]
      }
    });
  };

  const updatePhase = (index: number, field: keyof RoadmapPhase, value: string) => {
    const updatedPhases = [...(fields.roadmap?.phases || [])];
    updatedPhases[index] = {
      ...updatedPhases[index],
      [field]: value
    };
    onChange({
      roadmap: {
        phases: updatedPhases
      }
    });
  };

  const removePhase = (index: number) => {
    const updatedPhases = [...(fields.roadmap?.phases || [])];
    updatedPhases.splice(index, 1);
    onChange({
      roadmap: {
        phases: updatedPhases
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(fields.roadmap?.phases || []).map((phase, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Preview Header */}
            <div className="relative p-4 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Milestone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mt-2 font-medium text-center">
                  {phase.title || `Phase ${index + 1}`}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>{phase.date}</span>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhase(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="p-4 space-y-3">
              <div>
                <Label htmlFor={`title-${index}`} className="text-xs font-medium text-gray-600">
                  Phase Title
                </Label>
                <Input
                  id={`title-${index}`}
                  value={phase.title}
                  onChange={(e) => updatePhase(index, 'title', e.target.value)}
                  placeholder="Enter phase title"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`date-${index}`} className="text-xs font-medium text-gray-600">
                  Timeline
                </Label>
                <Input
                  id={`date-${index}`}
                  value={phase.date}
                  onChange={(e) => updatePhase(index, 'date', e.target.value)}
                  placeholder="e.g., Q1 2024"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`description-${index}`} className="text-xs font-medium text-gray-600">
                  Description
                </Label>
                <Textarea
                  id={`description-${index}`}
                  value={phase.description}
                  onChange={(e) => updatePhase(index, 'description', e.target.value)}
                  placeholder="Describe this phase"
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Phase Button */}
        <button
          onClick={addPhase}
          className="h-full min-h-[300px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary"
        >
          <PlusCircle className="h-8 w-8" />
          <span className="font-medium">Add Phase</span>
        </button>
      </div>
    </div>
  );
}
