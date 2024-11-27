import { CustomizationFields } from '@/types';

export interface FormProps {
  fields: CustomizationFields;
  onChange: (fields: Partial<CustomizationFields>) => void;
}
