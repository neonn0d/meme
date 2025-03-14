import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { CustomizationFields } from "@/types";
import { FormProps } from "./types";
import { Button } from "@/components/ui/button";
import { ExternalLink, Check } from "lucide-react";
import { FaTelegram, FaTwitter, FaDiscord } from "react-icons/fa";
import { useState } from "react";

interface SocialLinksFormProps extends FormProps {}

export function SocialLinksForm({ fields, onChange }: SocialLinksFormProps) {
  const [validationStates, setValidationStates] = useState({
    telegram: true,
    twitter: true,
    discord: true
  });

  const validateUrl = (url: string, platform: string): boolean => {
    if (!url) return true; // Empty URLs are considered valid
    try {
      const urlObj = new URL(url);
      switch (platform) {
        case 'telegram':
          return urlObj.hostname === 't.me' || urlObj.hostname === 'telegram.me';
        case 'twitter':
          return urlObj.hostname === 'twitter.com' || urlObj.hostname === 'x.com';
        case 'discord':
          return urlObj.hostname === 'discord.gg' || urlObj.hostname === 'discord.com';
        default:
          return true;
      }
    } catch {
      return false;
    }
  };

  const handleChange = (platform: keyof CustomizationFields['socialLinks'], value: string) => {
    const isValid = validateUrl(value, platform);
    setValidationStates(prev => ({ ...prev, [platform]: isValid }));
    
    onChange({
      socialLinks: {
        ...fields.socialLinks,
        [platform]: value
      }
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'telegram':
        return <FaTelegram className="w-8 h-8" />;
      case 'twitter':
        return <FaTwitter className="w-8 h-8" />;
      case 'discord':
        return <FaDiscord className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'telegram':
        return 'from-[#0088cc]/20 to-[#0088cc]/30 text-[#0088cc]';
      case 'twitter':
        return 'from-[#1DA1F2]/20 to-[#1DA1F2]/30 text-[#1DA1F2]';
      case 'discord':
        return 'from-[#5865F2]/20 to-[#5865F2]/30 text-[#5865F2]';
      default:
        return '';
    }
  };

  const socialPlatforms = [
    { key: 'telegram', name: 'Telegram', placeholder: 'https://t.me/yourproject' },
    { key: 'twitter', name: 'Twitter', placeholder: 'https://twitter.com/yourproject' },
    { key: 'discord', name: 'Discord', placeholder: 'https://discord.gg/yourproject' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {socialPlatforms.map((platform) => (
        <div
          key={platform.key}
          className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          {/* Preview Header */}
          <div className={`relative p-4 bg-gradient-to-br ${getPlatformColor(platform.key)}`}>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                {getPlatformIcon(platform.key)}
              </div>
              <h3 className="mt-2 font-medium text-center">
                {platform.name}
              </h3>
              <div className="flex items-center gap-1 text-sm mt-1 opacity-75">
                <ExternalLink className="w-4 h-4" />
                <span>Social Link</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-4 space-y-3">
            <div>
              <Label
                htmlFor={`social-${platform.key}`}
                className="text-xs font-medium text-gray-600 flex items-center justify-between"
              >
                <span>URL</span>
                {fields.socialLinks[platform.key as keyof CustomizationFields['socialLinks']] && 
                 validationStates[platform.key as keyof typeof validationStates] && (
                  <span className="text-green-500 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Valid
                  </span>
                )}
              </Label>
              <Input
                id={`social-${platform.key}`}
                value={fields.socialLinks[platform.key as keyof CustomizationFields['socialLinks']]}
                onChange={(e) => handleChange(platform.key as keyof CustomizationFields['socialLinks'], e.target.value)}
                placeholder={platform.placeholder}
                className={`mt-1 ${!validationStates[platform.key as keyof typeof validationStates] ? 'border-red-500' : ''}`}
              />
              {!validationStates[platform.key as keyof typeof validationStates] && (
                <p className="text-xs text-red-500 mt-1">
                  Please enter a valid {platform.name} URL
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
