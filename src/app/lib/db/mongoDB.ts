import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL || ""; 

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:" + error);
  }
};

export default connect;