import connectDB from "./lib/db/mongoDB";

export default function Home() {
  (async () => {
    await connectDB();
  })();
  
  return (
    <div>
    </div>
  );
}
