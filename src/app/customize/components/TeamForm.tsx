import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { CustomizationFields, TeamMember } from "@/types";
import { FormProps } from "./types";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, UserCircle2 } from "lucide-react";

interface TeamFormProps extends FormProps {}

export function TeamForm({ fields, onChange }: TeamFormProps) {
  const addTeamMember = () => {
    const randomId = Math.floor(Math.random() * 70) + 1; // pravatar has images from 1-70
    const newMember: TeamMember = {
      name: '',
      role: '',
      avatar: `https://i.pravatar.cc/300?img=${randomId}`
    };
    onChange({
      team: [...(fields.team || []), newMember]
    });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedTeam = [...(fields.team || [])];
    updatedTeam[index] = {
      ...updatedTeam[index],
      [field]: value
    };
    onChange({ team: updatedTeam });
  };

  const removeTeamMember = (index: number) => {
    const updatedTeam = [...(fields.team || [])];
    updatedTeam.splice(index, 1);
    onChange({ team: updatedTeam });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(fields.team || []).map((member, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Preview Header */}
            <div className="relative p-4 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex flex-col items-center">
                {member.avatar ? (
                  <img
                    src={member.avatar}
                    alt={member.name || 'Team member'}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      const randomId = Math.floor(Math.random() * 70) + 1;
                      img.src = `https://i.pravatar.cc/300?img=${randomId}`;
                    }}
                  />
                ) : (
                  <UserCircle2 className="w-20 h-20 text-gray-400" />
                )}
                <h3 className="mt-2 font-medium text-center">
                  {member.name || 'New Member'}
                </h3>
                <p className="text-sm text-gray-600">
                  {member.role || 'Role'}
                </p>
              </div>
              
              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeTeamMember(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="p-4 space-y-3">
              <div>
                <Label htmlFor={`name-${index}`} className="text-xs font-medium text-gray-600">
                  Name
                </Label>
                <Input
                  id={`name-${index}`}
                  value={member.name}
                  onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                  placeholder="Enter name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`role-${index}`} className="text-xs font-medium text-gray-600">
                  Role
                </Label>
                <Input
                  id={`role-${index}`}
                  value={member.role}
                  onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                  placeholder="Enter role"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`avatar-${index}`} className="text-xs font-medium text-gray-600">
                  Avatar URL
                </Label>
                <Input
                  id={`avatar-${index}`}
                  value={member.avatar}
                  onChange={(e) => updateTeamMember(index, 'avatar', e.target.value)}
                  placeholder="Enter avatar URL"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add Member Button */}
        <button
          onClick={addTeamMember}
          className="h-full min-h-[300px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary"
        >
          <PlusCircle className="h-8 w-8" />
          <span className="font-medium">Add Team Member</span>
        </button>
      </div>
    </div>
  );
}
