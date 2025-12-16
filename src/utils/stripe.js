import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here');

export const createPaymentIntent = async (amount, currency = 'zar', metadata = {}) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Stripe uses cents
        currency,
        metadata
      }),
    });

    const { client_secret } = await response.json();
    return client_secret;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export default stripePromise;