import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { rateLimit, getClientIp, RateLimitPresets } from '@/lib/rate-limiter';

export async function POST(req: NextRequest) {
  try {
    // Rate limiting - prevent spam order creation
    const clientIp = getClientIp(req);
    const rateLimitResult = rateLimit(clientIp, RateLimitPresets.PAYMENT_CREATE);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      );
    }

    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    // Validate environment variables
    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const paymentAmount = process.env.PAYMENT_AMOUNT || '99';
    const environment = process.env.CASHFREE_ENV || 'sandbox';

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Payment gateway configuration missing' },
        { status: 500 }
      );
    }

    // Generate unique order ID
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const orderId = `order_${Date.now()}_${randomSuffix}`;

    // Prepare order data
    const orderData = {
      order_id: orderId,
      order_amount: parseFloat(paymentAmount),
      order_currency: 'INR',
      customer_details: {
        customer_id: session.user.email || `user_${Date.now()}`,
        customer_email: session.user.email || '',
        customer_name: session.user.name || 'User',
        customer_phone: '9999999999', // You may want to collect this from user profile
      },
      order_meta: {
        return_url: `${process.env.NEXTAUTH_URL}/payment/callback?order_id=${orderId}`,
        notify_url: `${process.env.NEXTAUTH_URL}/api/webhooks/cashfree`,
      },
    };

    // Determine API URL based on environment
    const apiUrl = environment === 'production'
      ? 'https://api.cashfree.com/pg/orders'
      : 'https://sandbox.cashfree.com/pg/orders';

    // Make request to Cashfree API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': clientId,
        'x-client-secret': clientSecret,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cashfree API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to create payment order', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      payment_session_id: data.payment_session_id,
      order_id: orderId,
      order_amount: parseFloat(paymentAmount),
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
