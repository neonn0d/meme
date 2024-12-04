import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { CustomizationFields } from "@/types";
import { FormProps } from "./types";
import { Button } from "@/components/ui/button";
import {
  Coins,
  Link2,
  FileText,
  Palette,
  Globe,
  Shuffle,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

interface BasicInfoFormProps {
  fields: CustomizationFields;
  onChange: (fields: Partial<CustomizationFields>) => void;
}

// Predefined color combinations that look good together
const colorPairs = [
  { primary: "#FF4081", secondary: "#7C4DFF" }, // Pink & Purple - Modern, playful
  { primary: "#00BCD4", secondary: "#FF9800" }, // Cyan & Orange - Fresh, energetic
  { primary: "#4CAF50", secondary: "#FFC107" }, // Green & Amber - Natural, warm
  { primary: "#3F51B5", secondary: "#E91E63" }, // Indigo & Pink - Bold, vibrant
  { primary: "#9C27B0", secondary: "#FFEB3B" }, // Purple & Yellow - Royal, striking
  { primary: "#F44336", secondary: "#2196F3" }, // Red & Blue - Dynamic, strong
  { primary: "#009688", secondary: "#FF5722" }, // Teal & Deep Orange - Modern, balanced
  { primary: "#673AB7", secondary: "#8BC34A" }, // Deep Purple & Light Green - Rich, fresh
  { primary: "#2196F3", secondary: "#FF4081" }, // Blue & Pink - Playful, modern
  { primary: "#00BCD4", secondary: "#FFA000" }, // Cyan & Amber - Tropical, warm
  { primary: "#9C27B0", secondary: "#4CAF50" }, // Purple & Green - Creative, balanced
  { primary: "#FF5722", secondary: "#03A9F4" }, // Deep Orange & Light Blue - Energetic, fresh
  { primary: "#3F51B5", secondary: "#FF9800" }, // Indigo & Orange - Professional, warm
  { primary: "#009688", secondary: "#9C27B0" }, // Teal & Purple - Sophisticated, bold
  { primary: "#E91E63", secondary: "#00BCD4" }, // Pink & Cyan - Modern, fresh
];

export function BasicInfoForm({ fields, onChange }: BasicInfoFormProps) {
  // Keep track of previously used colors to avoid repetition
  const [usedColorIndices, setUsedColorIndices] = useState<number[]>([]);

  const randomizeColors = () => {
    let availableIndices = Array.from(
      { length: colorPairs.length },
      (_, i) => i
    ).filter((i) => !usedColorIndices.includes(i));

    // If we've used all colors, reset the used colors array
    if (availableIndices.length === 0) {
      availableIndices = Array.from({ length: colorPairs.length }, (_, i) => i);
      setUsedColorIndices([]);
    }

    // Pick a random color pair from available options
    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const randomPair = colorPairs[randomIndex];

    // Update used colors
    setUsedColorIndices((prev) => [...prev, randomIndex]);

    // Apply the new colors
    onChange({
      primaryColor: randomPair.primary,
      secondaryColor: randomPair.secondary,
    });
  };

  const formFields = [
    {
      key: "coinName",
      label: "Project Name",
      description: "The name of your memecoin project",
      placeholder: "Your Memecoin",
      value: fields.coinName,
      icon: Coins,
      color: "from-violet-500/5 to-violet-500/10",
      iconColor: "text-violet-500/70",
    },
    {
      key: "tokenSymbol",
      label: "Token Symbol",
      description: "Your token ticker (e.g., BUIDL, PEPE, etc.)",
      placeholder: "MEME",
      value: fields.tokenSymbol,
      icon: Palette,
      color: "from-pink-500/5 to-pink-500/10",
      iconColor: "text-pink-500/70",
    },
    {
      key: "description",
      label: "Project Description",
      description: "A brief description of your project",
      placeholder: "The next generation community-driven memecoin",
      value: fields.description,
      icon: FileText,
      color: "from-blue-500/5 to-blue-500/10",
      iconColor: "text-blue-500/70",
    },
    {
      key: "logoUrl",
      label: "Logo URL",
      description: "Direct link to your logo (512x512px recommended)",
      placeholder: "https://yourmemecoin.com/logo.png",
      value: fields.logoUrl,
      icon: Globe,
      color: "from-green-500/5 to-green-500/10",
      iconColor: "text-green-500/70",
      type: "url",
    },
    {
      key: "contractAddress",
      label: "Contract Address",
      description: "Your token smart contract address",
      placeholder: "0x...",
      value: fields.contractAddress,
      icon: Link2,
      color: "from-indigo-500/5 to-indigo-500/10",
      iconColor: "text-indigo-500/70",
    },
    {
      key: "buyLink",
      label: "Buy Link",
      description: "Link to where users can buy your token (e.g., Uniswap)",
      placeholder: "https://app.uniswap.org/",
      value: fields.buyLink,
      icon: ShoppingCart,
      color: "from-orange-500/5 to-orange-500/10",
      iconColor: "text-orange-500/70",
      type: "url",
    },
  ];

  return (
    <div className="flex flex-col h-full space-y-6 pb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {formFields.map((field) => (
          <div
            key={field.key}
            className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 h-fit"
          >
            <div className={`p-4 bg-gradient-to-br ${field.color} border-b`}>
              <div className="flex items-center gap-3">
                <field.icon className={`w-6 h-6 ${field.iconColor}`} />
                <div>
                  <Label htmlFor={field.key} className="font-medium text-base">
                    {field.label}
                  </Label>
                  <p className="text-sm text-gray-500">{field.description}</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <Input
                id={field.key}
                type={field.type || "text"}
                value={field.value || ""}
                onChange={(e) => onChange({ [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="h-9"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 mt-auto">
        {" "}
        {/* Added mt-auto to push to bottom */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Brand Colors</h3>
          <div
            onClick={randomizeColors}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition-colors duration-200"
          >
            <Shuffle className="w-4 h-4" />
            Randomize Colors
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-red-500/5 to-red-500/10 border-b">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-red-500/70" />
                <div>
                  <Label
                    htmlFor="primaryColor"
                    className="font-medium text-base"
                  >
                    Primary Color
                  </Label>
                  <p className="text-sm text-gray-500">
                    Main color for your website
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  id="primaryColor"
                  value={fields.primaryColor || "#000000"}
                  onChange={(e) => onChange({ primaryColor: e.target.value })}
                  className="w-16 h-9 p-1"
                />
                <Input
                  type="text"
                  value={fields.primaryColor || "#000000"}
                  onChange={(e) => onChange({ primaryColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 h-9"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border-b">
              <div className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-500/70" />
                <div>
                  <Label
                    htmlFor="secondaryColor"
                    className="font-medium text-base"
                  >
                    Secondary Color
                  </Label>
                  <p className="text-sm text-gray-500">
                    Accent color for your website
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <Input
                  type="color"
                  id="secondaryColor"
                  value={fields.secondaryColor || "#000000"}
                  onChange={(e) => onChange({ secondaryColor: e.target.value })}
                  className="w-16 h-9 p-1"
                />
                <Input
                  type="text"
                  value={fields.secondaryColor || "#000000"}
                  onChange={(e) => onChange({ secondaryColor: e.target.value })}
                  placeholder="#000000"
                  className="flex-1 h-9"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
