import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { CustomizationFields } from "@/types";
import { FormProps } from "./types";
import React from 'react';
import { 
  Coins, 
  Percent, 
  TrendingUp, 
  Lock
} from "lucide-react";

interface TokenomicsFormProps extends FormProps {}

export function TokenomicsForm({ fields, onChange }: TokenomicsFormProps) {
  const handleChange = (key: keyof CustomizationFields['tokenomics'], value: string) => {
    // Allow empty values and only validate non-empty ones
    let processedValue = value;
    
    // Only apply numeric validation for tax fields and total supply
    if (key !== 'lpLocked') {
      processedValue = value === '' ? '' : value.replace(/[^0-9.]/g, '');
    }
    
    onChange({
      tokenomics: {
        ...fields.tokenomics,
        [key]: processedValue
      }
    });
  };

  const tokenomicsFields = [
    {
      key: 'totalSupply',
      label: 'Total Supply',
      description: 'The maximum number of tokens that will ever exist',
      icon: Coins,
      color: 'bg-blue-50'
    },
    {
      key: 'taxBuy',
      label: 'Buy Tax',
      description: 'Fee charged when someone buys your token',
      icon: Percent,
      color: 'bg-green-50'
    },
    {
      key: 'taxSell',
      label: 'Sell Tax',
      description: 'Fee charged when someone sells your token',
      icon: TrendingUp,
      color: 'bg-red-50'
    },
    {
      key: 'lpLocked',
      label: 'LP Lock',
      description: 'Number of years liquidity is locked in the pool',
      icon: Lock,
      color: 'bg-purple-50',
      suffix: 'Y'
    }
  ];

  // Set initial values if they're not set
  React.useEffect(() => {
    const initialValues = {
      totalSupply: '10000000',
      taxBuy: '2',
      taxSell: '3',
      lpLocked: '2'
    };

    const valuesToSet = Object.entries(initialValues).reduce((acc, [key, value]) => {
      if (!fields.tokenomics[key as keyof CustomizationFields['tokenomics']]) {
        acc[key as keyof CustomizationFields['tokenomics']] = value;
      }
      return acc;
    }, {} as Partial<CustomizationFields['tokenomics']>);

    if (Object.keys(valuesToSet).length > 0) {
      onChange({
        tokenomics: {
          ...fields.tokenomics,
          ...valuesToSet
        }
      });
    }
  }, []);

  return (
    <div className="space-y-3">
      {/* Main Tokenomics Fields */}
      <div className="space-y-3">
        {tokenomicsFields.map((field) => (
          <div
            key={field.key}
            className={`${field.color} rounded-lg overflow-hidden border`}
          >
            <div className="flex items-center p-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <field.icon className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium text-gray-900">{field.label}</h3>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{field.description}</p>
              </div>
              
              <div className="flex items-center">
                <Input
                  id={field.key}
                  value={fields.tokenomics[field.key as keyof CustomizationFields['tokenomics']] ?? ''}
                  onChange={(e) => handleChange(field.key as keyof CustomizationFields['tokenomics'], e.target.value)}
                  className="w-24 text-right h-9"
                  type="text"
                  inputMode="decimal"
                />
                {field.key === 'totalSupply' && (
                  <span className="ml-2 text-sm text-gray-500">tokens</span>
                )}
                {(field.key === 'taxBuy' || field.key === 'taxSell') && (
                  <span className="ml-2 text-sm text-gray-500">%</span>
                )}
                {field.key === 'lpLocked' && (
                  <span className="ml-2 text-sm text-gray-500">Y</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
