import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MembersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.member.findMany({
            orderBy: { created_at: 'desc' },
        });
    }

    async findOne(id: number) {
        const member = await this.prisma.member.findUnique({ where: { id } });
        if (!member) throw new NotFoundException('A\'zo topilmadi');
        return member;
    }

    async create(data: Prisma.MemberCreateInput) {
        return this.prisma.member.create({ data });
    }

    async update(id: number, data: Prisma.MemberUpdateInput) {
        await this.findOne(id);
        return this.prisma.member.update({ where: { id }, data });
    }

    async remove(id: number) {
        await this.findOne(id);
        return this.prisma.member.delete({ where: { id } });
    }

    async count() {
        return this.prisma.member.count();
    }
}
