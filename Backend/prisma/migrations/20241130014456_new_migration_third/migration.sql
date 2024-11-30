/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Owners` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownedBy` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "ownedBy" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Owners_email_key" ON "Owners"("email");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_ownedBy_fkey" FOREIGN KEY ("ownedBy") REFERENCES "Owners"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
