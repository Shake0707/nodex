import { Controller, Get } from '@nestjs/common';
import { MembersService } from '../members/members.service';
import { EventsService } from '../events/events.service';
import { PartnersService } from '../partners/partners.service';

@Controller('stats')
export class StatsController {
    constructor(
        private membersService: MembersService,
        private eventsService: EventsService,
        private partnersService: PartnersService,
    ) { }

    @Get()
    async getStats() {
        const [members_count, events_count, partners_count] = await Promise.all([
            this.membersService.count(),
            this.eventsService.count(),
            this.partnersService.count(),
        ]);

        return {
            success: true,
            data: { members_count, events_count, partners_count },
        };
    }
}
