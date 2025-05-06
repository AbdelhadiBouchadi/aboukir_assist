'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  DownloadCloud,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function WhatsAppSetup() {
  const [step, setStep] = useState(1);
  const [isConnected, setIsConnected] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiKey, setApiKey] = useState('');

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

  const connectWhatsApp = () => {
    // In a real app, this would connect to the WhatsApp Business API
    if (phoneNumber && apiKey) {
      setIsConnected(true);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-8"
    >
      {isConnected ? (
        <motion.div variants={item}>
          <div className="text-center py-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-medium mt-2">WhatsApp Connected!</h3>
            <p className="text-muted-foreground mt-1">
              Your WhatsApp Business account is connected and ready to send
              automated responses.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Connection
              </Button>
              <Button onClick={() => setIsConnected(false)} className="gap-2">
                Disconnect
              </Button>
            </div>

            <div className="mt-8 p-4 bg-muted rounded-lg text-left">
              <h4 className="font-medium">Account Information</h4>
              <dl className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Phone Number:</dt>
                  <dd>{phoneNumber}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd className="text-green-500">Active</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Messages Today:</dt>
                  <dd>24</dd>
                </div>
              </dl>
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div variants={item}>
            <Alert className="bg-primary/5">
              <Smartphone className="h-4 w-4" />
              <AlertTitle>WhatsApp Business API Setup</AlertTitle>
              <AlertDescription>
                Connect your WhatsApp Business API account to enable automated
                responses to patient inquiries.
              </AlertDescription>
            </Alert>
          </motion.div>

          <motion.div variants={item}>
            <div className="flex items-center gap-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                1
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  Create a WhatsApp Business API Account
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  If you don't have one already, create a WhatsApp Business API
                  account.
                </p>
                <Button variant="outline" className="mt-2 gap-2" asChild>
                  <a
                    href="https://business.whatsapp.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Get WhatsApp Business
                  </a>
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="h-8 border-l-2 border-muted ml-4"
          />

          <motion.div variants={item}>
            <div className="flex items-center gap-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                2
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  Enter Your Business Phone Number
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This is the phone number associated with your WhatsApp
                  Business account.
                </p>
                <div className="mt-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+212600000000"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      if (e.target.value && step === 1) setStep(2);
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={item}
            className="h-8 border-l-2 border-muted ml-4"
          />

          <motion.div variants={item}>
            <div className="flex items-center gap-4">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                3
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Enter API Key</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can find this in your WhatsApp Business API dashboard.
                </p>
                <div className="mt-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value);
                      if (e.target.value && step === 2) setStep(3);
                    }}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="flex justify-end">
            <Button
              onClick={connectWhatsApp}
              disabled={!phoneNumber || !apiKey}
            >
              Connect WhatsApp
            </Button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
