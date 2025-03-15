// Template-specific color palettes
// Each template has its own set of recommended color pairs that work well with its design

export interface ColorPair {
  primary: string;
  secondary: string;
  description?: string;
}

// Color palettes for each template
export const templateColorPalettes: Record<string, ColorPair[]> = {
  // Minimal template - optimized for white backgrounds
  minimal: [
    { primary: "#3B82F6", secondary: "#00070f", description: "Blue shades - Professional, trustworthy" },
    { primary: "#10B981", secondary: "#000000", description: "Green shades - Fresh, growth" },
    { primary: "#F59E0B", secondary: "#282006", description: "Amber shades - Warm, friendly" },
    { primary: "#EF4444", secondary: "#000000", description: "Red shades - Bold, energetic" },
    { primary: "#8B5CF6", secondary: "#150849", description: "Purple shades - Creative, luxurious" },
    { primary: "#EC4899", secondary: "#481431", description: "Pink shades - Playful, youthful" },
    { primary: "#06B6D4", secondary: "#0b444c", description: "Cyan shades - Modern, clean" },
    { primary: "#F97316", secondary: "#000000", description: "Orange shades - Vibrant, friendly" },
    
    // Crypto-themed colors optimized for white background
    { primary: "#F7931A", secondary: "#151513", description: "Bitcoin gold - Classic crypto" },
    { primary: "#627EEA", secondary: "#001d42", description: "Ethereum blue - Elegant, tech" },
    
    // Monochromatic options (good for minimal design)
    { primary: "#4f6382", secondary: "#1E293B ", description: "Slate - Sophisticated, professional" },
    { primary: "#535397", secondary: "#18181B", description: "Zinc - Modern, sleek" },
    { primary: "#78716C", secondary: "#292524", description: "Stone - Natural, earthy" }
  ],
  
  // Modern template
  modern: [
    { primary: "#FF4081", secondary: "#7C4DFF", description: "Pink & Purple - Modern, playful" },
    { primary: "#00BCD4", secondary: "#FF9800", description: "Cyan & Orange - Fresh, energetic" },
    { primary: "#4CAF50", secondary: "#FFC107", description: "Green & Amber - Natural, warm" },
    { primary: "#3F51B5", secondary: "#E91E63", description: "Indigo & Pink - Bold, vibrant" },
    { primary: "#9C27B0", secondary: "#FFEB3B", description: "Purple & Yellow - Royal, striking" },
    { primary: "#F44336", secondary: "#2196F3", description: "Red & Blue - Dynamic, strong" },
    { primary: "#009688", secondary: "#FF5722", description: "Teal & Deep Orange - Modern, balanced" },
    { primary: "#673AB7", secondary: "#8BC34A", description: "Deep Purple & Light Green - Rich, fresh" },
    // New palettes optimized for dark backgrounds
    { primary: "#00E5FF", secondary: "#FF3D00", description: "Neon Blue & Orange - Cyberpunk, futuristic" },
    { primary: "#1DE9B6", secondary: "#FF4081", description: "Mint & Hot Pink - Retro, vibrant" },
    { primary: "#FFEA00", secondary: "#00B0FF", description: "Electric Yellow & Blue - Energetic, bold" },
    { primary: "#76FF03", secondary: "#FF9100", description: "Lime & Amber - Acidic, eye-catching" },
    { primary: "#18FFFF", secondary: "#FF4081", description: "Aqua & Pink - Miami, synthwave" },
    { primary: "#D500F9", secondary: "#00E676", description: "Magenta & Green - Neon, striking" },
    { primary: "#FF9E80", secondary: "#304FFE", description: "Coral & Ultramarine - Sunset, dreamy" },
    { primary: "#FFFF00", secondary: "#FF00FF", description: "Yellow & Magenta - Retro gaming, arcade" },
    { primary: "#64FFDA", secondary: "#FF80AB", description: "Turquoise & Pink - Vaporwave, nostalgic" },
    { primary: "#B388FF", secondary: "#1DE9B6", description: "Lavender & Teal - Ethereal, soothing" }
  ],
  
  // Rocket template
  rocket: [
    { primary: "#0D47A1", secondary: "#FFECB3", description: "Blue & Amber - Space theme" },
    { primary: "#1A0033", secondary: "#E6E1F9", description: "Deep Purple shades - Cosmic" },
    { primary: "#002171", secondary: "#90CAF9", description: "Blue shades - Sky and space" },
    { primary: "#0D1B24", secondary: "#B3E5FC", description: "Dark & Light Blue - Night sky" },
    { primary: "#003060", secondary: "#E1F5FE", description: "Deep Blue & Light Blue - Ocean to sky" },
    { primary: "#1A237E", secondary: "#C5CAE9", description: "Indigo - Deep space" },
    { primary: "#4A148C", secondary: "#E1BEE7", description: "Purple - Galactic" },
    { primary: "#006064", secondary: "#B2EBF2", description: "Teal - Aqua space" },
    { primary: "#3E2723", secondary: "#D7CCC8", description: "Brown - Mars terrain" },
    { primary: "#BF360C", secondary: "#FFCCBC", description: "Deep Orange - Rocket thrust" },
    { primary: "#880E4F", secondary: "#F8BBD0", description: "Pink - Cosmic nebula" },
    { primary: "#1B5E20", secondary: "#C8E6C9", description: "Green - Alien world" },
    { primary: "#01579B", secondary: "#81D4FA", description: "Light Blue - Earth view" }
  ],
  
  // Cosmic template
  cosmic: [
    { primary: "#B388FF", secondary: "#4da2c7", description: "Light Indigo & Lavender - Cosmic glow" },
    { primary: "#EA80FC", secondary: "#82B1FF", description: "Light Blue & Pink - Nebula lights" },
    { primary: "#B388FF", secondary: "#80D8FF", description: "Light Blue & Purple - Galactic haze" },
    { primary: "#8C9EFF", secondary: "#A7FFEB", description: "Aqua & Light Indigo - Aurora" },
    { primary: "#80D8FF", secondary: "#CCFF90", description: "Light Green & Blue - Alien world" },
    { primary: "#FF80AB", secondary: "#FFFF8D", description: "Light Yellow & Pink - Cosmic sunrise" }
  ],
  
  // Pepe template
  pepe: [
    { primary: "#4CAF50", secondary: "#8BC34A", description: "Green shades - Pepe colors" },
    { primary: "#2E7D32", secondary: "#81C784", description: "Dark & Light Green - Classic Pepe" },
    { primary: "#388E3C", secondary: "#212121", description: "Green & Black - Meme style" },
    { primary: "#1B5E20", secondary: "#F57F17", description: "Green & Amber - Pepe with flair" },
    { primary: "#33691E", secondary: "#689F38", description: "Olive Green shades - Natural Pepe" }
  ],
  
  
  // Playful template
  playful: [
    { primary: "#1A237E", secondary: "#D84315", description: "Navy & Deep Orange - Strong contrast" },
    { primary: "#0D47A1", secondary: "#BF360C", description: "Deep Blue & Rust - Bold contrast" },
    { primary: "#311B92", secondary: "#880E4F", description: "Deep Purple & Magenta - Rich contrast" },
    { primary: "#01579B", secondary: "#6A1B9A", description: "Ocean Blue & Purple - Elegant" },
    { primary: "#006064", secondary: "#AD1457", description: "Dark Teal & Burgundy - Sophisticated" },
    { primary: "#1B5E20", secondary: "#4A148C", description: "Forest Green & Deep Purple - Natural" },
    { primary: "#4A148C", secondary: "#0D47A1", description: "Deep Purple & Blue - Royal depth" },
    { primary: "#880E4F", secondary: "#263238", description: "Deep Pink & Dark Blue Grey - Modern" },
    { primary: "#263238", secondary: "#004D40", description: "Dark Blue Grey & Dark Teal - Professional" },
    { primary: "#3E2723", secondary: "#1A237E", description: "Deep Brown & Navy - Rich depth" }
  ],
  
  // Stellar template
  stellar: [
    { primary: "#7986CB", secondary: "#1A237E", description: "Indigo shades - Night sky" },
    { primary: "#2196F3", secondary: "#0D47A1", description: "Blue shades - Clear sky" },
    { primary: "#03A9F4", secondary: "#01579B", description: "Deep Blue shades - Ocean" },
    { primary: "#00BCD4", secondary: "#006064", description: "Teal shades - Tropical" },
    { primary: "#9C27B0", secondary: "#4A148C", description: "Purple shades - Cosmic" },
    { primary: "#6200EA", secondary: "#1A0033", description: "Deep Purple - Nebula" },
    { primary: "#009688", secondary: "#004D40", description: "Teal shades - Aurora" },
    { primary: "#607D8B", secondary: "#263238", description: "Blue Grey - Space dust" },
    { primary: "#FF5722", secondary: "#BF360C", description: "Deep Orange - Supernova" },
    { primary: "#E91E63", secondary: "#880E4F", description: "Pink shades - Cosmic rose" },
    { primary: "#00A8E8", secondary: "#0D2C54", description: "Blue shades - Celestial" },
    { primary: "#4CAF50", secondary: "#1B5E20", description: "Green shades - Alien world" },
    { primary: "#757575", secondary: "#212121", description: "Grey shades - Moon surface" },
    { primary: "#795548", secondary: "#3E2723", description: "Brown shades - Mars terrain" }
  ]
};

// Default color pairs to use when a template doesn't have specific colors
export const defaultColorPairs: ColorPair[] = [
  { primary: "#FF4081", secondary: "#7C4DFF", description: "Pink & Purple - Modern, playful" },
  { primary: "#00BCD4", secondary: "#FF9800", description: "Cyan & Orange - Fresh, energetic" },
  { primary: "#4CAF50", secondary: "#FFC107", description: "Green & Amber - Natural, warm" },
  { primary: "#3F51B5", secondary: "#E91E63", description: "Indigo & Pink - Bold, vibrant" },
  { primary: "#9C27B0", secondary: "#FFEB3B", description: "Purple & Yellow - Royal, striking" },
  { primary: "#F44336", secondary: "#2196F3", description: "Red & Blue - Dynamic, strong" },
  { primary: "#009688", secondary: "#FF5722", description: "Teal & Deep Orange - Modern, balanced" },
  { primary: "#673AB7", secondary: "#8BC34A", description: "Deep Purple & Light Green - Rich, fresh" }
];

// Helper function to get color pairs for a specific template
export const getColorPairsForTemplate = (templateId: string): ColorPair[] => {
  return templateColorPalettes[templateId] || defaultColorPairs;
};
