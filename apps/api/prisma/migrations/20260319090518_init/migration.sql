-- CreateTable
CREATE TABLE "members" (
    "id" SERIAL NOT NULL,
    "name_uz" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "name_ru" TEXT NOT NULL,
    "role_uz" TEXT NOT NULL,
    "role_en" TEXT NOT NULL,
    "role_ru" TEXT NOT NULL,
    "description_uz" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ru" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_uz" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ru" TEXT NOT NULL,
    "image_url" TEXT NOT NULL DEFAULT '',
    "event_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo_image_url" TEXT NOT NULL DEFAULT '',
    "website_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");
