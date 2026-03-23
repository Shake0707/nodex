import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.upsert({
        where: { username },
        update: { password_hash: passwordHash },
        create: {
            username,
            password_hash: passwordHash,
        },
    });

    console.log(`✅ Admin yaratildi: ${admin.username} (id: ${admin.id})`);

    const membersCount = await prisma.member.count();
    if (membersCount === 0) {
        await prisma.member.createMany({
            data: [
                {
                    name_uz: 'Ism Familiya',
                    name_en: 'First Last',
                    name_ru: 'Имя Фамилия',
                    role_uz: 'Prezident',
                    role_en: 'President',
                    role_ru: 'Президент',
                    description_uz: 'Nodex klubi asoschisi va rahbari',
                    description_en: 'Founder and leader of Nodex club',
                    description_ru: 'Основатель и руководитель клуба Nodex',
                    photo_url: '',
                },
                {
                    name_uz: 'Ism Familiya',
                    name_en: 'First Last',
                    name_ru: 'Имя Фамилия',
                    role_uz: 'CTF jamoasi rahbari',
                    role_en: 'CTF Team Leader',
                    role_ru: 'Руководитель CTF команды',
                    description_uz: 'CTF musobaqalarini tashkil qiladi',
                    description_en: 'Organizes CTF competitions',
                    description_ru: 'Организует CTF соревнования',
                    photo_url: '',
                },
            ],
        });
        console.log('✅ Demo a\'zolar yaratildi');
    }

    const eventsCount = await prisma.event.count();
    if (eventsCount === 0) {
        await prisma.event.createMany({
            data: [
                {
                    title_uz: 'Nodex CTF #1',
                    title_en: 'Nodex CTF #1',
                    title_ru: 'Nodex CTF #1',
                    description_uz: 'Birinchi Nodex CTF musobaqasi',
                    description_en: 'First Nodex CTF competition',
                    description_ru: 'Первое CTF соревнование Nodex',
                    image_url: '',
                    event_date: new Date('2026-04-15'),
                    location: 'Al-Xorazmiy maktabi',
                },
            ],
        });
        console.log('✅ Demo tadbirlar yaratildi');
    }

    const partnersCount = await prisma.partner.count();
    if (partnersCount === 0) {
        await prisma.partner.createMany({
            data: [
                {
                    name: 'Partner 1',
                    logo_image_url: '',
                    website_url: 'https://example.com',
                },
                {
                    name: 'Partner 2',
                    logo_image_url: '',
                    website_url: null,
                },
            ],
        });
        console.log('✅ Demo hamkorlar yaratildi');
    }
}

main()
    .catch((e) => {
        console.error('❌ Seed xatolik:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
