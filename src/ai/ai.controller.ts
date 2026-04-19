import { Controller, Get, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('suggest-tasks')
    async suggestTasks(@Query('project') project: string) {
        const suggestions = await this.aiService.suggestTasks(project);
        return { suggestions };
    }
}