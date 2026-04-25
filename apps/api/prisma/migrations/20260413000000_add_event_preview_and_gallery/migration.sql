-- AlterTable: add preview_image_url and images gallery to events
ALTER TABLE "events"
  ADD COLUMN IF NOT EXISTS "preview_image_url" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "images" JSONB NOT NULL DEFAULT '[]';
