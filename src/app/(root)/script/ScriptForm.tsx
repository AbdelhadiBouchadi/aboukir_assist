'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { createScript, updateScript } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CirclePlus, CircleX, Loader2, RotateCcw, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Script } from '@prisma/client';

const scriptFormSchema = z.object({
  questionAr: z.string().min(3, {
    message: 'Question in Arabic must be at least 3 characters.',
  }),
  questionFr: z.string().min(3, {
    message: 'Question in French must be at least 3 characters.',
  }),
  responseAr: z.string().min(3, {
    message: 'Response in Arabic must be at least 3 characters.',
  }),
  responseFr: z.string().min(3, {
    message: 'Response in French must be at least 3 characters.',
  }),
  category: z.string(),
  active: z.boolean(),
});

type ScriptFormValues = z.infer<typeof scriptFormSchema>;

const categories = [
  { value: 'general', label: 'General' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'services', label: 'Services' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'emergency', label: 'Emergency' },
] as const;

interface ScriptFormProps {
  defaultValues?: Partial<Script>;
}

export function ScriptForm({ defaultValues = {} }: ScriptFormProps) {
  const router = useRouter();
  const [keywords, setKeywords] = useState<string[]>(
    defaultValues.keywords || []
  );
  const [keyword, setKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScriptFormValues>({
    resolver: zodResolver(scriptFormSchema),
    defaultValues: {
      questionAr: defaultValues.questionAr || '',
      questionFr: defaultValues.questionFr || '',
      responseAr: defaultValues.responseAr || '',
      responseFr: defaultValues.responseFr || '',
      category: defaultValues.category || 'general',
      active: defaultValues.active ?? true,
    },
  });

  const addKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
      setKeyword('');
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== keywordToRemove));
  };

  const onSubmit = async (data: ScriptFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = {
        ...data,
        keywords,
      };

      if ('id' in defaultValues && defaultValues.id) {
        await updateScript(defaultValues.id, formData);
      } else {
        await createScript(formData);
      }

      router.push('/script');
      router.refresh();
    } catch (error) {
      console.error('Error saving script:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="max-w-3xl mx-auto"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="questionAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question (Arabic)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل السؤال بالعربية"
                      {...field}
                      className="font-sans text-right resize-y min-h-[100px]"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the question in Arabic that patients might ask.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="questionFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question (French)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez la question en français"
                      {...field}
                      className="resize-y min-h-[100px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the question in French that patients might ask.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="responseAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response (Arabic)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل الاستجابة بالعربية"
                      {...field}
                      className="font-sans text-right resize-y min-h-[120px]"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the response in Arabic that the system will provide.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="responseFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response (French)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez la réponse en français"
                      {...field}
                      className="resize-y min-h-[120px]"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the response in French that the system will provide.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <div className="space-y-4">
              <FormLabel>Keywords</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addKeyword();
                    }
                  }}
                  className="flex-1"
                />
                <Button type="button" onClick={addKeyword} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((kw, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    {kw}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => removeKeyword(kw)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              <FormDescription>
                Add keywords that will help match this script entry with patient
                questions.
              </FormDescription>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a category to organize script entries.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      If checked, this script entry will be used for matching
                      patient questions.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item} className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/script')}
              disabled={isSubmitting}
              className="w-24"
            >
              Cancel
              <CircleX className="size-6" />
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-24">
              {isSubmitting ? (
                <div className="flex items-center gap-2 ">
                  Saving
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : defaultValues.id ? (
                <div className="flex items-center gap-2">
                  Update
                  <RotateCcw className="size-6" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create
                  <CirclePlus className="size-6" />
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
