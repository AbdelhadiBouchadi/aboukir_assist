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
import { updateSettings } from '@/lib/actions';
import toast from 'react-hot-toast';
import { CircleCheckBig, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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

      toast.success('Paramètres Enregistrés avec succès');
      router.push('/');
    } catch (error) {
      console.error('Error saving settings:', error);

      toast.error('Une erreure est survenue');
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
                  <FormLabel>Message de bienvenue (Arabe)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أدخل رسالة الترحيب بالعربية"
                      {...field}
                      className="font-sans text-right"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormDescription>
                    Ce message sera envoyé aux nouveaux patients arabophones
                    lors de leur premier contact avec le système.
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
                  <FormLabel>Message de bienvenue (Français)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez le message de bienvenue en français"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Ce message sera envoyé aux nouveaux patients francophones
                    lors de leur premier contact avec le système.
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
                    Seuil de correspondance ({Math.round(value * 100)}%)
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
                    Score de similarité minimal requis pour qu'une question
                    corresponde à une entrée de script. Des valeurs plus élevées
                    nécessitent des correspondances plus exactes.
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
                      Réponses automatiques
                    </FormLabel>
                    <FormDescription>
                      Activer ou désactiver les réponses automatiques aux
                      messages des patients.
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
              {isSubmitting ? (
                <div className="flex items-center gap-2 ">
                  En cours
                  <Loader2 className="size-6 animate-spin" />
                </div>
              ) : (
                <div className="flex items-center gap-2 ">
                  Enregistrer
                  <CircleCheckBig className="size-6 " />
                </div>
              )}
            </Button>
          </motion.div>
        </form>
      </Form>
    </motion.div>
  );
}
