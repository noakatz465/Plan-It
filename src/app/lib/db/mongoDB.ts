import mongoose from 'mongoose';

const connectDb = async (): Promise<void> => {
  console.log('inside the connectDB function , still did nothing :)')
   try{
    const MONGODB_URI = process.env.MONGO_URI ;
    console.log(MONGODB_URI);
    if (!MONGODB_URI) {
      throw new Error('Missing MONGO_URI in environment variables');
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);

      console.log('Connected to MongoDB');
    } else {
      console.log('Using existing MongoDB connection');
    }
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
};

export default connectDb;