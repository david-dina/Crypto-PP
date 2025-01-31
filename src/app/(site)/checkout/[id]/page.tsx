import React from 'react';
import { CheckoutInfo } from '@/components/Checkout/CheckoutInfo';

// Sample data for available cryptocurrencies


// Sample product data
const productData = {
  name: "Premium Subscription Plan",
  description: "12-month access to all premium features",
  priceUSD: 199.99,
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutInfo/>
    </div>
  );
}