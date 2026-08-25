/*
  Warnings:

  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Project` table. All the data in the column will be lost.
  - Added the required column `name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profileId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "avatarUrl" STRING;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description";
ALTER TABLE "Project" DROP COLUMN "github";
ALTER TABLE "Project" DROP COLUMN "skills";
ALTER TABLE "Project" DROP COLUMN "title";
ALTER TABLE "Project" ADD COLUMN     "name" STRING NOT NULL;
ALTER TABLE "Project" ADD COLUMN     "profileId" STRING NOT NULL;
ALTER TABLE "Project" ADD COLUMN     "repoUrl" STRING;
ALTER TABLE "Project" ADD COLUMN     "summary" STRING;

-- CreateTable
CREATE TABLE "Experience" (
    "id" STRING NOT NULL,
    "company" STRING NOT NULL,
    "role" STRING NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" STRING,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "profileId" STRING NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Skill_profileId_name_key" ON "Skill"("profileId", "name");

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
