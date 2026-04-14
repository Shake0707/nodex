import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PartnersService } from './partners.service';
import { AuthGuard } from '../auth/auth.guard';
import { Prisma } from '@prisma/client';

@Controller('partners')
export class PartnersController {
  constructor(private partnersService: PartnersService) {}

  @Get()
  async findAll() {
    const data = await this.partnersService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.partnersService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: Prisma.PartnerCreateInput) {
    const data = await this.partnersService.create(body);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.PartnerUpdateInput,
  ) {
    const data = await this.partnersService.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.partnersService.remove(id);
    return { success: true, message: "Hamkor o'chirildi" };
  }
}
