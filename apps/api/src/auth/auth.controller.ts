import { Controller, Post, Body, Get, Req, HttpCode, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Throttle } from '@nestjs/throttler';
import type { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @HttpCode(200)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async login(
        @Body() body: { username: string; password: string },
        @Req() req: Request,
    ) {
        const admin = await this.authService.validateUser(body.username, body.password);

        (req.session as any).adminId = admin.id;
        (req.session as any).isAuthenticated = true;

        return { success: true, data: admin };
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@Req() req: Request) {
        return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject({ success: false, message: 'Logout xatolik' });
                }
                resolve({ success: true, message: 'Tizimdan chiqildi' });
            });
        });
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async getProfile(@Req() req: Request) {
        const adminId = (req.session as any).adminId;
        const profile = await this.authService.getProfile(adminId);
        return { success: true, data: profile };
    }
}
