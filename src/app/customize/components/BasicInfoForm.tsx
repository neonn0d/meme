import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { CustomizationFields } from "@/types";
import { FormProps } from "./types";
import { Button } from "@/components/ui/button";
import {
  Coins,
  FileText,
  Palette,
  Globe,
  Shuffle,
  ShoppingCart,
  CircleDollarSign,
  BookOpenText
} from "lucide-react";
import { useState, useEffect } from "react";
import { getColorPairsForTemplate, templateColorPalettes } from "@/templates/colorPalettes";

interface BasicInfoFormProps {
  fields: CustomizationFields;
  onChange: (fields: Partial<CustomizationFields>) => void;
}

// Keeping the original colorPairs for backward compatibility
export const colorPairs = [
  // Original color pairs
  { primary: "#FF4081", secondary: "#7C4DFF" }, // Pink & Purple - Modern, playful
  { primary: "#00BCD4", secondary: "#FF9800" }, // Cyan & Orange - Fresh, energetic
  { primary: "#4CAF50", secondary: "#FFC107" }, // Green & Amber - Natural, warm
  { primary: "#3F51B5", secondary: "#E91E63" }, // Indigo & Pink - Bold, vibrant
  { primary: "#9C27B0", secondary: "#FFEB3B" }, // Purple & Yellow - Royal, striking
  { primary: "#F44336", secondary: "#2196F3" }, // Red & Blue - Dynamic, strong
  { primary: "#009688", secondary: "#FF5722" }, // Teal & Deep Orange - Modern, balanced
  { primary: "#673AB7", secondary: "#8BC34A" }, // Deep Purple & Light Green - Rich, fresh
  
  // Crypto/Meme themed
  { primary: "#F7931A", secondary: "#4D4D4D" }, // Bitcoin orange & gray
  { primary: "#627EEA", secondary: "#ECF0F1" }, // Ethereum blue & light gray
  { primary: "#C2A633", secondary: "#222222" }, // Dogecoin gold & dark
  { primary: "#00FF41", secondary: "#121212" }, // Matrix theme - terminal green & dark (reversed)
  
  // Vibrant combinations
  { primary: "#6A0DAD", secondary: "#FF69B4" }, // Purple & Hot Pink
  { primary: "#1E88E5", secondary: "#FFC400" }, // Blue & Amber
  { primary: "#43A047", secondary: "#FF3D00" }, // Green & Deep Orange
  { primary: "#D81B60", secondary: "#00ACC1" }, // Pink & Cyan
  
  // Dark mode inspired (reversed to have dark as secondary)
  { primary: "#BB86FC", secondary: "#121212" }, // Purple & Dark
  { primary: "#03DAC6", secondary: "#121212" }, // Teal & Dark
  { primary: "#CF6679", secondary: "#121212" }, // Pink & Dark
  { primary: "#FFDE03", secondary: "#121212" }, // Yellow & Dark
  
  // Pastel combinations
  { primary: "#FFB6C1", secondary: "#ADD8E6" }, // Light Pink & Light Blue
  { primary: "#98FB98", secondary: "#FFA07A" }, // Pale Green & Light Salmon
  { primary: "#DDA0DD", secondary: "#AFEEEE" }, // Plum & Pale Turquoise
  { primary: "#FFDAB9", secondary: "#B0E0E6" }, // Peach Puff & Powder Blue
  
  // Gradient inspired
  { primary: "#833ab4", secondary: "#fd1d1d" }, // Instagram gradient start & mid
  { primary: "#405DE6", secondary: "#5851DB" }, // Instagram gradient variations
  { primary: "#fd1d1d", secondary: "#fcb045" }, // Instagram gradient mid & end
  { primary: "#00c6ff", secondary: "#0072ff" }, // Blue gradient
  
  // Neon themes
  { primary: "#FF00FF", secondary: "#00FFFF" }, // Magenta & Cyan - Cyberpunk
  { primary: "#39FF14", secondary: "#FF3131" }, // Neon Green & Red
  { primary: "#FF10F0", secondary: "#1CA9C9" }, // Hot Pink & Turquoise
  { primary: "#7B4397", secondary: "#DC2430" }, // Purple & Red gradient
];

export function BasicInfoForm({ fields, onChange }: BasicInfoFormProps) {
  // Keep track of previously used colors to avoid repetition
  const [usedColorIndices, setUsedColorIndices] = useState<number[]>([]);
  // Store template-specific color pairs
  const [templateColorPairs, setTemplateColorPairs] = useState(() => {
    // Initialize with the correct template colors based on the current template
    return fields.templateId ? getColorPairsForTemplate(fields.templateId) : colorPairs;
  });

  // Update color pairs when template changes
  useEffect(() => {
    if (fields.templateId) {
      console.log(`Template ID changed to: ${fields.templateId}`);
      const templateColors = getColorPairsForTemplate(fields.templateId);
      console.log(`Found ${templateColors.length} colors for template ${fields.templateId}`);
      setTemplateColorPairs(templateColors);
      // Reset used indices when template changes
      setUsedColorIndices([]);
    }
  }, [fields.templateId]);

  const randomizeColors = () => {
    // Make sure we're using the correct template colors
    const currentTemplateColors = fields.templateId 
      ? getColorPairsForTemplate(fields.templateId) 
      : colorPairs;
    
    console.log(`Randomizing colors for template: ${fields.templateId}`);
    console.log(`Available colors: ${currentTemplateColors.length}`);
    
    let availableIndices = Array.from(
      { length: currentTemplateColors.length },
      (_, i) => i
    ).filter((i) => !usedColorIndices.includes(i));

    // If we've used all colors, reset the used colors array
    if (availableIndices.length === 0) {
      availableIndices = Array.from({ length: currentTemplateColors.length }, (_, i) => i);
      setUsedColorIndices([]);
    }

    // Pick a random color pair from available options
    const randomIndex =
      availableIndices[Math.floor(Math.random() * availableIndices.length)];
    const randomPair = currentTemplateColors[randomIndex];
    
    console.log(`Selected color pair: `, randomPair);

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
      icon: CircleDollarSign,
      color: "from-pink-500/5 to-pink-500/10",
      iconColor: "text-pink-500/70",
    },
    {
      key: "description",
      label: "Project Description",
      description: "A brief description of your project",
      placeholder: "The next generation community-driven memecoin",
      value: fields.description,
      icon: BookOpenText,
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
      icon: FileText,
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
      <div className="grid grid-cols-1 gap-6 flex-1">
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

      {/* Hide color options for pepe template */}
      {fields.templateId !== "pepe" && (
        <div className="space-y-4 mt-auto">
          {/* Added mt-auto to push to bottom */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Brand Colors</h3>
            <div
              onClick={randomizeColors}
              style={{ 
                background: `linear-gradient(to right, ${fields.primaryColor || '#FF4081'}, ${fields.secondaryColor || '#7C4DFF'})`,
                color: '#FFFFFF'
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md cursor-pointer hover:opacity-90 transition-all duration-200"
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
          
          {/* Color Scheme Swatches */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Preset Color Schemes</p>
            <div className="flex flex-wrap gap-2">
              {templateColorPairs.map((pair, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded-full border border-gray-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all duration-200"
                  style={{ 
                    background: `linear-gradient(to right, ${pair.primary}, ${pair.secondary})` 
                  }}
                  onClick={() => onChange({
                    primaryColor: pair.primary,
                    secondaryColor: pair.secondary,
                  })}
                  title={`Color scheme ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
