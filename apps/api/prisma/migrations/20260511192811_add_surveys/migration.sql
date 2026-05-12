-- CreateTable
CREATE TABLE "surveys" (
    "id" SERIAL NOT NULL,
    "title_uz" TEXT NOT NULL,
    "title_en" TEXT NOT NULL,
    "title_ru" TEXT NOT NULL,
    "description_uz" TEXT NOT NULL,
    "description_en" TEXT NOT NULL,
    "description_ru" TEXT NOT NULL,
    "marquee_text_uz" TEXT NOT NULL,
    "marquee_text_en" TEXT NOT NULL,
    "marquee_text_ru" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "surveys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "survey_registrations" (
    "id" SERIAL NOT NULL,
    "survey_id" INTEGER NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "telegram" TEXT,
    "school" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_registrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "survey_registrations" ADD CONSTRAINT "survey_registrations_survey_id_fkey" FOREIGN KEY ("survey_id") REFERENCES "surveys"("id") ON DELETE CASCADE ON UPDATE CASCADE;
