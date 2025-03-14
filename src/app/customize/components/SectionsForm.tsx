import { CustomizationFields } from "@/types";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import { 
  Rocket, 
  Target, 
  Map, 
  LineChart, 
  Users,
  HelpCircle,
  Users2
} from "lucide-react";

interface SectionsFormProps {
  fields: CustomizationFields;
  onChange: (fields: Partial<CustomizationFields>) => void;
}

export function SectionsForm({ fields, onChange }: SectionsFormProps) {
  const handleSectionChange = (section: keyof CustomizationFields['sections'], checked: boolean) => {
    onChange({
      sections: {
        ...fields.sections,
        [section]: checked,
      },
    });

    // Clear data for disabled sections
    if (!checked) {
      const updatedFields: Partial<CustomizationFields> = {
        sections: {
          ...fields.sections,
          [section]: checked,
        },
      };

      switch (section) {
        case 'roadmap':
          delete updatedFields.roadmap;
          break;
        case 'team':
          delete updatedFields.team;
          break;
        case 'faq':
          delete updatedFields.faq;
          break;
        case 'tokenomics':
          delete updatedFields.tokenomics;
          break;
      }

      onChange(updatedFields);
    } else {
      // Initialize data for enabled sections
      const updatedFields: Partial<CustomizationFields> = {};
      
      switch (section) {
        case 'roadmap':
          updatedFields.roadmap = {
            phases: [{
              title: "Phase 1",
              description: "Launch and Marketing",
              date: "Q1 2024"
            }]
          };
          break;
        case 'team':
          updatedFields.team = [{
            name: "Team Member",
            role: "Role",
            avatar: ""
          }];
          break;
        case 'faq':
          updatedFields.faq = [{
            question: "What is this project about?",
            answer: "Our project aims to revolutionize the meme coin space."
          }];
          break;
        case 'tokenomics':
          updatedFields.tokenomics = {
            totalSupply: "1000000000",
            taxBuy: "2",
            taxSell: "3",
            lpLocked: "50%",
          };
          break;
      }

      onChange(updatedFields);
    }
  };

  const sections = [
    {
      id: 'hero',
      label: 'Hero Section',
      description: 'Main landing section with key information',
      icon: Rocket,
      color: 'from-blue-500/5 to-blue-500/10',
      iconColor: 'text-blue-500/70'
    },
    {
      id: 'tokenomics',
      label: 'Tokenomics',
      description: 'Token distribution and economics',
      icon: LineChart,
      color: 'from-purple-500/5 to-purple-500/10',
      iconColor: 'text-purple-500/70'
    },
    {
      id: 'roadmap',
      label: 'Roadmap',
      description: 'Project timeline and milestones',
      icon: Map,
      color: 'from-green-500/5 to-green-500/10',
      iconColor: 'text-green-500/70'
    },
    {
      id: 'team',
      label: 'Team',
      description: 'Team members and roles',
      icon: Users,
      color: 'from-orange-500/5 to-orange-500/10',
      iconColor: 'text-orange-500/70'
    },
    {
      id: 'faq',
      label: 'FAQ',
      description: 'Frequently asked questions',
      icon: HelpCircle,
      color: 'from-pink-500/5 to-pink-500/10',
      iconColor: 'text-pink-500/70'
    },
    {
      id: 'community',
      label: 'Community',
      description: 'Social media links and community information',
      icon: Users2,
      color: 'from-indigo-500/5 to-indigo-500/10',
      iconColor: 'text-indigo-500/70'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section) => (
        <div
          key={section.id}
          className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          <div className={`p-4 bg-gradient-to-br ${section.color} border-b`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <section.icon className={`w-6 h-6 ${section.iconColor}`} />
                <div>
                  <Label className="font-medium text-base">{section.label}</Label>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <Switch
                checked={fields.sections[section.id as keyof CustomizationFields['sections']]}
                onCheckedChange={(checked) => 
                  handleSectionChange(section.id as keyof CustomizationFields['sections'], checked)
                }
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
