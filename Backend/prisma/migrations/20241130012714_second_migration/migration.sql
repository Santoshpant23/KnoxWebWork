-- CreateTable
CREATE TABLE "Owners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Owners_pkey" PRIMARY KEY ("id")
);
