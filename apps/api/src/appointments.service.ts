import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateAppointmentDto } from './appointments.dto';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AppointmentsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    // Seed initial specialist doctors if none exist
    const docCount = await this.prisma.doctorProfile.count();
    if (docCount === 0) {
      console.log('🌱 Seeding specialist clinical faculty...');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('DoctorPass123!', salt);

      const docs = [
        { email: 'dr.sarah@medcore.com', first: 'Dr. Sarah', last: 'Connor', spec: 'Cardiology', dep: 'Heart & Vascular', fee: 120.0, exp: 14, bio: 'Board-certified cardiologist specializing in structural heart disease and preventative cardiology.' },
        { email: 'dr.alex@medcore.com', first: 'Dr. Alex', last: 'Mercer', spec: 'Neurology', dep: 'Neuroscience Center', fee: 150.0, exp: 11, bio: 'Specialist in cerebrovascular health, neuro-rehabilitation, and acute migraine interventions.' },
        { email: 'dr.maya@medcore.com', first: 'Dr. Maya', last: 'Patel', spec: 'Endocrinology', dep: 'Metabolic Health', fee: 95.0, exp: 8, bio: 'Expert in diabetes management, thyroid disorders, and preventative metabolic wellness.' },
      ];

      for (const d of docs) {
        const u = await this.prisma.user.create({
          data: { email: d.email, passwordHash: hash, firstName: d.first, lastName: d.last, role: Role.DOCTOR },
        });
        await this.prisma.doctorProfile.create({
          data: {
            userId: u.id,
            licenseNumber: 'LIC-' + Math.floor(100000 + Math.random() * 900000),
            specialization: d.spec,
            department: d.dep,
            consultationFee: d.fee,
            experienceYears: d.exp,
            bio: d.bio,
          },
        });
      }
      console.log('✅ 3 Specialist Doctors Seeded!');
    }
  }

  async getDoctors() {
    return this.prisma.doctorProfile.findMany({
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
      },
      orderBy: { experienceYears: 'desc' },
    });
  }

  async createAppointment(userId: string, dto: CreateAppointmentDto) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException('Patient profile not found');

    const doctor = await this.prisma.doctorProfile.findUnique({ where: { id: dto.doctorId } });
    if (!doctor) throw new NotFoundException('Doctor not found');

    const start = new Date(dto.startTime);
    const end = new Date(start.getTime() + 45 * 60 * 1000); // 45 min slot

    return this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        startTime: start,
        endTime: end,
        reason: dto.reason,
        type: dto.type,
        notes: dto.notes,
        status: 'CONFIRMED',
      },
      include: {
        doctor: { include: { user: true } },
      },
    });
  }

  async getMyAppointments(user: any) {
    if (user.role === Role.DOCTOR) {
      const doc = await this.prisma.doctorProfile.findUnique({ where: { userId: user.id } });
      if (!doc) return [];
      return this.prisma.appointment.findMany({
        where: { doctorId: doc.id },
        include: { patient: { include: { user: true } } },
        orderBy: { startTime: 'asc' },
      });
    } else {
      const patient = await this.prisma.patientProfile.findUnique({ where: { userId: user.id } });
      if (!patient) return [];
      return this.prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { user: true } } },
        orderBy: { startTime: 'asc' },
      });
    }
  }

  async cancelAppointment(id: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
