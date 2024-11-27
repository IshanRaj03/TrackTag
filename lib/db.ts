import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let isConnected = false;

export async function connectDB() {
  if (!process.env.DATABASE_URL)
    return console.error("DATABASE_URL is not set");

  if (isConnected) return console.log("Already connected to the database");
  try {
    await prisma.$connect();
    isConnected = true;
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

// export async function disconnectDB() {
//   try {
//     await prisma.$disconnect();
//     console.log("Disconnected from the database");
//   } catch (error) {
//     console.error("Error disconnecting from the database", error);
//   }
// }

export default prisma;
