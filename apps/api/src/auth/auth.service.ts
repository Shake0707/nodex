import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    async validateUser(username: string, password: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            throw new UnauthorizedException('Noto\'g\'ri login yoki parol');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Noto\'g\'ri login yoki parol');
        }

        return { id: admin.id, username: admin.username };
    }

    async getProfile(adminId: number) {
        const admin = await this.prisma.admin.findUnique({
            where: { id: adminId },
            select: { id: true, username: true, created_at: true },
        });

        if (!admin) {
            throw new UnauthorizedException('Admin topilmadi');
        }

        return admin;
    }
}
