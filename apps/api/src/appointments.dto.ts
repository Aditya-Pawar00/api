import { IsNotEmpty, IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AppointmentType } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'doctor-profile-uuid' })
  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @ApiProperty({ example: '2026-11-01T10:00:00.000Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ example: 'Regular Cardiovascular Checkup' })
  @IsString()
  @IsNotEmpty()
  reason: string;

  @ApiProperty({ enum: AppointmentType, default: AppointmentType.IN_PERSON })
  @IsEnum(AppointmentType)
  type: AppointmentType;

  @ApiProperty({ example: 'Experiencing mild shortness of breath on exertion', required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
