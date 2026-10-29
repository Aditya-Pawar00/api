import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('analyze-symptoms')
  analyzeSymptoms(@Body() body: { symptoms: string }) {
    return this.aiService.analyzeSymptoms(body);
  }
}
