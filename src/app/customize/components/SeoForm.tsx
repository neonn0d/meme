import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomizationFields } from "@/types";
import { FormProps } from "./types";
import { Globe, Search, Tags, Image } from "lucide-react";
import { useEffect } from "react";

interface SeoFormProps extends FormProps {
  fields: CustomizationFields;
  onChange: (fields: Partial<CustomizationFields>) => void;
}

export function SeoForm({ fields, onChange }: SeoFormProps) {
  useEffect(() => {
    // Set default values if they're not already set
    if (!fields.seo.title && !fields.seo.description && !fields.seo.keywords && !fields.seo.ogImage) {
      onChange({
        seo: {
          title: "BUIDL | Ultimate Memecoin Website Generator",
          description:
            "Easily create your memecoin website with BUIDL! Fast, customizable, and perfect for building your community. Start your journey to the moon today! 🚀",
          keywords:
            "memecoin website generator, customizable templates, crypto projects, cryptocurrency websites, blockchain templates, crypto community builder, tokenomics design, web3 tools, launchpad websites, crypto marketing tools, responsive crypto templates, degen tools, blockchain website creator, memecoin branding, crypto project showcase, Ethereum, Polygon, Solana websites, crypto growth platform, viral crypto campaigns",
          ogImage: "https://placehold.co/1200x630/ffffff/000000?text=BUIDL",
        }
      });
    }
  }, []);

  const handleChange = (key: keyof CustomizationFields['seo'], value: string) => {
    onChange({
      seo: {
        ...fields.seo,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Title and Description Row */}
      <div className="grid grid-cols-1 gap-4">
        {/* Title */}
        <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary/70" />
              <div>
                <Label htmlFor="title" className="font-medium">Title</Label>
                <p className="text-xs text-gray-500">The title that appears in search results</p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <Input
              id="title"
              value={fields.seo.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Your Memecoin Name - The Next Big Thing in Crypto"
              maxLength={60}
              className="h-9"
            />
            <div className="mt-1 flex justify-end">
              <span className="text-xs text-gray-400">
                {(fields.seo.title || '').length}/60 characters
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary/70" />
              <div>
                <Label htmlFor="description" className="font-medium">Description</Label>
                <p className="text-xs text-gray-500">A compelling summary of your project</p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <Input
              id="description"
              value={fields.seo.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Join the revolution with our community-driven memecoin project"
              maxLength={160}
              className="h-9"
            />
            <div className="mt-1 flex justify-end">
              <span className="text-xs text-gray-400">
                {(fields.seo.description || '').length}/160 characters
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords and Social Image Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Keywords */}
        <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-2">
              <Tags className="w-5 h-5 text-primary/70" />
              <div>
                <Label htmlFor="keywords" className="font-medium">Keywords</Label>
                <p className="text-xs text-gray-500">Comma-separated keywords (5-8 recommended)</p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <Input
              id="keywords"
              value={fields.seo.keywords || ''}
              onChange={(e) => handleChange('keywords', e.target.value)}
              placeholder="memecoin, crypto, blockchain, community, token"
              className="h-9"
            />
            <div className="mt-1 text-xs text-gray-400">
              {(fields.seo.keywords || '').split(',').filter(k => k.trim()).length} keywords
            </div>
          </div>
        </div>

        {/* Social Image */}
        <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 border-b">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary/70" />
              <div>
                <Label htmlFor="ogImage" className="font-medium">Social Image</Label>
                <p className="text-xs text-gray-500">Image shown when shared (1200x630px)</p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <Input
              id="ogImage"
              value={fields.seo.ogImage || ''}
              onChange={(e) => handleChange('ogImage', e.target.value)}
              placeholder="https://your-domain.com/social-preview.jpg"
              className="h-9"
            />
            <div className="mt-1 text-xs text-gray-400">
              {fields.seo.ogImage ? 'Image URL set' : 'No image URL set'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
