import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '../auth/auth.guard';
import { Prisma } from '@prisma/client';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @SkipThrottle()
  @Get('search')
  async search(
    @Query('q') q?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sort') sort?: string,
  ) {
    const safeLimit = Math.min(
      Math.max(parseInt(limit || '9', 10) || 9, 1),
      50,
    );
    const result = await this.eventsService.findAllPaginated({
      search: q,
      page: page ? parseInt(page, 10) : 1,
      limit: safeLimit,
      sort:
        (sort as 'date_asc' | 'date_desc' | 'title_asc' | 'title_desc') ||
        'date_desc',
    });
    return { success: true, ...result };
  }

  @Get()
  async findAll() {
    const data = await this.eventsService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.eventsService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@Body() body: Prisma.EventCreateInput) {
    const data = await this.eventsService.create(body);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Prisma.EventUpdateInput,
  ) {
    const data = await this.eventsService.update(id, body);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.eventsService.remove(id);
    return { success: true, message: "Tadbir o'chirildi" };
  }
}
