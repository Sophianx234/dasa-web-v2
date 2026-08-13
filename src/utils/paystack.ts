export const getPayStackConfig = (amount: string, email: string) => {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  // Fallback to a test key or allow skipping throw for demo purposes if env is missing
  if (!publicKey) {
    console.warn('Missing Next.js Paystack public key environment variable');
  }
  
  return {
    reference: new Date().getTime().toString(), // Always unique
    email: email || "student@dasa-ug.com",
    amount: +amount * 100, // Amount is in pesewas (GHS)
    currency: 'GHS',
    publicKey: publicKey || "pk_test_dummy",
  };
};
