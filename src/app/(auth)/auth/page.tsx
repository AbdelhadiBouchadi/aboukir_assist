'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Stethoscope } from 'lucide-react';
import { verifyOTP } from '@/lib/auth';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp';
import toast from 'react-hot-toast';

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState('');

  const handleVerify = async (e: React.SyntheticEvent<EventTarget>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await verifyOTP(otp);

      if (result.success) {
        toast.success('Logged in successfully');
        router.push('/');
      } else {
        setError(result.error || 'Invalid OTP code');
      }
    } catch (error) {
      toast.error('OTP Incorrect');
      console.error('Verification error:', error);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <Stethoscope className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-center">Aboukir Assist</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">
            WhatsApp Automation for Dental Clinics
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Enter OTP Code</CardTitle>
            <CardDescription>
              Enter the verification code to access the admin panel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleVerify}>
            <CardContent className="space-y-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="otp">Verification Code</Label>
                <InputOTP
                  value={otp}
                  onChange={setOtp}
                  maxLength={6}
                  className="w-full flex justify-center items-center"
                >
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} className="w-full" />
                    <InputOTPSlot index={1} className="w-full" />
                    <InputOTPSlot index={2} className="w-full" />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={3} className="w-full" />
                    <InputOTPSlot index={4} className="w-full" />
                    <InputOTPSlot index={5} className="w-full" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              {error && <div className="text-sm text-destructive">{error}</div>}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-4">
                    Verifying
                    <Loader2 className="animate-spin size-6" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    Verify
                    <CheckCircle className="size-6" />
                  </div>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
