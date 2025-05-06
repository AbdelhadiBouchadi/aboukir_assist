'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { updateSettings } from '@/lib/actions';

const settingsFormSchema = z.object({
  welcomeMessageAr: z.string().min(3, {
    message: 'Welcome message in Arabic must be at least 3 characters.',
  }),
  welcomeMessageFr: z.string().min(3, {
    message: 'Welcome message in French must be at least 3 characters.',
  }),
  matchThreshold: z.number().min(0.1).max(1),
  autoReplyEnabled: z.boolean(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

interface SettingsFormProps {
  defaultValues: {
    welcomeMessageAr: string;
    welcomeMessageFr: string;
    matchThreshold: number;
    autoReplyEnabled: boolean;
  };
}

export function SettingsForm({ defaultValues }: SettingsFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      welcomeMessageAr: defaultValues.welcomeMessageAr,
      welcomeMessageFr: defaultValues.welcomeMessageFr,
      matchThreshold: defaultValues.matchThreshold,
      autoReplyEnabled: defaultValues.autoReplyEnabled,
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      await updateSettings(data);

      toast({
        title: 'Settings updated',
        description: 'Your settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);

      toast({
        title: 'Error',
        description: 'There was a problem saving your settings.',
        variant: 'destructive',
      });
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
    <motion.div initial="hidden" animate="show" variants={container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="welcomeMessageAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message (Arabic)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل رسالة الترحيب بالعربية"
                      {...field}
                      className="font-sans text-right"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent to new Arabic-speaking patients
                    when they first contact the system.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="welcomeMessageFr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Welcome Message (French)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez le message de bienvenue en français"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This message will be sent to new French-speaking patients
                    when they first contact the system.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="matchThreshold"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>
                    Match Threshold ({Math.round(value * 100)}%)
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={10}
                      max={100}
                      step={1}
                      defaultValue={[value * 100]}
                      onValueChange={(vals) => onChange(vals[0] / 100)}
                      {...fieldProps}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum similarity score required for a question to match a
                    script entry. Higher values require more exact matches.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item}>
            <FormField
              control={form.control}
              name="autoReplyEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Automatic Replies
                    </FormLabel>
                    <FormDescription>
                      Enable or disable automatic responses to patient messages.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </motion.div>

          <motion.div variants={item} className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Settings'}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
