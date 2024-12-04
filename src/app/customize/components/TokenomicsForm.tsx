import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { CustomizationFields } from "@/types";
import { FormProps } from "./types";
import React from 'react';

interface TokenomicsFormProps extends FormProps {}

export function TokenomicsForm({ fields, onChange }: TokenomicsFormProps) {
  const handleChange = (key: keyof CustomizationFields['tokenomics'], value: string) => {
    // Allow empty values and only validate non-empty ones
    const numericValue = value === '' ? '' : value.replace(/[^0-9.]/g, '');
    
    onChange({
      tokenomics: {
        ...fields.tokenomics,
        [key]: numericValue
      }
    });
  };

  const tokenomicsFields = [
    {
      key: 'totalSupply',
      label: 'Total Supply',
      emoji: '🚀',
      value: '1000000000',
      suffix: 'tokens'
    },
    {
      key: 'taxBuy',
      label: 'Buy Tax',
      emoji: '💫',
      value: '2',
      suffix: '%'
    },
    {
      key: 'taxSell',
      label: 'Sell Tax',
      emoji: '🌟',
      value: '3',
      suffix: '%'
    },
    {
      key: 'lpLocked',
      label: 'LP Lock',
      emoji: '🔒',
      value: '50',
      suffix: ''
    }
  ];

  // Set initial values if they're not set
  React.useEffect(() => {
    const initialValues = tokenomicsFields.reduce((acc, field) => {
      if (!fields.tokenomics[field.key as keyof CustomizationFields['tokenomics']]) {
        acc[field.key as keyof CustomizationFields['tokenomics']] = field.value;
      }
      return acc;
    }, {} as Partial<CustomizationFields['tokenomics']>);

    if (Object.keys(initialValues).length > 0) {
      onChange({
        tokenomics: {
          ...fields.tokenomics,
          ...initialValues
        }
      });
    }
  }, []);

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {tokenomicsFields.map((field) => (
        <div
          key={field.key}
          className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
        >
          {/* Header */}
          <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-2 justify-center">
              <div className="text-2xl">{field.emoji}</div>
              <h3 className="font-medium">
                {field.label}
              </h3>
            </div>
          </div>

          {/* Input Field */}
          <div className="p-3">
            <div className="relative">
              <Input
                id={field.key}
                value={fields.tokenomics[field.key as keyof CustomizationFields['tokenomics']] ?? ''}
                onChange={(e) => handleChange(field.key as keyof CustomizationFields['tokenomics'], e.target.value)}
                className="pr-14 text-center h-9"
                type="text"
                inputMode="decimal"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                {field.suffix}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
