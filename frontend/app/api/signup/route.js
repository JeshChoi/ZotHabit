import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO_CONNECTION_URI; // MongoDB connection URI
const client = new MongoClient(uri);
const dbName = "Users";

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
    await client.connect();
    const db = client.db(dbName);

    // Check if email already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email is already registered." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Insert new user, MongoDB generates a unique _id
    const result = await db.collection("users").insertOne({
      _id: new ObjectId(), // Optional, MongoDB generates this by default
      username,
      email,
      password,
    });

    return new Response(
      JSON.stringify({ uuid: result.insertedId }), // Return the MongoDB-generated ObjectId
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
  } finally {
    await client.close();
  }
}
