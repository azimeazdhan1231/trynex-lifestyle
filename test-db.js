
const postgres = require('postgres');

console.log('Testing database connection...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('DATABASE_URL preview:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'NOT FOUND');

if (process.env.DATABASE_URL) {
  const client = postgres(process.env.DATABASE_URL);
  
  client`SELECT 1 as test`
    .then(result => {
      console.log('✅ Database connection successful!', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Database connection failed:', error.message);
      process.exit(1);
    });
} else {
  console.error('❌ DATABASE_URL environment variable not found');
  process.exit(1);
}
