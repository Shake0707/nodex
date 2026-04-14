import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.partner.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    const partner = await this.prisma.partner.findUnique({ where: { id } });
    if (!partner) throw new NotFoundException('Hamkor topilmadi');
    return partner;
  }

  async create(data: Prisma.PartnerCreateInput) {
    return this.prisma.partner.create({ data });
  }

  async update(id: number, data: Prisma.PartnerUpdateInput) {
    await this.findOne(id);
    return this.prisma.partner.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.partner.delete({ where: { id } });
  }

  async count() {
    return this.prisma.partner.count();
  }
}
