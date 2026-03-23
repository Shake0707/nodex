import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MembersService } from './members.service';
import { AuthGuard } from '../auth/auth.guard';
import { Prisma } from '@prisma/client';

@Controller('members')
export class MembersController {
    constructor(private membersService: MembersService) { }

    // Public
    @Get()
    async findAll() {
        const data = await this.membersService.findAll();
        return { success: true, data };
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const data = await this.membersService.findOne(id);
        return { success: true, data };
    }

    // Admin only
    @Post()
    @UseGuards(AuthGuard)
    async create(@Body() body: Prisma.MemberCreateInput) {
        const data = await this.membersService.create(body);
        return { success: true, data };
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: Prisma.MemberUpdateInput,
    ) {
        const data = await this.membersService.update(id, body);
        return { success: true, data };
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.membersService.remove(id);
        return { success: true, message: 'A\'zo o\'chirildi' };
    }
}
