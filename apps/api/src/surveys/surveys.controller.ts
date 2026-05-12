import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { SurveysService } from './surveys.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SubmitRegistrationDto } from './dto/submit-registration.dto';

@Controller('surveys')
export class SurveysController {
  constructor(private surveysService: SurveysService) {}

  // Public
  @Get('active')
  async findAllActive() {
    const data = await this.surveysService.findAllActive();
    return { success: true, data };
  }

  @Get(':id/public')
  async findOnePublic(@Param('id', ParseIntPipe) id: number) {
    const data = await this.surveysService.findOnePublic(id);
    return { success: true, data };
  }

  @Post(':id/register')
  @UsePipes(new ValidationPipe({ transform: true }))
  async register(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SubmitRegistrationDto,
  ) {
    const data = await this.surveysService.submitRegistration(id, dto);
    return { success: true, data };
  }

  // Admin only
  @Get()
  @UseGuards(AuthGuard)
  async findAll() {
    const data = await this.surveysService.findAll();
    return { success: true, data };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.surveysService.findOne(id);
    return { success: true, data };
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() dto: CreateSurveyDto, @Req() req: Request) {
    const data = await this.surveysService.create(dto, req.session.adminId!);
    return { success: true, data };
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSurveyDto,
    @Req() req: Request,
  ) {
    const data = await this.surveysService.update(id, dto, req.session.adminId!);
    return { success: true, data };
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    await this.surveysService.remove(id, req.session.adminId!);
    return { success: true, message: "Opros o'chirildi" };
  }

  @Get(':id/registrations')
  @UseGuards(AuthGuard)
  async findRegistrations(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const data = await this.surveysService.findRegistrations(id, req.session.adminId!);
    return { success: true, data };
  }
}
