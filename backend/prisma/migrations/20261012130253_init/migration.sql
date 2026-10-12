-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('Sport', 'Party', 'Social', 'Music', 'IT & Networking', 'Education', 'Family', 'Culture', 'Volunteering', 'Other');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('open', 'almost-full', 'fully-booked', 'closed', 'cancelled');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EventCategory" NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "bundesland" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "address" TEXT,
    "participantLimit" INTEGER,
    "registeredCount" INTEGER NOT NULL DEFAULT 0,
    "status" "EventStatus" NOT NULL,
    "creatorId" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "updatedAt" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_bundesland_city_idx" ON "events"("bundesland", "city");

-- CreateIndex
CREATE INDEX "events_date_idx" ON "events"("date");
