// Simple utility to test environment variables in browser
export const testEnvironmentVariables = () => {
  console.log('🔍 Environment Variables Test:');
  console.log('VITE_MONGODB_URI:', import.meta.env.VITE_MONGODB_URI ? '✅ Available' : '❌ Not found');
  console.log('NODE_ENV:', import.meta.env.NODE_ENV);
  console.log('DEV:', import.meta.env.DEV);
  console.log('PROD:', import.meta.env.PROD);
  
  // Test MongoDB URI format
  const mongoUri = import.meta.env.VITE_MONGODB_URI;
  if (mongoUri) {
    const isValidFormat = mongoUri.includes('mongodb+srv://') && mongoUri.includes('mongodb.net');
    console.log('MongoDB URI Format:', isValidFormat ? '✅ Valid' : '❌ Invalid');
  }
};

// Call this function to test
if (import.meta.env.DEV) {
  testEnvironmentVariables();
}