import { Controller, Post, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './appointments.dto';
import { JwtAuthGuard, CurrentUser } from './auth/auth.guard';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private apptService: AppointmentsService) {}

  @Get('doctors')
  @ApiOperation({ summary: 'List all available specialist doctors' })
  getDoctors() {
    return this.apptService.getDoctors();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Book an appointment with a doctor' })
  book(@CurrentUser('id') userId: string, @Body() dto: CreateAppointmentDto) {
    return this.apptService.createAppointment(userId, dto);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all scheduled appointments for current user' })
  getMy(@CurrentUser() user: any) {
    return this.apptService.getMyAppointments(user);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an appointment' })
  cancel(@Param('id') id: string) {
    return this.apptService.cancelAppointment(id);
  }
}
