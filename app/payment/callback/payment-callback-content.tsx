'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyPayment = async () => {
      const orderId = searchParams.get('order_id');

      if (!orderId) {
        setStatus('failed');
        setMessage('Invalid payment reference. Order ID not found.');
        return;
      }

      try {
        const response = await fetch(`/api/payment/verify?order_id=${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Payment verification failed');
        }

        if (data.success && data.payment_status === 'SUCCESS') {
          setStatus('success');
          setMessage('Payment successful! Redirecting to strategies...');

          // Start countdown
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                router.push('/strategy/2');
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => clearInterval(interval);
        } else {
          setStatus('failed');
          setMessage(data.message || 'Payment was not successful. Please try again.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage(error instanceof Error ? error.message : 'Failed to verify payment');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            )}
            {status === 'failed' && (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Processing Payment'}
            {status === 'success' && 'Payment Successful!'}
            {status === 'failed' && 'Payment Failed'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' && (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
              <Button
                onClick={() => router.push('/strategy/2')}
                className="w-full"
              >
                Go to Strategies Now
              </Button>
            </div>
          )}

          {status === 'failed' && (
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/checkout')}
                className="w-full"
                variant="default"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push('/')}
                className="w-full"
                variant="outline"
              >
                Go to Home
              </Button>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center text-sm text-muted-foreground">
              <p>Please do not close this window</p>
              <p className="mt-1">This may take a few moments...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
