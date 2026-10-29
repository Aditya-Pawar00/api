'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Activity, ArrowRight, ShieldCheck, HeartPulse, Stethoscope, 
  Sparkles, CheckCircle2, ChevronRight, Sliders, Video, MessageSquare, 
  Lock, Zap, Database, Terminal, FileText, Check, Play, User
} from 'lucide-react';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeFeatureStep, setActiveFeatureStep] = useState(0);

  // EKG Oscilloscope in Hero
  const heroCanvasRef = useRef<HTMLCanvasElement>(null);

  // Playground AI state
  const [testSymptom, setTestSymptom] = useState('Shortness of breath with chest tightness');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [playResult, setPlayResult] = useState<any>({
    triage: 'EMERGENCY',
    score: 92,
    specialist: 'Cardiologist / Emergency Medicine',
    condition: 'Acute Coronary Syndrome (ACS) suspected'
  });

  // Scroll Progress Listener
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);

      // Sticky feature section scroll calculator
      const step = Math.min(3, Math.max(0, Math.floor((currentScroll - 800) / 450)));
      if (currentScroll >= 700 && currentScroll <= 2800) {
        setActiveFeatureStep(step);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero EKG Waveform Animation
  useEffect(() => {
    const canvas = heroCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    ctx.fillStyle = '#060911';
    ctx.fillRect(0, 0, width, height);

    const render = () => {
      ctx.fillStyle = 'rgba(6, 9, 17, 0.06)';
      ctx.fillRect(0, 0, width, height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#14b8a6';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#2dd4bf';

      ctx.beginPath();
      ctx.moveTo(x, midY);

      const cycle = x % 130;
      let y = midY;

      if (cycle > 30 && cycle < 42) {
        y = midY - 6; // P Wave
      } else if (cycle >= 42 && cycle < 48) {
        y = midY + 5; // Q Wave
      } else if (cycle >= 48 && cycle < 58) {
        y = midY - 32; // R Spike
      } else if (cycle >= 58 && cycle < 66) {
        y = midY + 14; // S Wave
      } else if (cycle >= 75 && cycle < 90) {
        y = midY - 9; // T Wave
      }

      ctx.lineTo(x + 2, y);
      ctx.stroke();

      x += 2.2;
      if (x >= width) x = 0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleTestAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const lower = testSymptom.toLowerCase();
      if (lower.includes('chest') || lower.includes('breath') || lower.includes('heart')) {
        setPlayResult({
          triage: 'EMERGENCY',
          score: 92,
          specialist: 'Cardiologist / Emergency Medicine',
          condition: 'Acute Coronary Syndrome (ACS) suspected'
        });
      } else if (lower.includes('cough') || lower.includes('fever')) {
        setPlayResult({
          triage: 'ELEVATED',
          score: 55,
          specialist: 'Pulmonologist',
          condition: 'Acute Viral Bronchitis'
        });
      } else {
        setPlayResult({
          triage: 'ROUTINE',
          score: 28,
          specialist: 'General Practitioner',
          condition: 'Mild Non-Urgent Somatic Symptoms'
        });
      }
      setIsAnalyzing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 font-sans relative overflow-x-hidden selection:bg-teal-500 selection:text-black">
      {/* 1. SCROLL PROGRESS BAR AT TOP */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 z-50 transition-all duration-75 shadow-lg shadow-teal-500/50"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Dynamic Background Mesh Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[650px] h-[650px] rounded-full bg-teal-500/10 blur-[130px]" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[700px] h-[700px] rounded-full bg-cyan-500/10 blur-[150px]" />
      </div>

      {/* Floating Navbar */}
      <header className="sticky top-4 z-40 max-w-6xl mx-auto px-6">
        <div className="p-3.5 px-6 rounded-3xl bg-slate-950/70 backdrop-blur-2xl border border-slate-800/80 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/25">
              <Activity className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-lg font-black tracking-tight bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
              MedCore
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-400">
            <a href="#showcase" className="hover:text-teal-300 transition">Clinical Platform</a>
            <a href="#playground" className="hover:text-teal-300 transition">Interactive Sandbox</a>
            <a href="#architecture" className="hover:text-teal-300 transition">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold text-xs hover:brightness-110 transition shadow-md shadow-teal-500/20 flex items-center gap-1.5"
            >
              Access Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-20 px-6 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono shadow-inner animate-pulse">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>ENTERPRISE CLINICAL HEALTH OPERATING SYSTEM</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          The Future of Patient & <br />
          <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Clinical Health Intelligence.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Unifying continuous biometrics telemetry, longitudinal EHR, encrypted telehealth consultations, and AI-powered diagnostic triage in one globally scalable platform.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 text-slate-950 font-black text-sm hover:brightness-110 transition shadow-xl shadow-teal-500/25 flex items-center gap-2 hover:scale-105 active:scale-95"
          >
            Launch Live Clinical Dashboard <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
          <a
            href="#showcase"
            className="px-8 py-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 font-bold text-sm transition flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-teal-400" /> Scroll to Explore Experience
          </a>
        </div>

        {/* HERO EKG OSCILLOSCOPE MOCKUP CARD */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="p-4 sm:p-6 rounded-3xl border border-teal-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping"></span>
                <span className="font-mono text-slate-300 uppercase font-bold">Continuous Lead II Oscilloscope</span>
              </div>
              <div className="text-teal-400 font-mono font-bold">72 BPM • Normal Sinus Rhythm</div>
            </div>
            <div className="rounded-2xl border border-slate-900 bg-[#060911] p-2 overflow-hidden shadow-inner">
              <canvas ref={heroCanvasRef} width={800} height={120} className="w-full h-24" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Heart Rate</div>
                <div className="text-lg font-black text-white">72 <span className="text-xs font-normal text-slate-400">BPM</span></div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Blood Pressure</div>
                <div className="text-lg font-black text-teal-300">120/80 <span className="text-xs font-normal text-slate-400">mmHg</span></div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Blood Oxygen</div>
                <div className="text-lg font-black text-cyan-300">99% <span className="text-xs font-normal text-slate-400">SpO2</span></div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Body Temp</div>
                <div className="text-lg font-black text-amber-300">98.6°F</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTHCARE TRUST MARQUEE */}
      <section className="py-8 border-y border-slate-800/60 bg-slate-950/40 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-4">
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500">
            Engineered to Interoperate with World-Class Healthcare Frameworks
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-slate-400 font-bold text-sm tracking-wide">
            <span>MAYO CLINIC ALLIANCE</span>
            <span>JOHNS HOPKINS HEALTH</span>
            <span>CLEVELAND CLINIC NETWORK</span>
            <span>STANFORD MEDICINE</span>
            <span>MASS GENERAL BRIGHAM</span>
          </div>
        </div>
      </section>

      {/* 2. STICKY SCROLL INTERACTIVE SHOWCASE SECTION */}
      <section id="showcase" className="py-24 px-6 max-w-6xl mx-auto relative">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-mono">
            <Zap className="w-3.5 h-3.5" /> DYNAMIC SCROLL ARCHITECTURE
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Designed for Mission-Critical Care.
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Scroll down to explore how MedCore integrates continuous vitals, telemedicine, EHR records, and AI diagnostics.
          </p>
        </div>

        {/* 2-Column Sticky Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: 4 Milestone Steps */}
          <div className="lg:col-span-5 space-y-8">
            <div 
              onClick={() => setActiveFeatureStep(0)}
              className={`p-6 rounded-3xl border transition cursor-pointer ${
                activeFeatureStep === 0 
                  ? 'border-teal-500/50 bg-teal-500/10 shadow-xl shadow-teal-500/10' 
                  : 'border-slate-800/60 bg-slate-950/40 opacity-50 hover:opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-bold text-teal-400">01 / TELEMETRY</span>
              <h3 className="text-xl font-bold text-white mt-1">Continuous EKG & Biometrics</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hospital-grade real-time cardiac waveforms rendered at 60 FPS directly in the browser with automated hypertensive crisis detection.
              </p>
            </div>

            <div 
              onClick={() => setActiveFeatureStep(1)}
              className={`p-6 rounded-3xl border transition cursor-pointer ${
                activeFeatureStep === 1 
                  ? 'border-cyan-500/50 bg-cyan-500/10 shadow-xl shadow-cyan-500/10' 
                  : 'border-slate-800/60 bg-slate-950/40 opacity-50 hover:opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-bold text-cyan-400">02 / TELEHEALTH</span>
              <h3 className="text-xl font-bold text-white mt-1">Encrypted Doctor Consultation</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Connect directly with licensed attending physicians like Dr. Sarah Connor via encrypted chat and HD telehealth video sessions.
              </p>
            </div>

            <div 
              onClick={() => setActiveFeatureStep(2)}
              className={`p-6 rounded-3xl border transition cursor-pointer ${
                activeFeatureStep === 2 
                  ? 'border-emerald-500/50 bg-emerald-500/10 shadow-xl shadow-emerald-500/10' 
                  : 'border-slate-800/60 bg-slate-950/40 opacity-50 hover:opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-bold text-emerald-400">03 / EHR RECORDS</span>
              <h3 className="text-xl font-bold text-white mt-1">Longitudinal Medical Vault</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Tamper-evident clinical encounter logs, verified diagnoses, allergic sensitivity broadcasts, and treatment protocols in PostgreSQL.
              </p>
            </div>

            <div 
              onClick={() => setActiveFeatureStep(3)}
              className={`p-6 rounded-3xl border transition cursor-pointer ${
                activeFeatureStep === 3 
                  ? 'border-purple-500/50 bg-purple-500/10 shadow-xl shadow-purple-500/10' 
                  : 'border-slate-800/60 bg-slate-950/40 opacity-50 hover:opacity-80'
              }`}
            >
              <span className="text-xs font-mono font-bold text-purple-400">04 / AI DIAGNOSTICS</span>
              <h3 className="text-xl font-bold text-white mt-1">AI Clinical Symptom Triage</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Natural language symptom intake with structured clinical risk scoring, differential diagnosis estimation, and specialist routing.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Sticky Screen Mockup */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-800 bg-slate-950/90 backdrop-blur-2xl shadow-2xl min-h-[460px] flex flex-col justify-between">
              {activeFeatureStep === 0 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-teal-400 font-bold">LIVE TELEMETRY STREAM</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">SYNCED</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#060911] border border-slate-800">
                    <div className="text-xs text-slate-400 mb-2 font-mono">Patient Rhythm: Lead II</div>
                    <div className="h-20 bg-teal-500/5 rounded-xl border border-teal-500/20 flex items-center justify-center text-teal-400 font-mono text-xs">
                      ⚡ Oscilloscope Waveform Active (60 FPS)
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="text-xs text-slate-500">Blood Pressure</div>
                      <div className="text-xl font-black text-white mt-1">118/78 mmHg</div>
                      <span className="text-[10px] text-teal-400">Optimal Range</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                      <div className="text-xs text-slate-500">Heart Rate</div>
                      <div className="text-xl font-black text-white mt-1">70 BPM</div>
                      <span className="text-[10px] text-emerald-400">Sinus Rhythm</span>
                    </div>
                  </div>
                </div>
              )}

              {activeFeatureStep === 1 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-xs">SC</div>
                      <div>
                        <div className="text-xs font-bold text-white">Dr. Sarah Connor, MD</div>
                        <div className="text-[10px] text-cyan-400 font-mono">Cardiology Specialist • Online</div>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200">
                      Hello Amol! I am reviewing your recent blood pressure trends (118/78 mmHg). Your cardiovascular response looks stable.
                    </div>
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 font-bold ml-auto max-w-[80%]">
                      Thank you Doctor! Should I continue taking my readings in the morning?
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">HD Video Consultation Ready</span>
                    <span className="text-cyan-400 font-bold font-mono">1080p WebRTC Encrypted</span>
                  </div>
                </div>
              )}

              {activeFeatureStep === 2 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-emerald-400 font-bold">ELECTRONIC HEALTH RECORD</span>
                    <span className="text-xs text-slate-500 font-mono">ENC-89421</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
                    <div className="font-bold text-white flex items-center gap-2">
                      <span>Essential Hypertension (Stage 1) - Managed</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">Verified</span>
                    </div>
                    <p className="text-slate-300">Stable cardiovascular indices under regular dietary sodium control. Advised moderate cardio exercises and hydration.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Allergy Alert: Penicillin (Alternative Non-Beta-Lactam Enforced)</span>
                  </div>
                </div>
              )}

              {activeFeatureStep === 3 && (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-mono text-purple-400 font-bold">AI CLINICAL TRIAGE REPORT</span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">CONFIDENCE: 96.4%</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-rose-400 uppercase font-mono">Triage: Elevated / Urgency</span>
                      <span className="text-white font-bold">Risk: 88/100</span>
                    </div>
                    <div className="text-slate-200">
                      <strong>Differential Condition:</strong> Acute Coronary Syndrome (ACS) or Angina Pectoris.
                    </div>
                    <div className="text-slate-400">
                      <strong>Routing:</strong> Direct consult with Cardiologist / Emergency Medicine.
                    </div>
                  </div>
                  <div className="p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold text-center">
                    Auto-booked with Dr. Sarah Connor (Cardiology)
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Phase {activeFeatureStep + 1} of 4</span>
                <Link href="/dashboard" className="text-teal-400 font-bold hover:underline flex items-center gap-1">
                  Launch in Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE LIVE PLAYGROUND SECTION */}
      <section id="playground" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl border border-purple-500/30 bg-gradient-to-b from-purple-950/20 via-slate-950 to-slate-950 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-purple-400 uppercase font-bold tracking-wider">Interactive Live Sandbox</span>
            <h2 className="text-3xl font-black text-white">Test the AI Clinical Triage Engine</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Type any symptoms below to see real-time clinical assessment, risk calculation, and specialist recommendation.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={testSymptom} 
                onChange={(e) => setTestSymptom(e.target.value)}
                placeholder="Describe symptoms..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <button 
                onClick={handleTestAnalyze}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-xs hover:brightness-110 transition flex items-center gap-2"
              >
                {isAnalyzing ? <Activity className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Analyze</>}
              </button>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px]">
              <button onClick={() => setTestSymptom('Shortness of breath with chest tightness')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">Sample: Chest Pain</button>
              <button onClick={() => setTestSymptom('Dry persistent cough, sore throat, and mild fever')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">Sample: Cough & Fever</button>
              <button onClick={() => setTestSymptom('Routine wellness checkup and mild back ache')} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white">Sample: Routine Checkup</button>
            </div>
          </div>

          {playResult && (
            <div className="p-6 rounded-2xl border border-purple-500/20 bg-purple-950/10 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono">TRIAGE LEVEL</span>
                <strong className={`text-sm ${playResult.triage === 'EMERGENCY' ? 'text-rose-400' : playResult.triage === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {playResult.triage}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono">RECOMMENDED SPECIALIST</span>
                <strong className="text-sm text-white">{playResult.specialist}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px] font-mono">ESTIMATED RISK</span>
                <strong className="text-sm text-purple-300">{playResult.score}/100</strong>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. SYSTEM ARCHITECTURE & TECH MATRIX */}
      <section id="architecture" className="py-20 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono text-teal-400 uppercase font-bold tracking-wider">Enterprise Foundations</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Full-Stack Cloud Architecture</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Engineered with strict zero-trust boundaries, cryptographic access controls, and sub-millisecond data replication.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-3 hover:border-teal-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center"><Zap className="w-5 h-5" /></div>
            <h3 className="text-base font-bold text-white">Next.js 16 Client Portal</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Turbopack compiled server/client architecture with instant page prefetching and zero-layout-shift UI rendering.</p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-3 hover:border-teal-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center"><Terminal className="w-5 h-5" /></div>
            <h3 className="text-base font-bold text-white">NestJS Enterprise API</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Robust modular microservice design, Passport.js token security, Role-Based Access Control, and Swagger/OpenAPI documentation.</p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-800 bg-slate-950/60 space-y-3 hover:border-teal-500/40 transition">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center"><Database className="w-5 h-5" /></div>
            <h3 className="text-base font-bold text-white">PostgreSQL 16 & Redis 7</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Prisma ORM database schema with 12 health domain models, connection pooling, and low-latency cache synchronization.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA FOOTER */}
      <footer className="py-20 px-6 border-t border-slate-800/80 bg-slate-950 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-black text-white">
          Experience MedCore Right Now.
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Explore the live clinical workspace, schedule appointments, review longitudinal EHR records, and chat with your doctor.
        </p>
        <div>
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-400 text-slate-950 font-black text-sm hover:brightness-110 transition shadow-2xl shadow-teal-500/30 hover:scale-105 active:scale-95"
          >
            Open Live Clinical Dashboard →
          </Link>
        </div>
        <div className="pt-8 text-[11px] text-slate-600 font-mono">
          MedCore Health Operating System • HIPAA & HL7 Architectural Standards • Open Source Monorepo
        </div>
      </footer>
    </div>
  );
}