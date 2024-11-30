-- AlterTable
ALTER TABLE "GameMove" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "GameRequest" ADD COLUMN     "deletedAt" TIMESTAMP(3);
