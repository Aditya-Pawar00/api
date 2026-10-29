'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Activity,
  Heart,
  Thermometer,
  Droplets,
  Calendar,
  Clock,
  Video,
  FileText,
  Plus,
  X,
  MessageSquare,
  Send,
  Bot,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Shield,
  User,
  ChevronRight,
  Zap,
  Stethoscope,
  Sliders,
  Check,
  Building2,
  Pill,
  ClipboardCheck,
  Users,
  Search,
  Sparkles
} from 'lucide-react';

interface Doctor {
  id: string;
  specialty: string;
  department: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Appointment {
  id: string;
  dateTime: string;
  status: string;
  reason?: string;
  type?: string;
  patientName?: string;
  doctor?: Doctor;
  doctorName?: string;
}

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  recordDate: string;
  description: string;
}

interface Prescription {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  date: string;
  status: 'DISPENSED' | 'ACTIVE' | 'PENDING';
}

export default function DashboardPage() {
  // Role State: Switchable between Patient and Doctor
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');

  // Shared Clinical Data
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'appt-1',
      dateTime: '2026-10-29T10:00:00Z',
      status: 'CONFIRMED',
      type: 'In-Person Clinic Visit',
      patientName: 'Amol Paul',
      reason: 'Routine hypertension follow-up & cardiac review',
      doctorName: 'Dr. Sarah Connor'
    },
    {
      id: 'appt-2',
      dateTime: '2026-10-29T14:30:00Z',
      status: 'PENDING_APPROVAL',
      type: 'Telehealth Video',
      patientName: 'Elena Rostova',
      reason: 'Post-op respiratory wheezing & pulse evaluation',
      doctorName: 'Dr. Sarah Connor'
    },
    {
      id: 'appt-3',
      dateTime: '2026-10-30T11:00:00Z',
      status: 'CONFIRMED',
      type: 'In-Person Clinic Visit',
      patientName: 'Marcus Vance',
      reason: 'Type 2 Diabetes glycemic protocol adjustments',
      doctorName: 'Dr. Sarah Connor'
    }
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: 'rec-1',
      title: 'Annual Cardiovascular Health Audit',
      type: 'DIAGNOSTIC',
      recordDate: 'Oct 24, 2026',
      description: 'Resting ECG shows regular sinus rhythm (72 BPM). Normal S1/S2 heart sounds with no murmurs.'
    },
    {
      id: 'rec-2',
      title: 'Comprehensive Metabolic Panel (CMP)',
      type: 'LAB_REPORT',
      recordDate: 'Oct 15, 2026',
      description: 'Fasting glucose 92 mg/dL, HbA1c 5.4%, electrolytes within optimal reference limits.'
    }
  ]);

  const [allergies, setAllergies] = useState<string[]>([
    'Penicillin (Anaphylaxis risk)',
    'Peanuts (Mild urticaria)',
    'Latex (Contact dermatitis)'
  ]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'rx-1',
      patientName: 'Amol Paul',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily (morning)',
      date: 'Oct 20, 2026',
      status: 'ACTIVE'
    },
    {
      id: 'rx-2',
      patientName: 'Amol Paul',
      medication: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Once daily (bedtime)',
      date: 'Oct 12, 2026',
      status: 'ACTIVE'
    },
    {
      id: 'rx-3',
      patientName: 'Elena Rostova',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'TID with meals (7 days)',
      date: 'Oct 28, 2026',
      status: 'DISPENSED'
    }
  ]);

  // Doctor Bed Telemetry Switcher
  const [selectedPatientBed, setSelectedPatientBed] = useState<'amol' | 'elena' | 'marcus'>('amol');

  // Tabs for Patient & Doctor views
  const [patientTab, setPatientTab] = useState<'consultations' | 'records' | 'biometrics'>('consultations');
  const [doctorTab, setDoctorTab] = useState<'queue' | 'prescriptions' | 'records'>('queue');

  // Continuous EKG Waveform & Vitals State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bpm, setBpm] = useState<number>(72);
  const [beatFlash, setBeatFlash] = useState<boolean>(false);
  const [stressPreset, setStressPreset] = useState<'normal' | 'tachycardia' | 'bradycardia' | 'fever'>('normal');
  const [isStressOpen, setIsStressOpen] = useState<boolean>(false);

  const [vitals, setVitals] = useState({
    heartRate: 72,
    systolic: 120,
    diastolic: 80,
    spo2: 99,
    temperature: 98.4
  });

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState<boolean>(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState<boolean>(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  // Form Fields
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('2026-10-30');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [bookingType, setBookingType] = useState<'IN_PERSON' | 'TELEHEALTH'>('IN_PERSON');
  const [bookingReason, setBookingReason] = useState<string>('');

  // Prescription Form
  const [rxPatient, setRxPatient] = useState<string>('Amol Paul');
  const [rxMedication, setRxMedication] = useState<string>('');
  const [rxDosage, setRxDosage] = useState<string>('');
  const [rxFrequency, setRxFrequency] = useState<string>('Once daily');

  // Clinical Note Form
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [noteDesc, setNoteDesc] = useState<string>('');

  // AI & Chat State
  const [aiInput, setAiInput] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiMessages, setAiMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'MedCore AI Clinical Engine active. Enter patient symptoms for differential diagnostic triage.'
    }
  ]);

  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: 'Dr. Sarah Connor',
      text: 'Good morning Amol. Your continuous cardiac rhythm and blood pressure look stable today.',
      time: '09:15 AM'
    },
    {
      sender: 'Amol Paul',
      text: 'Thank you doctor! No palpitations reported since yesterday.',
      time: '09:18 AM'
    }
  ]);

  // Clean physician name helper
  const cleanDoctorName = (name?: string) => {
    if (!name) return 'Dr. Sarah Connor';
    return name.replace(/^Dr\.\s*Dr\.\s*/i, 'Dr. ');
  };

  // Sync API data safely
  const fetchDashboardData = async () => {
    try {
      const [apptsRes, docsRes, ehrRes] = await Promise.allSettled([
        fetch('http://localhost:4000/api/appointments'),
        fetch('http://localhost:4000/api/appointments/doctors'),
        fetch('http://localhost:4000/api/ehr/patient')
      ]);

      if (apptsRes.status === 'fulfilled' && apptsRes.value.ok) {
        const data = await apptsRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setAppointments(data);
        }
      }
      if (docsRes.status === 'fulfilled' && docsRes.value.ok) {
        const data = await docsRes.value.json();
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
          if (!selectedDoctorId) setSelectedDoctorId(data[0].id);
        }
      }
      if (ehrRes.status === 'fulfilled' && ehrRes.value.ok) {
        const data = await ehrRes.value.json();
        if (data.records && Array.isArray(data.records) && data.records.length > 0) {
          setRecords(data.records);
        }
        if (data.allergies && Array.isArray(data.allergies) && data.allergies.length > 0) {
          setAllergies(data.allergies);
        }
      }
    } catch {
      // Keep resilient state
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Continuous 60 FPS Cardiac EKG Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = 130);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = 130;
    };
    window.addEventListener('resize', handleResize);

    const bufferSize = Math.max(360, Math.floor(width));
    const data = new Array(bufferSize).fill(0);
    let lastBeatTime = 0;

    const render = (time: number) => {
      const beatsPerSec = Math.max(bpm, 40) / 60;
      const cycleDuration = 1000 / beatsPerSec;
      const phase = (time % cycleDuration) / cycleDuration;

      let wave = 0;
      if (phase >= 0.12 && phase < 0.22) {
        wave = Math.sin(((phase - 0.12) / 0.10) * Math.PI) * 0.18;
      } else if (phase >= 0.28 && phase < 0.31) {
        wave = -Math.sin(((phase - 0.28) / 0.03) * Math.PI) * 0.14;
      } else if (phase >= 0.31 && phase < 0.35) {
        wave = Math.sin(((phase - 0.31) / 0.04) * Math.PI) * 0.96;
        if (time - lastBeatTime > 350) {
          lastBeatTime = time;
          setBeatFlash(true);
          setTimeout(() => setBeatFlash(false), 140);
        }
      } else if (phase >= 0.35 && phase < 0.39) {
        wave = -Math.sin(((phase - 0.35) / 0.04) * Math.PI) * 0.24;
      } else if (phase >= 0.48 && phase < 0.64) {
        wave = Math.sin(((phase - 0.48) / 0.16) * Math.PI) * 0.28;
      }
      wave += (Math.random() - 0.5) * 0.018;

      data.shift();
      data.push(wave);

      // Deep monitor background
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.07)';
      const gridStep = 24;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridStep) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridStep) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Midline
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.16)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Glowing Waveform
      const midY = height / 2;
      const amplitude = height * 0.42;
      const xStep = width / (data.length - 1);

      ctx.shadowColor = '#00f2fe';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.4;
      ctx.strokeStyle = '#00f2fe';

      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = i * xStep;
        const y = midY - data[i] * amplitude;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Head beam
      const headX = width;
      const headY = midY - data[data.length - 1] * amplitude;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 18;
      ctx.fillStyle = '#34d399';
      ctx.beginPath();
      ctx.arc(headX - 3, headY, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      const beamGrad = ctx.createLinearGradient(width - 50, 0, width, 0);
      beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
      beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0.12)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(width - 50, 0, 50, height);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [bpm]);

  // Vitals Modulation (Every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setVitals((prev) => {
        const hrDelta = Math.floor(Math.random() * 3) - 1;
        let baseSys = 120;
        let baseDia = 80;

        if (stressPreset === 'tachycardia') {
          baseSys = 138;
          baseDia = 88;
        } else if (stressPreset === 'bradycardia') {
          baseSys = 108;
          baseDia = 68;
        } else if (stressPreset === 'fever') {
          baseSys = 126;
          baseDia = 82;
        }

        const newHr = Math.min(Math.max(prev.heartRate + hrDelta, bpm - 3), bpm + 3);
        const newSys = baseSys + (Math.floor(Math.random() * 3) - 1);
        const newDia = baseDia + (Math.floor(Math.random() * 3) - 1);
        const spo2Pool = [98, 99, 99, 100, 99];
        const newSpo2 = spo2Pool[Math.floor(Math.random() * spo2Pool.length)];
        const tempPool = stressPreset === 'fever' ? [101.2, 101.4, 101.6] : [98.3, 98.4, 98.5, 98.6];
        const newTemp = tempPool[Math.floor(Math.random() * tempPool.length)];

        return {
          heartRate: newHr,
          systolic: newSys,
          diastolic: newDia,
          spo2: newSpo2,
          temperature: newTemp
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [bpm, stressPreset]);

  // Patient switch for Doctor Monitor
  const handleSelectBedPatient = (patient: 'amol' | 'elena' | 'marcus') => {
    setSelectedPatientBed(patient);
    if (patient === 'amol') {
      setBpm(72);
      setVitals({ heartRate: 72, systolic: 120, diastolic: 80, spo2: 99, temperature: 98.4 });
    } else if (patient === 'elena') {
      setBpm(86);
      setVitals({ heartRate: 86, systolic: 128, diastolic: 84, spo2: 96, temperature: 99.2 });
    } else if (patient === 'marcus') {
      setBpm(64);
      setVitals({ heartRate: 64, systolic: 114, diastolic: 74, spo2: 99, temperature: 98.6 });
    }
  };

  // Doctor Action: Approve Appointment
  const handleApproveAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'APPROVED' } : a))
    );
  };

  // Doctor Action: Complete Appointment
  const handleCompleteAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'COMPLETED' } : a))
    );
  };

  // Doctor Action: Write & Dispatch e-Prescription
  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxMedication.trim() || !rxDosage.trim()) return;

    const newRx: Prescription = {
      id: `rx-${Date.now()}`,
      patientName: rxPatient,
      medication: rxMedication,
      dosage: rxDosage,
      frequency: rxFrequency,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'ACTIVE'
    };

    setPrescriptions((prev) => [newRx, ...prev]);
    setIsPrescriptionModalOpen(false);
    setRxMedication('');
    setRxDosage('');
  };

  // Doctor Action: Add Clinical Record
  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteDesc.trim()) return;

    const newRec: MedicalRecord = {
      id: `rec-${Date.now()}`,
      title: noteTitle,
      type: 'CLINICAL_NOTE',
      recordDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      description: noteDesc
    };

    setRecords((prev) => [newRec, ...prev]);
    setIsRecordModalOpen(false);
    setNoteTitle('');
    setNoteDesc('');
  };

  // Patient Action: Book Appointment
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctorId || 'doc-sarah-connor',
          dateTime: `${bookingDate}T${bookingTime.includes('PM') ? '14:00:00Z' : '10:00:00Z'}`,
          reason: bookingReason || 'General Follow-up Consultation'
        })
      });

      const newAppt: Appointment = {
        id: `appt-${Date.now()}`,
        dateTime: `${bookingDate}T10:00:00Z`,
        status: 'CONFIRMED',
        type: bookingType === 'IN_PERSON' ? 'In-Person Clinic Visit' : 'Telehealth Video',
        patientName: 'Amol Paul',
        reason: bookingReason || 'General Health Consultation',
        doctorName: 'Dr. Sarah Connor'
      };
      setAppointments((prev) => [newAppt, ...prev]);
      setIsBookingOpen(false);
      setBookingReason('');
    } catch {
      setIsBookingOpen(false);
    }
  };

  // Chat message send
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const senderName = role === 'patient' ? 'Amol Paul' : 'Dr. Sarah Connor';
    const text = chatInput;
    setChatInput('');

    setChatMessages((prev) => [
      ...prev,
      { sender: senderName, text, time: 'Just now' }
    ]);

    // Simulated auto response from the opposite party
    setTimeout(() => {
      if (role === 'patient') {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'Dr. Sarah Connor',
            text: 'Noted Amol. I have reviewed your live cardiac telemetry on Bed 04. Looks very stable.',
            time: 'Just now'
          }
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          {
            sender: 'Amol Paul',
            text: 'Thank you Dr. Connor! Following your prescription instructions carefully.',
            time: 'Just now'
          }
        ]);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-[#070b12]/95 backdrop-blur sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-[#070b12]" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                MedCore
              </span>
              <span className="text-[10px] text-cyan-400 block font-mono -mt-1 tracking-wider">
                V2.4 {role === 'doctor' ? 'PHYSICIAN CLINICAL SUITE' : 'PATIENT HEALTH OS'}
              </span>
            </div>
          </Link>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center text-xs shadow-inner">
            <button
              onClick={() => setRole('patient')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                role === 'patient'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Patient: Amol
            </button>
            <button
              onClick={() => setRole('doctor')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                role === 'doctor'
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Doctor: Dr. Sarah Connor
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh clinical database"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <Link
            href="/"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* ========================================================= */}
        {/* VIEW 1: DOCTOR / PHYSICIAN COMMAND CENTER PORTAL          */}
        {/* ========================================================= */}
        {role === 'doctor' ? (
          <>
            {/* Doctor Hero Command Banner */}
            <section className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#0c1829] via-[#091422] to-[#08101a] p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CHIEF MEDICAL OFFICER • CARDIOLOGY & INTERNAL MEDICINE</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    Physician Portal —{' '}
                    <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      Dr. Sarah Connor, MD
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                    Clinical Command Center: Monitor multi-lead ICU patient telemetry, review scheduled appointments, approve clinical workflows, and dispatch e-prescriptions.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <Pill className="w-4 h-4" />
                    Write e-Prescription (Rx)
                  </button>

                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-cyan-300 font-semibold text-xs flex items-center gap-2 transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    + Add Clinical Note
                  </button>

                  <button
                    onClick={() => setIsAiOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Bot className="w-4 h-4 text-purple-400" />
                    AI Diagnostic Copilot
                  </button>
                </div>
              </div>
            </section>

            {/* Doctor Clinical Operational Stats (4 Cards) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>ACTIVE PATIENTS MONITORED</span>
                  <Users className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">14</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">IN WARD</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  All Vitals Within Safe Range
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>TODAY&apos;S CONSULTATIONS</span>
                  <Calendar className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">{appointments.length}</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">SCHEDULED</span>
                </div>
                <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  1 Pending Doctor Approval
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>DISPATCHED PRESCRIPTIONS</span>
                  <Pill className="w-4 h-4 text-purple-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">{prescriptions.length}</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">SIGNED RX</span>
                </div>
                <div className="text-[11px] text-purple-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Pharmacy Registry Sync Active
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>CLINICAL EHR VAULT</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">100%</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">HIPAA SECURE</span>
                </div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  PostgreSQL Audited
                </div>
              </div>
            </section>

            {/* Doctor Central Multi-Bed Telemetry Station */}
            <section className="rounded-2xl border border-cyan-500/40 bg-[#060a12] p-5 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full transition-all duration-100 ${
                      beatFlash ? 'bg-emerald-400 shadow-[0_0_16px_#34d399] scale-125' : 'bg-emerald-600'
                    }`}
                  />
                  <span className="text-emerald-400 font-bold tracking-wider">
                    CENTRAL ICU TELEMETRY STATION
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400 font-bold">
                    PATIENT: {selectedPatientBed === 'amol' ? 'Amol Paul (Bed 04)' : selectedPatientBed === 'elena' ? 'Elena Rostova (Bed 02)' : 'Marcus Vance (Bed 08)'}
                  </span>
                </div>

                {/* Patient Bed Selector Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs">Switch Monitored Patient:</span>
                  <select
                    value={selectedPatientBed}
                    onChange={(e) => handleSelectBedPatient(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 text-cyan-300 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="amol">Amol Paul (Bed 04 — Sinus 72 BPM)</option>
                    <option value="elena">Elena Rostova (Bed 02 — Post-Op 86 BPM)</option>
                    <option value="marcus">Marcus Vance (Bed 08 — Resting 64 BPM)</option>
                  </select>
                </div>
              </div>

              {/* 60 FPS Oscilloscope Canvas */}
              <div className="relative w-full h-[130px] rounded-xl overflow-hidden border border-cyan-500/30 bg-[#060a12]">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>

              {/* Patient Live Vitals Sub-Row */}
              <div className="grid grid-cols-4 gap-3 mt-4 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">PULSE:</span>
                  <span className="text-white font-bold">{vitals.heartRate} BPM</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">PRESSURE:</span>
                  <span className="text-cyan-300 font-bold">{vitals.systolic}/{vitals.diastolic}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">OXYGEN:</span>
                  <span className="text-emerald-400 font-bold">{vitals.spo2}% SpO2</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">TEMP:</span>
                  <span className="text-amber-300 font-bold">{vitals.temperature}°F</span>
                </div>
              </div>
            </section>

            {/* Doctor Navigation Tabs: Queue, Prescriptions, Records */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setDoctorTab('queue')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  doctorTab === 'queue'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ClipboardCheck className="w-3.5 h-3.5 text-cyan-400" />
                Patient Consultations & Approvals ({appointments.length})
              </button>
              <button
                onClick={() => setDoctorTab('prescriptions')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  doctorTab === 'prescriptions'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Pill className="w-3.5 h-3.5 text-purple-400" />
                e-Prescription Registry ({prescriptions.length})
              </button>
              <button
                onClick={() => setDoctorTab('records')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  doctorTab === 'records'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                Clinical Chart Notes ({records.length})
              </button>
            </div>

            {/* Doctor Tab 1: Patient Consultation Queue & Approval Manager */}
            {doctorTab === 'queue' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-cyan-400" />
                    Incoming Patient Appointments & Clinical Queue
                  </h2>
                  <span className="text-xs text-slate-400">Dr. Sarah Connor&apos;s Active Schedule</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="rounded-xl border border-slate-800 bg-[#0a101d] p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-sm">
                                {appt.patientName || 'Amol Paul'}
                              </h3>
                              <p className="text-xs text-slate-400 font-mono">Patient ID: #MED-88204</p>
                            </div>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border ${
                              appt.status === 'APPROVED' || appt.status === 'CONFIRMED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : appt.status === 'COMPLETED'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {appt.status}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {new Date(appt.dateTime).toLocaleString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{appt.type || 'In-Person Consultation'}</span>
                          </div>
                          {appt.reason && (
                            <p className="text-slate-400 italic text-[11px] pt-1">
                              &ldquo;{appt.reason}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Doctor Actions */}
                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          {appt.status !== 'APPROVED' && appt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleApproveAppointment(appt.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-semibold flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve Visit
                            </button>
                          )}
                          <button
                            onClick={() => setIsVideoOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 font-semibold flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Launch Video
                          </button>
                        </div>

                        <button
                          onClick={() => handleCompleteAppointment(appt.id)}
                          className="text-slate-400 hover:text-white font-medium"
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Tab 2: e-Prescription Registry */}
            {doctorTab === 'prescriptions' && (
              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Pill className="w-5 h-5 text-purple-400" />
                      Dispatched Electronic Prescriptions (Rx)
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Digitally signed by Dr. Sarah Connor • Encrypted Pharmacy Dispatch
                    </p>
                  </div>
                  <button
                    onClick={() => setIsPrescriptionModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs hover:bg-purple-400 transition-colors"
                  >
                    + Write New Rx
                  </button>
                </div>

                <div className="divide-y divide-slate-800">
                  {prescriptions.map((rx) => (
                    <div key={rx.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{rx.medication}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono text-[10px]">
                            {rx.dosage}
                          </span>
                          <span className="text-slate-500 font-mono">• {rx.frequency}</span>
                        </div>
                        <p className="text-slate-400">
                          Prescribed to: <strong className="text-slate-200">{rx.patientName}</strong> on {rx.date}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {rx.status}
                        </span>
                        <button className="text-slate-400 hover:text-cyan-400">Refill Protocol</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Tab 3: Clinical Chart Notes */}
            {doctorTab === 'records' && (
              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-400" />
                    Doctor Clinical Notes & Diagnoses
                  </h2>
                  <button
                    onClick={() => setIsRecordModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold hover:bg-emerald-500/30 transition-all flex items-center gap-1"
                  >
                    + Write Chart Note
                  </button>
                </div>

                <div className="space-y-3">
                  {records.map((rec) => (
                    <div key={rec.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                        <span className="text-xs text-slate-500 font-mono">{rec.recordDate}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-2 leading-relaxed">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* ========================================================= */
          /* VIEW 2: PATIENT HEALTH PORTAL (AMOL PAUL)                 */
          /* ========================================================= */
          <>
            {/* Patient Hero Banner */}
            <section className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-r from-[#0c1322] via-[#09111e] to-[#0d1627] p-6 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3">
                    <Shield className="w-3.5 h-3.5" />
                    <span>HIPAA Compliant • Encrypted PostgreSQL Medical Vault</span>
                  </div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                    Welcome back,{' '}
                    <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      Amol!
                    </span>
                  </h1>
                  <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                    Your biometric telemetry, appointment schedule, and medical records are live and synchronized with the PostgreSQL clinical registry.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setIsStressOpen(!isStressOpen)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/60 text-cyan-300 text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
                    >
                      <Sliders className="w-4 h-4 text-cyan-400" />
                      Vitals Stress Simulator
                    </button>
                    {isStressOpen && (
                      <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0b1322] border border-cyan-500/40 p-2 shadow-2xl z-50 space-y-1">
                        <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 px-2 py-1">
                          Simulate Cardiac Rhythm
                        </div>
                        <button
                          onClick={() => {
                            setStressPreset('normal');
                            setBpm(72);
                            setIsStressOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                        >
                          <span>Normal Sinus (72 BPM)</span>
                          {bpm === 72 && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                        </button>
                        <button
                          onClick={() => {
                            setStressPreset('tachycardia');
                            setBpm(128);
                            setIsStressOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                        >
                          <span>Tachycardia (128 BPM)</span>
                          {bpm === 128 && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </button>
                        <button
                          onClick={() => {
                            setStressPreset('bradycardia');
                            setBpm(52);
                            setIsStressOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:bg-slate-800 flex items-center justify-between"
                        >
                          <span>Athlete Bradycardia (52 BPM)</span>
                          {bpm === 52 && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setIsAiOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-300 text-xs font-semibold flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Bot className="w-4 h-4 text-purple-400" />
                    AI Symptom Analyzer
                  </button>

                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Book Visit
                  </button>
                </div>
              </div>
            </section>

            {/* Continuous Cardiac EKG Monitor */}
            <section className="rounded-2xl border border-slate-800/90 bg-[#060a12] p-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3 h-3 rounded-full transition-all duration-100 ${
                      beatFlash ? 'bg-emerald-400 shadow-[0_0_16px_#34d399] scale-125' : 'bg-emerald-600'
                    }`}
                  />
                  <span className="text-emerald-400 font-bold tracking-wider">
                    CONTINUOUS CARDIAC EKG RHYTHM FEED
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-cyan-400/90 hidden sm:inline">LEAD II • 25 mm/s • 10 mm/mV</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 hidden md:inline">
                    R-R Interval: <strong className="text-slate-200">{Math.round(60000 / bpm)}ms</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 font-bold">
                    Pulse: {vitals.heartRate} BPM
                  </span>
                </div>
              </div>

              <div className="relative w-full h-[130px] rounded-xl overflow-hidden border border-cyan-500/20 bg-[#060a12]">
                <canvas ref={canvasRef} className="w-full h-full block" />
              </div>
            </section>

            {/* Patient Vitals Row */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>HEART RATE</span>
                  <Heart
                    className={`w-4 h-4 text-rose-500 transition-transform duration-100 ${
                      beatFlash ? 'scale-125 text-rose-400' : 'scale-100'
                    }`}
                  />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">{vitals.heartRate}</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">BPM</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Normal Sinus Rhythm</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>BLOOD PRESSURE</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">
                    {vitals.systolic}/{vitals.diastolic}
                  </span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">mmHg</span>
                </div>
                <div className="text-[11px] text-cyan-400 font-medium">Optimal Range</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>BLOOD OXYGEN (SPO2)</span>
                  <Droplets className="w-4 h-4 text-blue-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">{vitals.spo2}%</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">SAT</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Excellent Oxygenation</div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>TEMPERATURE</span>
                  <Thermometer className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-extrabold text-white">{vitals.temperature}°F</span>
                  <span className="text-xs text-slate-500 ml-1 font-mono">CORE</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">Afebrile (Normal)</div>
              </div>
            </section>

            {/* Patient Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setPatientTab('consultations')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  patientTab === 'consultations'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                My Consultations ({appointments.length})
              </button>
              <button
                onClick={() => setPatientTab('records')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  patientTab === 'records'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                My Medical Records ({records.length})
              </button>
              <button
                onClick={() => setPatientTab('biometrics')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  patientTab === 'biometrics'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Allergies & Demographics ({allergies.length})
              </button>
            </div>

            {/* Patient Tab 1: Scheduled Consultations */}
            {patientTab === 'consultations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="rounded-xl border border-slate-800 bg-[#0a101d] p-5 shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-bold">
                              <User className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-bold text-white text-sm">
                                {cleanDoctorName(appt.doctorName)}
                              </h3>
                              <p className="text-xs text-slate-400">Cardiology Specialist</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {appt.status}
                          </span>
                        </div>

                        <div className="mt-4 space-y-2 text-xs text-slate-300">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {new Date(appt.dateTime).toLocaleString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{appt.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <button
                          onClick={() => setIsVideoOpen(true)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 font-semibold flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Join Video Room
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Patient Tab 2: Records */}
            {patientTab === 'records' && (
              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-6 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Your Electronic Health Records
                </h3>
                {records.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex justify-between font-bold text-white text-xs">
                      <span>{r.title}</span>
                      <span className="text-slate-500 font-mono">{r.recordDate}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{r.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Patient Tab 3: Allergies */}
            {patientTab === 'biometrics' && (
              <div className="rounded-xl border border-slate-800 bg-[#0a101d] p-6 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  Known Allergies & Clinical Flags
                </h3>
                {allergies.map((a, i) => (
                  <div key={i} className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex justify-between">
                    <span>{a}</span>
                    <span className="font-mono text-[10px] text-rose-400">EHR SYNCHRONIZED</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Messenger (Adapts dynamically to Doctor vs Patient role!) */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          <span>
            {role === 'doctor' ? 'CHAT WITH PATIENT: AMOL PAUL' : 'DR. SARAH CONNOR (ONLINE)'}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-pulse" />
        </button>
      </div>

      {/* Live Messenger Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[460px] rounded-2xl bg-[#09101d] border border-cyan-500/40 shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-[#0d1627] to-[#070b12] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xs">
                {role === 'doctor' ? 'AP' : 'SC'}
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">
                  {role === 'doctor' ? 'Amol Paul (Patient)' : 'Dr. Sarah Connor'}
                </h4>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live HIPAA-Encrypted Direct Channel
                </p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {chatMessages.map((msg, i) => {
              const isMe = (role === 'doctor' && msg.sender === 'Dr. Sarah Connor') || (role === 'patient' && msg.sender === 'Amol Paul') || msg.sender === 'You';
              return (
                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      isMe
                        ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-medium'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <p className="text-[10px] font-bold opacity-75 mb-0.5">{msg.sender}</p>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSendChat} className="p-3 border-t border-slate-800 bg-[#070b12] flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={role === 'doctor' ? 'Message patient Amol...' : 'Message Dr. Connor...'}
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Doctor Modal: Write e-Prescription (Rx) */}
      {isPrescriptionModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#09101d] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                  PHYSICIAN DISPATCH
                </span>
                <h3 className="text-lg font-bold text-white">Write e-Prescription (Rx)</h3>
              </div>
              <button onClick={() => setIsPrescriptionModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Patient</label>
                <select
                  value={rxPatient}
                  onChange={(e) => setRxPatient(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Amol Paul">Amol Paul (#MED-88204)</option>
                  <option value="Elena Rostova">Elena Rostova (#MED-90112)</option>
                  <option value="Marcus Vance">Marcus Vance (#MED-77401)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Medication Name</label>
                <input
                  type="text"
                  value={rxMedication}
                  onChange={(e) => setRxMedication(e.target.value)}
                  placeholder="e.g. Lisinopril, Metformin, Amoxicillin"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Dosage</label>
                  <input
                    type="text"
                    value={rxDosage}
                    onChange={(e) => setRxDosage(e.target.value)}
                    placeholder="e.g. 10mg, 500mg"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Frequency</label>
                  <select
                    value={rxFrequency}
                    onChange={(e) => setRxFrequency(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Once daily (morning)">Once daily (morning)</option>
                    <option value="Twice daily (BID)">Twice daily (BID)</option>
                    <option value="Three times daily (TID)">Three times daily (TID)</option>
                    <option value="As needed (PRN)">As needed (PRN)</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrescriptionModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold hover:scale-105 transition-all"
                >
                  Sign & Dispatch Rx
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Modal: Add Clinical Chart Note */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#09101d] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add Clinical Chart Note</h3>
              <button onClick={() => setIsRecordModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Note / Diagnosis Title</label>
                <input
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Essential Hypertension Review"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Clinical Findings & Assessment</label>
                <textarea
                  rows={4}
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  placeholder="Record physical examination findings, treatment plans, and diagnostic notes..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors"
                >
                  Save to Patient Chart
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Modal: Book Visit */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#09101d] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Schedule Appointment</h3>
              <button onClick={() => setIsBookingOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Select Physician</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-white"
                >
                  <option value="doc-sarah-connor">Dr. Sarah Connor — Chief Cardiologist</option>
                  <option value="doc-alex-mercer">Dr. Alex Mercer — Neurologist</option>
                  <option value="doc-maya-patel">Dr. Maya Patel — Internal Medicine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Consultation Date</label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Time Slot</label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Visit Format</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingType('IN_PERSON')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      bookingType === 'IN_PERSON'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    In-Person Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('TELEHEALTH')}
                    className={`p-2.5 rounded-xl border text-center font-bold ${
                      bookingType === 'TELEHEALTH'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-200'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Telehealth Video
                  </button>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Reason for Visit</label>
                <textarea
                  rows={3}
                  value={bookingReason}
                  onChange={(e) => setBookingReason(e.target.value)}
                  placeholder="Describe your health concern..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Triage Modal */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#09101d] border border-purple-500/40 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#0c1424]">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-sm">MedCore AI Clinical Diagnostic Engine</h3>
              </div>
              <button onClick={() => setIsAiOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
              {aiMessages.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl max-w-[90%] ${
                    m.role === 'user'
                      ? 'ml-auto bg-purple-600/30 border border-purple-500/40 text-purple-100'
                      : 'bg-slate-800/80 border border-slate-700 text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!aiInput.trim()) return;
                const txt = aiInput;
                setAiInput('');
                setAiMessages((prev) => [...prev, { role: 'user', content: txt }]);
                setTimeout(() => {
                  setAiMessages((prev) => [
                    ...prev,
                    {
                      role: 'assistant',
                      content:
                        'Clinical Evaluation:\n1. Symptoms are consistent with mild sinus pressure or tension cefalea.\n2. Vitals review: 72 BPM, optimal blood pressure (120/80).\n3. Recommendation: Hydration, 10-minute rest intervals. Schedule follow-up if pain persists beyond 48 hours.'
                    }
                  ]);
                }, 800);
              }}
              className="p-3 border-t border-slate-800 bg-[#070b12] flex gap-2"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Enter symptoms or diagnostic query..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-500 text-white font-bold text-xs"
              >
                Assess
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Telehealth Video Overlay */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-[#09101d] border border-cyan-500/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <h3 className="font-bold text-white text-sm">
                  Encrypted Clinical Telehealth: {role === 'doctor' ? 'Consulting with Amol Paul' : 'Dr. Sarah Connor'}
                </h3>
              </div>
              <button onClick={() => setIsVideoOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-cyan-500/20 border border-cyan-400 mx-auto flex items-center justify-center text-cyan-300 font-bold text-xl">
                  {role === 'doctor' ? 'AP' : 'SC'}
                </div>
                <h4 className="font-bold text-white">
                  {role === 'doctor' ? 'Amol Paul (Patient)' : 'Dr. Sarah Connor, MD'}
                </h4>
                <p className="text-xs text-emerald-400">WebRTC Video & Audio Feed Synchronized (60 FPS)</p>
              </div>

              <div className="absolute bottom-4 right-4 w-36 h-24 rounded-lg bg-slate-900 border border-cyan-500/40 p-2 flex flex-col justify-between text-[10px] text-slate-300">
                <span className="font-semibold text-cyan-300">
                  {role === 'doctor' ? 'Dr. Sarah Connor (You)' : 'Amol Paul (You)'}
                </span>
                <span className="text-emerald-400">Camera Live</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => setIsVideoOpen(false)}
                className="px-6 py-2.5 rounded-full bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition-colors"
              >
                End Consultation Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
