import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { EhrService } from './ehr.service';
import { JwtAuthGuard } from './auth/auth.guard';

@Controller('ehr')
@UseGuards(JwtAuthGuard)
export class EhrController {
  constructor(private ehrService: EhrService) {}

  @Get('my')
  getMyEhr(@Req() req: any) {
    return this.ehrService.getPatientEhr(req.user.id);
  }

  @Post('vitals')
  addVitals(@Req() req: any, @Body() body: any) {
    return this.ehrService.addVitals(req.user.id, body);
  }

  @Post('records')
  addRecord(@Req() req: any, @Body() body: any) {
    return this.ehrService.addRecord(req.user.id, body);
  }

  @Post('allergies')
  addAllergy(@Req() req: any, @Body() body: { allergy: string }) {
    return this.ehrService.addAllergy(req.user.id, body.allergy);
  }
}
