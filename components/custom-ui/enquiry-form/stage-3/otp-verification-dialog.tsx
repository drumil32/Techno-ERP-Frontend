import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader
} from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { verifyOtp } from './documents-section/helpers/apiRequest';
import { ShieldCheck } from 'lucide-react';

interface OtpVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  enquiryId: string;
  onSuccess: () => void;
  userEmail: string;
}

export function OtpVerificationDialog({
  open,
  onOpenChange,
  enquiryId,
  onSuccess,
  userEmail
}: OtpVerificationDialogProps) {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!open) return;

    setTimeLeft(600);
    setOtp('');

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData);

      setTimeout(() => {
        const submitButton = document.getElementById('otp-submit-button');
        if (submitButton) submitButton.focus();
      }, 100);
    } else {
      toast.error('Please paste a valid 6-digit OTP');
    }
  };

  const handleSubmit = async () => {
    if (timeLeft <= 0) {
      toast.error('OTP has expired. Please request a new one.');
      return;
    }

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await verifyOtp(enquiryId, otp);
      toast.success('OTP verified successfully!');
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during OTP verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          setOtp('');
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className=" bg-green-200/70 rounded-full p-4 mx-auto">
            <ShieldCheck className="w-8 h-8 text-green-600 " />
          </div>
          <DialogTitle className="text-center">Verify Your Identity</DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              We've sent a 6-digit verification code to{' '}
              <span className="font-semibold">{userEmail}</span>.
            </p>
            {timeLeft <= 0 && (
              <p className="text-red-500 font-medium">
                OTP expired. Please close this dialog and try again to receive a new code.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4" onPaste={handlePaste}>
          <div className="flex justify-center space-x-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-mono"
                value={otp[index] || ''}
                onChange={(e) => {
                  if (!/^\d*$/.test(e.target.value)) return;
                  const newOtp = otp.split('');
                  newOtp[index] = e.target.value;
                  setOtp(newOtp.join(''));

                  if (e.target.value && index < 5) {
                    const nextInput = document.getElementById(`otp-input-${index + 1}`);
                    if (nextInput) nextInput.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !otp[index] && index > 0) {
                    const prevInput = document.getElementById(`otp-input-${index - 1}`);
                    if (prevInput) prevInput.focus();
                  }
                }}
                id={`otp-input-${index}`}
                disabled={timeLeft <= 0}
              />
            ))}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || otp.length !== 6 || timeLeft <= 0}
            id="otp-submit-button"
          >
            {isSubmitting
              ? 'Verifying...'
              : `Verify OTP${timeLeft > 0 ? ` (Expires in ${formatTime(timeLeft)})` : ''}`}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Pro tip: You can paste the entire 6-digit code directly into any field
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
