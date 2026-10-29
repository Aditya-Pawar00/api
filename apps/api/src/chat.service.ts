import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class ChatService {
  private messages: any[] = [];

  constructor(private prisma: PrismaService) {}

  async getMessages(userId: string) {
    if (this.messages.length === 0) {
      this.messages.push({
        id: 'msg-init-1',
        sender: 'doctor',
        doctorName: 'Dr. Sarah Connor',
        text: 'Hello Amol! I see your confirmed consultation for Oct 29 regarding your blood pressure review. Your latest vitals (BP 120/80, Pulse 72) look optimal. How are you feeling today?',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
    return this.messages;
  }

  async sendMessage(userId: string, text: string) {
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'patient',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.messages.push(userMsg);

    let doctorReply = 'Thank you for updating me, Amol. I have logged this into your electronic clinical chart. Please continue monitoring your readings.';
    const lower = text.toLowerCase();

    if (lower.includes('bp') || lower.includes('blood pressure') || lower.includes('reading') || lower.includes('130') || lower.includes('140')) {
      doctorReply = 'A reading around 120-130 systolic is manageable. Make sure you take your reading while seated after 5 minutes of rest, avoid caffeine beforehand, and keep a log for our upcoming appointment.';
    } else if (lower.includes('pain') || lower.includes('chest') || lower.includes('dizzy') || lower.includes('dizziness')) {
      doctorReply = 'If you experience severe chest tightness or acute shortness of breath, please call emergency services immediately. Otherwise, rest seated and sip cold water.';
    } else if (lower.includes('headache') || lower.includes('migraine')) {
      doctorReply = 'Mild headaches can often accompany subtle blood pressure shifts or dehydration. Drink at least 500ml of water and rest in a dimly lit room.';
    } else if (lower.includes('allergy') || lower.includes('penicillin')) {
      doctorReply = 'I have noted your Penicillin allergy in your medical records. Any medication prescribed through MedCore will automatically use non-penicillin alternatives.';
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('doc')) {
      doctorReply = 'Hello Amol! I am reviewing your chart. Feel free to ask any clinical questions or share your latest biometrics.';
    }

    const docMsg = {
      id: 'msg-' + (Date.now() + 1),
      sender: 'doctor',
      doctorName: 'Dr. Sarah Connor',
      text: doctorReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    this.messages.push(docMsg);

    return { userMsg, docMsg };
  }
}