"use client";

import React from 'react';
import { CheckoutInfo } from '@/components/Checkout/CheckoutInfo';

// Sample data for available cryptocurrencies
const availableCoins = [
  { symbol: 'ETH', name: 'Ethereum', price: 2850.75 },
  { symbol: 'BTC', name: 'Bitcoin', price: 65400.50 },
  { symbol: 'USDT', name: 'Tether', price: 1.00 },
  { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
  { symbol: 'MATIC', name: 'Polygon', price: 0.85 }
];

// Sample product data
const productData = {
  name: "Premium Subscription Plan",
  description: "12-month access to all premium features",
  priceUSD: 199.99,
};

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutInfo 
        productData={productData}
        availableCoins={availableCoins}
      />
    </div>
  );
}