import { connectToDatabase } from "@/app/lib/db";
import User from "@/app/lib/models/User";

export async function POST(request) {
  const { username, email, password } = await request.json();

  // Validate input
  if (!username || !email || !password) {
    return new Response(JSON.stringify({ message: "All fields are required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    await connectToDatabase();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email is already registered." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert new user, MongoDB generates a unique _id
    const newUser = User( {username, email, password });
    const savedUser = await newUser.save()
    return new Response(
      JSON.stringify({ uuid: savedUser._id }), // Return the MongoDB-generated ObjectId
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal server error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
