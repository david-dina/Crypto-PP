import { AuthOptions } from 'next-auth';

export const authConfig: AuthOptions = {
  // Your existing configuration
  secret: process.env.NEXTAUTH_SECRET || 'your_generated_secret_here',
  // Add other configurations as needed
};
