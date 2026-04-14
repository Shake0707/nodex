import { Module } from '@nestjs/common';
import { StatsController } from './stats.controller';
import { MembersModule } from '../members/members.module';
import { EventsModule } from '../events/events.module';
import { PartnersModule } from '../partners/partners.module';

@Module({
  imports: [MembersModule, EventsModule, PartnersModule],
  controllers: [StatsController],
})
export class StatsModule {}
