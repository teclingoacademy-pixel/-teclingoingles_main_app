/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Camera,
  Activity,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5Qrcode } from 'html5-qrcode';
import { GlassCard } from './GlassCard';


const simStudents = [
  { id: '1', name: 'JUAN PÉREZ', code: 'ROD-PANC-26-01', photo: 'https://i.pravatar.cc/150?u=1', isError: false },
  { id: '2', name: 'MARIA GARCIA', code: 'ROD-PANC-26-02', photo: 'https://i.pravatar.cc/150?u=2', isError: false },
  { id: '3', name: 'LUIS MARTINEZ', code: 'ROD-PANC-26-03', photo: 'https://i.pravatar.cc/150?u=3', isError: false },
  { id: '4', name: 'ANA SÁNCHEZ', code: 'ROD-PANC-26-04', photo: 'https://i.pravatar.cc/150?u=4', isError: false },
  { id: '5', name: 'PEDRO RODRIGUEZ', code: 'ROD-PANC-26-05', photo: 'https://i.pravatar.cc/150?u=5', isError: false },
  { id: '6', name: 'SOFIA LÓPEZ', code: 'ROD-PANC-26-06', photo: 'https://i.pravatar.cc/150?u=6', isError: false },
  { id: '7', name: 'HÉCTOR VALENZUELA', code: 'ROD-PANC-26-07', photo: 'https://i.pravatar.cc/150?u=7', isError: false },
  { id: '8', name: 'ELENA DÍAZ', code: 'ROD-PANC-26-08', photo: 'https://i.pravatar.cc/150?u=8', isError: false },
  { id: '99', name: 'ALUMNO NO ENROLADO', code: 'ROD-PANC-26-99', photo: 'https://i.pravatar.cc/150?u=99', isError: true },
  { id: '100', name: 'CÓDIGO EXPIRADO o DAÑADO', code: 'ERR-EXPIRED-99', photo: 'https://i.pravatar.cc/150?u=100', isError: true },
];

interface LastRecord {
  name: string;
  photo: string;
  time: string;
  status: 'SUCCESS' | 'DUPLICATE' | 'ERROR';
}

interface QRScannerModuleProps {
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

export function QRScannerModule({ onScanSuccess, onClose }: QRScannerModuleProps) {
  const [scannerStatus, setScannerStatus] = useState<'IDLE' | 'SCANNING' | 'DETECTED' | 'ERROR'>('IDLE');
  const [scanStatus, setScanStatus] = useState<'scanning' | 'success' | 'error'>('scanning');
  const [lastRecord, setLastRecord] = useState<LastRecord | null>(null);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [scannedData, setScannedData] = useState<string | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannedDataRef = useRef<string | null>(null);
  const containerId = "qr-reader-container";

  // Audio Feedback
  const playBeep = (type: 'success' | 'warning' | 'error') => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'success') {
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.15);
      } else if (type === 'error') {
        // Deep error double-tone pattern
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(320, audioCtx.currentTime); // Low pitch
        oscillator.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.25);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
      } else {
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
        gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("Audio feedback not supported or blocked", e);
    }
  };

  const handleScanResult = (data: string) => {
    if (scannedDataRef.current === data || scanStatus !== 'scanning') return; // Prevent double trigger in short time

    scannedDataRef.current = data;
    setScannedData(data);

    // Extract student ID (assuming format e.g. STU-2026-003 or ROD-PANC-26-03 or custom codes)
    const normalizedId = data.split('-').pop()?.replace(/^0+/, '') || '1';
    let student = simStudents.find(s => s.id === normalizedId || s.code === data);
    
    if (!student) {
      student = {
        id: normalizedId,
        name: 'REGISTRO DESCONOCIDO',
        code: data,
        photo: `https://i.pravatar.cc/150?u=${normalizedId}`,
        isError: true
      };
    }

    const isError = student.isError || data.startsWith('ERR');

    if (isError) {
      setScannerStatus('ERROR');
      setScanStatus('error');
      playBeep('error');

      setLastRecord({
        name: student.name,
        photo: student.photo,
        time: new Date().toLocaleTimeString(),
        status: 'ERROR'
      });

      // Reset scanner back to scanning after exactly 2.5 seconds
      setTimeout(() => {
        setScannerStatus('SCANNING');
        setScanStatus('scanning');
        setScannedData(null);
        scannedDataRef.current = null;
      }, 2500);

    } else {
      setScannerStatus('DETECTED');
      setScanStatus('success');
      playBeep('success');

      setLastRecord({
        name: student.name,
        photo: student.photo,
        time: new Date().toLocaleTimeString(),
        status: 'SUCCESS'
      });
      onScanSuccess(data);
      
      // Reset scanner back to scanning after exactly 2.5 seconds
      setTimeout(() => {
        setScannerStatus('SCANNING');
        setScanStatus('scanning');
        setScannedData(null);
        scannedDataRef.current = null;
      }, 2500);
    }
  };

  const simulateScan = (studentId: string) => {
    const student = simStudents.find(s => s.id === studentId);
    const studentCode = student ? student.code : `ROD-PANC-26-0${studentId}`;
    handleScanResult(studentCode);
  };

  const toggleCamera = () => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = async () => {
    if (scannerRef.current) {
      try {
        const capabilities = scannerRef.current.getRunningTrackCapabilities();
        if (capabilities && (capabilities as any).torch) {
          await scannerRef.current.applyVideoConstraints({
            advanced: [{ torch: !isFlashOn }] as any
          } as MediaTrackConstraints);
          setIsFlashOn(!isFlashOn);
        }
      } catch (e) {
        console.warn("Flash control not supported", e);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    let localScanner: Html5Qrcode | null = null;
    
    const initAndStart = async () => {
      // 1. Stop any existing scanner
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            await scannerRef.current.stop();
          }
        } catch (e) {
          console.warn("Ignorable stop error during re-initialization:", e);
        }
        scannerRef.current = null;
      }

      if (!isMounted) return;

      // 2. Instantiate new scanner
      const html5QrCode = new Html5Qrcode(containerId);
      localScanner = html5QrCode;
      scannerRef.current = html5QrCode;
      setScannerStatus('SCANNING');

      try {
        await html5QrCode.start(
          { facingMode: cameraFacing },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (isMounted) {
              handleScanResult(decodedText);
            }
          },
          () => {
            // Failure callback - silent to avoid noise
          }
        );

        // If fast-unmounted while starting, abort scanning
        if (!isMounted) {
          try {
            if (html5QrCode.isScanning) {
              await html5QrCode.stop();
            }
          } catch (e) {
            console.warn("Ignored abort stop error:", e);
          }
        }
      } catch (err) {
        console.error("Scanner start error", err);
        if (isMounted) {
          setScannerStatus('ERROR');
        }
      }
    };

    initAndStart();

    return () => {
      isMounted = false;
      const currentScanner = localScanner || scannerRef.current;
      if (currentScanner) {
        try {
          if (currentScanner.isScanning) {
            currentScanner.stop().catch((err) => {
              console.warn("Ignoring stop error on cleanup:", err);
            });
          }
        } catch (e) {
          console.warn("Checking isScanning failed during cleanup:", e);
        }
        scannerRef.current = null;
      }
    };
  }, [cameraFacing]);

  // Dynamic visual feedback classes based on scanStatus as requested in prompt
  const focusBoxBorderClass = scanStatus === 'success' 
    ? 'border-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105' 
    : scanStatus === 'error' 
      ? 'border-[#F43F5E] shadow-[0_0_15px_rgba(244,63,94,0.5)] scale-105' 
      : 'border-gray-600 animate-pulse';

  const bracketBorderClass = scanStatus === 'success' 
    ? 'border-[#10B981]' 
    : scanStatus === 'error' 
      ? 'border-[#F43F5E]' 
      : 'border-gray-600';

  const overlayClass = scanStatus === 'success' 
    ? 'bg-[#10B981]/15' 
    : scanStatus === 'error' 
      ? 'bg-[#F43F5E]/15' 
      : 'bg-black/5';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-[#061a1a]/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, #DEFF9A 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      {/* Header Controls */}
      <div className="absolute top-12 left-12 right-12 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-[#DEFF9A] flex items-center justify-center text-[#061a1a] shadow-[0_0_20px_#DEFF9A]">
              <Camera size={24} />
           </div>
           <div>
              <h2 className="text-white text-xl font-black uppercase tracking-tighter">QR SCAN MODE</h2>
              <p className="text-[#DEFF9A] text-[10px] font-black uppercase tracking-[0.3em]">Sesión de Registro Activa</p>
           </div>
        </div>
        
        <button 
          onClick={onClose}
          className="w-14 h-14 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white/10 hover:text-white transition-all"
        >
           <X size={24} />
        </button>
      </div>

      {/* Main Scanner Container */}
      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 relative z-20">
         
         {/* LEFT HUD: STATUS & SIMULATION STATION */}
         <div className="hidden lg:flex flex-col gap-4 w-72 h-[480px]">
            <GlassCard title="SYSTEM STATUS" icon={Activity} accent="cyan" className="!p-4 shrink-0">
               <div className="grid grid-cols-2 gap-2">
                  <div>
                     <p className="text-white/20 text-[7px] font-black uppercase mb-0.5">Lente</p>
                     <p className={`text-[9px] font-black uppercase truncate ${scanStatus === 'scanning' ? 'text-[#DEFF9A]' : scanStatus === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {scanStatus === 'scanning' ? ' BUSCANDO QR...' : scanStatus === 'success' ? '¡REGISTRADO!' : '¡FALLO!'}
                     </p>
                  </div>
                  <div>
                     <p className="text-white/20 text-[7px] font-black uppercase mb-0.5">Calidad</p>
                     <p className="text-white text-[9px] font-black uppercase">100% ONLINE</p>
                  </div>
               </div>
            </GlassCard>

            <div className="flex-1 flex flex-col justify-between p-4 rounded-[1.8rem] bg-white/[0.03] border border-white/5 overflow-hidden">
               <div className="shrink-0 mb-2">
                  <h4 className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                     <UserCheck size={10} /> CREDENCIALES ALUMNOS
                  </h4>
                  <p className="text-white/30 text-[7px] font-bold uppercase mt-1">Pulsa un alumno para simular pase de lista QR</p>
               </div>
               
               <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {simStudents.map(student => (
                     <button
                        key={student.id}
                        onClick={() => simulateScan(student.id)}
                        disabled={scanStatus !== 'scanning'}
                        className="w-full p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#DEFF9A]/30 hover:bg-white/5 active:bg-white/10 text-left flex items-center gap-3 transition-all group disabled:opacity-50"
                     >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/10">
                           <img src={student.photo} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-white text-[9px] font-black uppercase truncate group-hover:text-[#DEFF9A] transition-colors">{student.name}</p>
                           <p className="text-[#DEFF9A]/65 text-[7px] font-mono tracking-widest uppercase truncate mt-0.5">{student.code}</p>
                        </div>
                     </button>
                  ))}
               </div>
            </div>
         </div>

         {/* SCANNER VIEWPORT */}
         <div className="relative">
            {/* The actual camera layer */}
            <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] md:w-[440px] md:h-[440px] rounded-[3.5rem] border-4 border-white/10 overflow-hidden bg-black shadow-[0_0_100px_rgba(0,0,0,0.5)]">
               <div id={containerId} className={`w-full h-full object-cover grayscale-[0.3] brightness-[0.8] ${cameraFacing === 'user' ? '[&_video]:scale-x-[-1] [&_video]:-scale-x-100' : ''}`} />
               
               {/* Vision Nocturna Effect */}
               <div className={`absolute inset-0 pointer-events-none transition-all duration-300 mix-blend-overlay ${overlayClass}`} />
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/40" />

               {/* Focus Target */}
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`relative w-[220px] h-[220px] md:w-64 md:h-64 border-2 border-dashed transition-all duration-500 ${focusBoxBorderClass}`}>
                     {/* Animated Corners */}
                     <span className={`absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 transition-colors duration-300 ${bracketBorderClass}`} />
                     <span className={`absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 transition-colors duration-300 ${bracketBorderClass}`} />
                     <span className={`absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 transition-colors duration-300 ${bracketBorderClass}`} />
                     <span className={`absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 transition-colors duration-300 ${bracketBorderClass}`} />

                     {/* Scanning Line */}
                     {scanStatus === 'scanning' && (
                        <motion.div 
                           animate={{ top: ['0%', '100%', '0%'] }}
                           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                           className="absolute inset-x-0 h-1 bg-[#DEFF9A] shadow-[0_0_20px_#DEFF9A] opacity-50 z-20"
                        />
                     )}
                  </div>
               </div>

               {/* Center Floating Text Feedback */}
               <AnimatePresence>
                  {scanStatus !== 'scanning' && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-none"
                     >
                        <div className={`px-5 py-4 rounded-[2rem] backdrop-blur-md flex flex-col items-center gap-2.5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] border font-mono ${
                           scanStatus === 'success' 
                              ? 'bg-[#10B981]/95 text-[#061a1a] border-emerald-400' 
                              : 'bg-[#F43F5E]/95 text-white border-rose-400'
                        }`}>
                           {scanStatus === 'success' ? (
                              <>
                                 <span className="text-3xl animate-bounce">✔️</span>
                                 <span className="text-[11px] font-black tracking-widest uppercase text-center leading-none">
                                    EXITO AL REGISTRAR
                                 </span>
                              </>
                           ) : (
                              <>
                                 <span className="text-3xl animate-bounce">❌</span>
                                 <span className="text-[11px] font-black tracking-widest uppercase text-center leading-normal">
                                    ERROR DE REGISTRO<br/>
                                    <span className="text-[8px] opacity-80 block mt-1">INTENTE DE NUEVO</span>
                                 </span>
                              </>
                           )}
                        </div>
                     </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Float Feedback Card */}
            <AnimatePresence>
               {scanStatus !== 'scanning' && lastRecord && (
                 <motion.div 
                   initial={{ opacity: 0, y: 20, scale: 0.8 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   exit={{ opacity: 0, y: -20, scale: 0.8 }}
                   className={`absolute -top-16 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl border flex items-center gap-3 backdrop-blur-2xl whitespace-nowrap z-50 ${
                     scanStatus === 'success'
                       ? 'bg-[#4ADE80] text-[#061a1a] border-[#4ADE80] shadow-[0_0_40px_rgba(74,222,128,0.4)]'
                       : 'bg-rose-500 text-white border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.4)]'
                   }`}
                 >
                    {scanStatus === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <span className="text-xs font-black uppercase tracking-tight">
                       {lastRecord.name}
                    </span>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Bottom Controls */}
            <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-6">
               <button 
                onClick={toggleFlash}
                className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-all ${
                  isFlashOn ? 'bg-[#DEFF9A] text-[#061a1a] border-[#DEFF9A] shadow-[0_0_20px_#DEFF9A]' : 'bg-white/5 text-white/30 border-white/10'
                }`}
               >
                  <Zap size={20} fill={isFlashOn ? "currentColor" : "none"} />
               </button>
               <button 
                onClick={toggleCamera}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white transition-all"
               >
                  <RefreshCw size={20} />
               </button>
            </div>
         </div>

         {/* RIGHT HUD: LAST LOG */}
         <div className="hidden lg:flex flex-col gap-6 w-64 h-[480px]">
            <GlassCard title="ÚLTIMO REGISTRO" icon={UserCheck} accent="green" className="!p-6 h-full flex flex-col justify-between">
               {lastRecord ? (
                 <motion.div 
                   key={lastRecord.time}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-4"
                 >
                    <div className="flex items-center gap-4">
                       <img src={lastRecord.photo} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt="" />
                       <div className="min-w-0">
                          <p className="text-white text-[10px] font-black uppercase truncate">{lastRecord.name}</p>
                          <p className="text-[#DEFF9A] text-[8px] font-bold mt-1 uppercase tracking-widest">{lastRecord.time}</p>
                       </div>
                    </div>
                    <div className={`p-3 rounded-xl border text-[8px] font-black uppercase tracking-widest text-center ${
                       lastRecord.status === 'SUCCESS' 
                         ? 'bg-[#4ADE80]/10 border-[#4ADE80]/20 text-[#4ADE80]' 
                         : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                     }`}>
                       {lastRecord.status === 'SUCCESS' ? 'VALIDADO EXITOSO' : 'REGISTRO FALLIDO'}
                    </div>
                 </motion.div>
               ) : (
                 <div className="flex flex-col items-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4 text-white/10">
                       <Activity size={20} />
                    </div>
                    <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                       Esperando primer reconocimiento...
                    </p>
                 </div>
               )}
            </GlassCard>
         </div>
      </div>

      {/* Mobile/Tablet simulation tray */}
      <div className="lg:hidden absolute bottom-24 left-6 right-6 z-30">
        <div className="p-4 rounded-[2rem] bg-black/60 border border-white/10 backdrop-blur-xl">
           <p className="text-white/30 text-[7px] uppercase tracking-widest font-black mb-2 text-center">Simulador de Credenciales Alumnos (Toca uno para simular QR)</p>
           <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar snap-x">
              {simStudents.map(student => (
                 <button
                    key={student.id}
                    onClick={() => simulateScan(student.id)}
                    disabled={scanStatus !== 'scanning'}
                    className="flex-shrink-0 snap-start flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 active:bg-white/10 text-left min-w-[140px] disabled:opacity-50"
                 >
                    <img src={student.photo} className="w-6 h-6 rounded-md object-cover border border-white/5" />
                    <div className="min-w-0">
                       <p className="text-white text-[8px] font-black uppercase truncate">{student.name}</p>
                       <p className="text-[#DEFF9A] text-[6px] font-mono truncate">{student.code}</p>
                    </div>
                 </button>
              ))}
           </div>
        </div>
      </div>
    </motion.div>
  );
}
