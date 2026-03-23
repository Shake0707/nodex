import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.event.findMany({
            orderBy: { event_date: 'desc' },
        });
    }

    async findAllPaginated(params: {
        search?: string;
        page?: number;
        limit?: number;
        sort?: 'date_asc' | 'date_desc' | 'title_asc' | 'title_desc';
    }) {
        const { search, page = 1, limit = 9, sort = 'date_desc' } = params;

        const where: Prisma.EventWhereInput = search
            ? {
                OR: [
                    { title_uz: { contains: search, mode: 'insensitive' } },
                    { title_en: { contains: search, mode: 'insensitive' } },
                    { title_ru: { contains: search, mode: 'insensitive' } },
                    { description_uz: { contains: search, mode: 'insensitive' } },
                    { description_en: { contains: search, mode: 'insensitive' } },
                    { description_ru: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        const orderBy: Prisma.EventOrderByWithRelationInput =
            sort === 'date_asc' ? { event_date: 'asc' }
                : sort === 'title_asc' ? { title_uz: 'asc' }
                    : sort === 'title_desc' ? { title_uz: 'desc' }
                        : { event_date: 'desc' };

        const [data, total] = await Promise.all([
            this.prisma.event.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.event.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findOne(id: number) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) throw new NotFoundException('Tadbir topilmadi');
        return event;
    }

    async create(data: Prisma.EventCreateInput) {
        return this.prisma.event.create({ data });
    }

    async update(id: number, data: Prisma.EventUpdateInput) {
        await this.findOne(id);
        return this.prisma.event.update({ where: { id }, data });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.event.delete({ where: { id } });
    }

    async count() {
        return this.prisma.event.count();
    }
}
