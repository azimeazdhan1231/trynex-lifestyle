import { MongoClient } from 'mongodb';

let client: MongoClient;
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected && client) {
    return client;
  }

  // Only try MongoDB if DATABASE_URL is provided
  if (!process.env.DATABASE_URL) {
    console.log('No DATABASE_URL provided, using in-memory storage for development');
    isConnected = false;
    return null;
  }

  try {
    const uri = process.env.DATABASE_URL;
    console.log('Connecting to MongoDB...');

    client = new MongoClient(uri);
    await client.connect();

    // Test the connection
    await client.db().command({ ping: 1 });
    console.log('Connected to MongoDB successfully');

    isConnected = true;
    return client;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Fall back to in-memory storage if MongoDB is not available
    console.log('Falling back to in-memory storage');
    isConnected = false;
    return null;
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client?.db('trynex') || null;
}

export const connectDB = connectToDatabase;
export { connectToDatabase as db };