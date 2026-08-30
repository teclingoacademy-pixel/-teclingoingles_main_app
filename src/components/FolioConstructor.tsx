/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  FileText, 
  Send, 
  Download, 
  User, 
  Calendar as CalendarIcon, 
  Tag, 
  Type,
  CheckCircle2,
  Lock,
  Stamp,
  Users as UsersIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';

interface FolioData {
  id: string;
  recipientIds: string[];
  recipient: string;
  date: string;
  title: string;
  subject: string;
  body: string;
}

export function FolioConstructor() {
  const { addFolio } = useAppContext();
  
  const [data, setData] = useState<FolioData>({
    id: `TEC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    recipientIds: ['USR-901-B33'],
    recipient: 'Dirección General',
    date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    title: 'CIRCULAR INSTITUCIONAL 042',
    subject: 'Protocolo de Evaluación Segundo Parcial',
    body: 'Por medio de la presente, se hace de su conocimiento el nuevo protocolo de evaluación para el segundo parcial del ciclo 2026-A. Es imperativo que todos los docentes del área de inglés sincronicen sus evidencias fotográficas antes del cierre de plataforma el próximo viernes.\n\nSin más por el momento, agradezco su compromiso con la visión Zero-Paper de nuestra institución.',
  });

  const [isProcessing, setIsProcessing] = useState<'NONE' | 'PDF' | 'SEND'>('NONE');

  const handleAction = (type: 'PDF' | 'SEND') => {
    setIsProcessing(type);
    
    if (type === 'SEND') {
      const newFolio = {
        id: data.id,
        title: data.title,
        subject: data.subject,
        content: data.body,
        date: data.date,
        senderName: 'Dirección General',
        assignedToIds: data.recipientIds,
        signatures: [],
        evidence: [],
        status: 'PENDING' as const
      };
      
      setTimeout(() => {
        addFolio(newFolio);
        setIsProcessing('NONE');
        // Reset form
        setData({
          id: `TEC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          recipientIds: ['USR-901-B33'],
          recipient: '',
          date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
          title: 'CIRCULAR INSTITUCIONAL 042',
          subject: '',
          body: '',
        });
      }, 1500);
    } else {
      setTimeout(() => setIsProcessing('NONE'), 1500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-12 gap-8 pb-24"
    >
      {/* Columna Izquierda: Panel de Control (40%) */}
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <header className="mb-6">
          <h2 className="text-[#DEFF9A] text-[10px] font-bold uppercase tracking-[0.4em] mb-2">Constructor de Documentos</h2>
          <h1 className="text-3xl font-bold tracking-tight text-white bevel-text uppercase underline decoration-[#DEFF9A]/20">Oficios Oficiales</h1>
        </header>

        <div className="space-y-4">
          <GlassCard title="Control de Datos Variables" icon={Type} accent="green">
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Folio Único</label>
                  <div className="relative">
                    <Lock size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                    <input 
                      disabled
                      value={data.id}
                      readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white/40 font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Fecha Emisión</label>
                  <div className="relative">
                    <CalendarIcon size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEFF9A]" />
                    <input 
                      type="text"
                      value={data.date}
                      onChange={(e) => setData({...data, date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Receptor</label>
                <div className="relative">
                  <User size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEFF9A]" />
                  <input 
                    type="text"
                    value={data.recipient}
                    onChange={(e) => setData({...data, recipient: e.target.value})}
                    placeholder="Nombre y Cargo del Receptor"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/40 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Asunto</label>
                <div className="relative">
                  <Tag size={12} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#DEFF9A]" />
                  <input 
                    type="text"
                    value={data.subject}
                    onChange={(e) => setData({...data, subject: e.target.value})}
                    placeholder="Resumen corto del documento"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#DEFF9A]/40 transition-colors font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-white/30 uppercase tracking-widest ml-1">Cuerpo del Oficio</label>
                <textarea 
                  value={data.body}
                  onChange={(e) => setData({...data, body: e.target.value})}
                  rows={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/80 focus:outline-none focus:border-[#DEFF9A]/40 transition-colors leading-relaxed resize-none"
                />
              </div>
            </div>
          </GlassCard>

          <div className="flex gap-4">
             <button 
              onClick={() => handleAction('PDF')}
              className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-2xl py-4 flex items-center justify-center gap-3 transition-all relative overflow-hidden group"
             >
                <Download size={18} className="text-white/40 group-hover:text-white transition-colors" />
                <span className="text-[10px] font-black uppercase tracking-widest">Generar PDF</span>
                {isProcessing === 'PDF' && (
                  <motion.div 
                    layoutId="processing" 
                    className="absolute inset-0 bg-[#DEFF9A] flex items-center justify-center text-[#061a1a]"
                  >
                    <CheckCircle2 size={20} className="animate-pulse" />
                  </motion.div>
                )}
             </button>
             <button 
              onClick={() => handleAction('SEND')}
              className="flex-1 bg-[#DEFF9A] text-[#061a1a] rounded-2xl py-4 flex items-center justify-center gap-3 hover:shadow-[0_0_30px_#DEFF9A50] transition-all relative overflow-hidden group"
             >
                <Send size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Enviar y Notificar</span>
                {isProcessing === 'SEND' && (
                  <motion.div 
                    layoutId="processing" 
                    className="absolute inset-0 bg-white flex items-center justify-center text-[#061a1a]"
                  >
                    <CheckCircle2 size={20} className="animate-bounce" />
                  </motion.div>
                )}
             </button>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Live Preview (60%) */}
      <div className="col-span-12 lg:col-span-7">
        <div className="sticky top-12">
          <div className="flex items-center justify-between mb-4 px-4">
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-[0.4em]">Vista Previa Real-Time (A4 Format)</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-[#DEFF9A]" />
              <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="aspect-[1/1.414] w-full bg-white neo-glass !bg-white/95 !border-none rounded-none shadow-2xl overflow-hidden p-12 text-black relative origin-top transform scale-[1.0] lg:scale-[1.0]">
            {/* SEP Headers Mockup */}
            <div className="flex justify-between items-start mb-12 border-b-2 border-black/5 pb-8">
              <div className="w-24 h-12 bg-black/5 rounded-sm flex items-center justify-center text-[10px] font-black text-black/20 italic">S. E. P.</div>
              <div className="text-center">
                 <h4 className="text-[9px] font-black tracking-tighter text-black/40 mb-1">GOBIERNO DEL ESTADO DE VERACRUZ</h4>
                 <h3 className="text-[11px] font-black tracking-tight leading-tight uppercase w-64 mx-auto">Centro de Bachillerato Tecnológico Industrial y de Servicios N° 102</h3>
              </div>
              <div className="w-24 h-12 bg-black/5 rounded-sm flex items-center justify-center text-[10px] font-black text-[#DEFF9A]/40 italic">TECNOLINGO</div>
            </div>

            {/* Document Content */}
            <div className="space-y-8 font-serif px-8">
              <div className="text-right space-y-1">
                <p className="text-[10px] font-bold">Oficio No. <span className="font-mono text-[#061a1a]/60">{data.id}</span></p>
                <p className="text-[10px] uppercase font-bold text-black/40">Pánuco, Ver., a {data.date}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-0.5">
                   <p className="text-[11px] font-black uppercase text-black">{data.recipient}</p>
                   <p className="text-[10px] font-bold italic text-black/60">P R E S E N T E  -</p>
                </div>
                <div className="flex gap-4">
                  <span className="text-[10px] font-black uppercase shrink-0">ASUNTO:</span>
                  <span className="text-[10px] font-bold underline underline-offset-4">{data.subject.toUpperCase()}</span>
                </div>
              </div>

              <div className="py-6">
                <p className="text-[11px] leading-[1.8] text-justify whitespace-pre-wrap font-medium text-black/80">
                  {data.body}
                </p>
              </div>

              <div className="pt-12 text-center space-y-12">
                <p className="text-[11px] font-bold tracking-widest italic opacity-60">"Excelencia en Lenguaje, Futuro sin Papel"</p>
                
                <div className="flex flex-col items-center">
                   <p className="text-[10px] font-black uppercase tracking-widest mb-16">A T E N T A M E N T E</p>
                   
                   {/* Signature Space */}
                   <div className="relative flex flex-col items-center justify-center w-64">
                      <div className="absolute -top-12 opacity-80 pointer-events-none">
                         <svg width="200" height="80" viewBox="0 0 200 80">
                            <path d="M 40 60 Q 60 20 100 50 T 170 30" fill="none" stroke="#0000ff" strokeWidth="1.5" strokeLinecap="round" />
                         </svg>
                      </div>
                      <div className="w-full border-t border-black mb-2" />
                      <p className="text-[10px] font-black uppercase">DIR. CARLOS RODRÍGUEZ</p>
                      <p className="text-[8px] font-bold text-black/40 uppercase tracking-widest">Director General Master</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Validation Footers */}
            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end grayscale opacity-20">
               <div className="flex flex-col gap-1 text-[7px] font-bold uppercase">
                  <span>C.c.p. Expediente</span>
                  <span>C.c.p. Archivo</span>
                  <span>C.c.p. Dirección General</span>
               </div>
               <div className="flex gap-8">
                  <Stamp size={48} strokeWidth={1} />
                  <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center border-dashed">
                     <span className="text-[8px] font-black rotate-[-15deg]">VALIDADO</span>
                  </div>
               </div>
            </div>

            {/* AI Watermark Seal */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg]">
              <span className="text-[120px] font-black tracking-[0.2em] font-mono select-none">TECNOLINGO</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
