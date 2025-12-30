import { query } from "@/lib/db";
import { NextResponse } from "next/server";

function generatePrivateCode(length = 6) {
  // Based on your log "bEgybf", you are using alphanumeric characters
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let privateCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    privateCode += charset[randomIndex];
  }
  return privateCode;
}

async function privateCodeExists(privateCode) {
  try {
    // FIX: Changed 'private_key' to 'private_code'
    // Ensure this column exists in your database!
    const sql = "SELECT COUNT(*) AS count FROM Orders WHERE private_code = ?";
    const result = await query(sql, [privateCode]);
    return result[0].count > 0;
  } catch (error) {
    console.error("Error checking private code existence:", error);
    throw error;
  }
}

async function generateUniquePrivateCode(length = 6) {
  let privateCode;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    privateCode = generatePrivateCode(length);
    attempts++;
    if (attempts > maxAttempts) {
      throw new Error(
        "Unable to generate a unique private code after multiple attempts",
      );
    }
  } while (await privateCodeExists(privateCode));

  return privateCode;
}

export async function GET() {
  try {
    const privateCode = await generateUniquePrivateCode();
    return NextResponse.json({ privateCode });
  } catch (error) {
    console.error("Error generating private code:", error);
    return NextResponse.json(
      { message: "Error generating private code", error: error.message },
      { status: 500 },
    );
  }
}

