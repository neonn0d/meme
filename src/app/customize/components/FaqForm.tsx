import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CustomizationFields, FaqItem } from "@/types";
import { FormProps } from "./types";
import { Button } from "@/components/ui/button";
import { HelpCircle, PlusCircle, Trash2, MessageCircle } from "lucide-react";

interface FaqFormProps extends FormProps {}

export function FaqForm({ fields, onChange }: FaqFormProps) {
  const addFaq = () => {
    const newFaq: FaqItem = {
      question: '',
      answer: ''
    };
    onChange({
      faq: [...(fields.faq || []), newFaq]
    });
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const updatedFaqs = [...(fields.faq || [])];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value
    };
    onChange({ faq: updatedFaqs });
  };

  const removeFaq = (index: number) => {
    const updatedFaqs = [...(fields.faq || [])];
    updatedFaqs.splice(index, 1);
    onChange({ faq: updatedFaqs });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(fields.faq || []).map((faq, index) => (
          <div
            key={index}
            className="group bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            {/* Preview Header */}
            <div className="relative p-4 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mt-2 font-medium text-center line-clamp-2">
                  {faq.question || 'New Question'}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{faq.answer ? `${faq.answer.length} chars` : 'No answer yet'}</span>
                </div>
              </div>

              {/* Remove Button */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFaq(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            {/* Form Fields */}
            <div className="p-4 space-y-3">
              <div>
                <Label htmlFor={`question-${index}`} className="text-xs font-medium text-gray-600">
                  Question
                </Label>
                <Input
                  id={`question-${index}`}
                  value={faq.question}
                  onChange={(e) => updateFaq(index, 'question', e.target.value)}
                  placeholder="Enter your question"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor={`answer-${index}`} className="text-xs font-medium text-gray-600">
                  Answer
                </Label>
                <Textarea
                  id={`answer-${index}`}
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                  placeholder="Provide a detailed answer"
                  className="mt-1 resize-none"
                  rows={4}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Add FAQ Button */}
        <button
          onClick={addFaq}
          className="h-full min-h-[300px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 transition-colors duration-200 flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary"
        >
          <PlusCircle className="h-8 w-8" />
          <span className="font-medium">Add FAQ</span>
        </button>
      </div>
    </div>
  );
}
