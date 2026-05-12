import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSurveyDto } from './dto/create-survey.dto';
import { UpdateSurveyDto } from './dto/update-survey.dto';
import { SubmitRegistrationDto } from './dto/submit-registration.dto';

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async findAllActive() {
    const now = new Date();
    return this.prisma.survey.findMany({
      where: {
        is_active: true,
        starts_at: { lte: now },
        OR: [{ ends_at: null }, { ends_at: { gte: now } }],
      },
      select: {
        id: true,
        marquee_text_uz: true,
        marquee_text_en: true,
        marquee_text_ru: true,
      },
      orderBy: { starts_at: 'desc' },
    });
  }

  async findOnePublic(id: number) {
    const survey = await this.prisma.survey.findUnique({
      where: { id },
      select: {
        id: true,
        title_uz: true,
        title_en: true,
        title_ru: true,
        description_uz: true,
        description_en: true,
        description_ru: true,
      },
    });
    if (!survey) throw new NotFoundException('Opros topilmadi');
    return survey;
  }

  async submitRegistration(surveyId: number, dto: SubmitRegistrationDto) {
    await this.findOnePublic(surveyId);
    return this.prisma.surveyRegistration.create({
      data: {
        survey_id: surveyId,
        first_name: dto.first_name,
        last_name: dto.last_name,
        age: dto.age,
        email: dto.email,
        telegram: dto.telegram ?? null,
        school: dto.school,
        grade: dto.grade,
      },
    });
  }

  async findAll() {
    return this.prisma.survey.findMany({
      orderBy: { created_at: 'desc' },
      include: { _count: { select: { registrations: true } } },
    });
  }

  async findOne(id: number) {
    const survey = await this.prisma.survey.findUnique({ where: { id } });
    if (!survey) throw new NotFoundException('Opros topilmadi');
    return survey;
  }

  async create(dto: CreateSurveyDto, adminId: number) {
    return this.prisma.survey.create({
      data: {
        ...dto,
        starts_at: new Date(dto.starts_at),
        ends_at: dto.ends_at ? new Date(dto.ends_at) : null,
        is_active: dto.is_active ?? false,
        created_by_id: adminId,
      },
    });
  }

  async update(id: number, dto: UpdateSurveyDto, adminId: number) {
    const survey = await this.findOne(id);
    if (survey.created_by_id !== null && survey.created_by_id !== adminId) {
      throw new ForbiddenException('Bu oprosni tahrirlash huquqi yo\'q');
    }
    const data: Record<string, unknown> = { ...dto };
    if (dto.starts_at) data.starts_at = new Date(dto.starts_at);
    if (dto.ends_at !== undefined) data.ends_at = dto.ends_at ? new Date(dto.ends_at) : null;
    return this.prisma.survey.update({ where: { id }, data });
  }

  async remove(id: number, adminId: number) {
    const survey = await this.findOne(id);
    if (survey.created_by_id !== null && survey.created_by_id !== adminId) {
      throw new ForbiddenException('Bu oprosni o\'chirish huquqi yo\'q');
    }
    return this.prisma.survey.delete({ where: { id } });
  }

  async findRegistrations(surveyId: number, adminId: number) {
    const survey = await this.findOne(surveyId);
    if (survey.created_by_id !== null && survey.created_by_id !== adminId) {
      throw new ForbiddenException('Bu opros registratsiyalarini ko\'rish huquqi yo\'q');
    }
    return this.prisma.surveyRegistration.findMany({
      where: { survey_id: surveyId },
      orderBy: { submitted_at: 'desc' },
    });
  }
}
