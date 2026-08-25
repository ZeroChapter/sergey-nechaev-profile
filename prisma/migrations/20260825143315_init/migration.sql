-- CreateTable
CREATE TABLE "Project" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING,
    "url" STRING,
    "github" STRING,
    "skills" STRING[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);
