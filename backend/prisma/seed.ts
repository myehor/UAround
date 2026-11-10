import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import { mockEvents } from "../src/data/mockEvents.js";

import type { EventCreateManyInput } from "../generated/prisma/models/Event.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured in the .env file");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

function mapCategory(category: string): EventCreateManyInput["category"] {
  if (category === "IT & Networking") {
    return "IT_NETWORKING";
  }

  return category as EventCreateManyInput["category"];
}

function mapStatus(status: string): EventCreateManyInput["status"] {
  if (status === "almost-full") {
    return "almostFull";
  }

  if (status === "fully-booked") {
    return "fullyBooked";
  }

  return status as EventCreateManyInput["status"];
}

async function main() {
  const events: EventCreateManyInput[] = mockEvents.map((event) => ({
    ...event,
    category: mapCategory(event.category),
    status: mapStatus(event.status),
  }));

  const result = await prisma.event.createMany({
    data: events,
    skipDuplicates: true,
  });

  console.log(`Seed completed. Added ${result.count} events.`);
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
