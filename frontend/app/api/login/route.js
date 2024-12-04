import { connectToDatabase } from "@/app/lib/db";
import User from "@/app/lib/models/User";

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ message: "Email and password are required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectToDatabase();
    
    // Find the user by email and password
    const user = await User.findOne({ email, password });
    
    if (!user) {
      return new Response(JSON.stringify({ message: "Invalid email or password." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return the MongoDB ObjectId as UUID
    return new Response(JSON.stringify({ uuid: user._id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error during login:", err);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
