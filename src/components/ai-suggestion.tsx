'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Sparkles } from 'lucide-react';
import { getAISuggestions } from '@/app/actions';
import type { SimilarMotorData } from '@/lib/types';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type AISuggestionProps = {
  motor: SimilarMotorData;
};

export default function AISuggestion({ motor }: AISuggestionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGetSuggestions = async () => {
    setIsLoading(true);
    setSuggestions(null);

    const result = await getAISuggestions(motor);

    if (result.success) {
      setSuggestions(result.suggestions);
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: result.error || 'An unknown error occurred.',
      });
      setIsOpen(false);
    }

    setIsLoading(false);
  };
  
  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && !suggestions) {
      handleGetSuggestions();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Sparkles className="mr-2 h-4 w-4 text-primary" />
          AI RPM Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI RPM Suggestion</DialogTitle>
          <DialogDescription>
            AI-based RPM suggestion for <span className="font-bold text-foreground">{motor.equipment}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm">
          {isLoading && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          )}
          {suggestions && <p className="whitespace-pre-wrap">{suggestions}</p>}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
