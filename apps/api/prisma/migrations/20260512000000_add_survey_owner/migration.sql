-- AlterTable
ALTER TABLE "surveys" ADD COLUMN "created_by_id" INTEGER;

-- AddForeignKey
ALTER TABLE "surveys" ADD CONSTRAINT "surveys_created_by_id_fkey"
  FOREIGN KEY ("created_by_id") REFERENCES "admins"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
