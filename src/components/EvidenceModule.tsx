/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  FileCheck, 
  History,
  Trash2,
  Maximize2,
  Paperclip,
  CheckCircle2,
  X,
  Clock,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './GlassCard';
import { useAppContext } from '../context/AppContext';
import { useAppContext as useAuthContext } from '../context/AppContext';

export function EvidenceModule() {
  const { folios, addFolioEvidence, userEmail } = useAppContext();
  const [isHovering, setIsHovering] = useState(false);
  const [selectedFolioId, setSelectedFolioId] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Image upload state
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter signed folios for the current teacher (demo USR-901-B33)
  const teacherId = 'USR-901-B33';
  const mySignedFolios = folios.filter(f => 
    f.assignedToIds.includes(teacherId) && 
    f.signatures.some(s => s.teacherId === teacherId)
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen (JPG, PNG)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo excede el tamaño máximo de 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
      setUploadStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = async () => {
    if (!previewUrl || !userEmail) return;

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      // Extract base64 from data URL
      const base64Data = previewUrl.split(',')[1];
      const fileName = `evidencia_docente_${new Date().toISOString().slice(0, 10)}_${Date.now()}.jpg`;
      
      const { uploadEvidence } = await import('../services/identityService');
      const result = await uploadEvidence(
        userEmail,
        base64Data,
        fileName,
        'image/jpeg',
        'docente_clase',
        '',
        new Date().toISOString().slice(0, 10)
      );

      if (result.ok) {
        setUploadStatus('success');
        setUploadMessage('Evidencia subida exitosamente a Google Drive');
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadStatus('error');
        setUploadMessage(result.error || 'Error al subir evidencia');
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage('Error de conexión con Google Drive');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = () => {
    if (!selectedFolioId) return;
    setIsUploading(true);
    
    setTimeout(() => {
      addFolioEvidence(selectedFolioId, {
        teacherId,
        teacherName: 'Ana López',
        fileName: `EVIDENCIA_${Math.floor(Math.random() * 1000)}.pdf`,
        fileUrl: '#',
        timestamp: new Date().toLocaleTimeString()
      });
      setIsUploading(false);
      setSelectedFolioId('');
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Evidencia SMART - Upload de Imágenes a Google Drive */}
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <GlassCard title="Evidencia SMART" icon={Camera} accent="cyan">
            <div className="space-y-6">
              <p className="text-white/60 text-[11px] font-medium leading-relaxed italic">
                "Sube la evidencia de hoy para validar tu sesión ante Dirección. El sistema TECLINGO PRO 1.1 analizará el contexto pedagógico."
              </p>

              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[8px] font-black uppercase tracking-widest">JPG, PNG</div>
                <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[8px] font-black uppercase tracking-widest">Max 10MB</div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/jpeg,image/png"
                onChange={handleFileSelect}
                className="hidden"
                id="docente-evidence-upload"
              />

              {/* Preview Area */}
              {previewUrl && (
                <div className="relative">
                  <img src={previewUrl} alt="Preview" className="w-full max-h-64 object-contain rounded-2xl border border-white/10" />
                  <button
                    onClick={() => {
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Select Image Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 rounded-2xl bg-[#22D3EE]/10 border-2 border-dashed border-[#22D3EE]/30 text-[#22D3EE] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#22D3EE]/20 hover:border-[#22D3EE]/50 transition-all"
              >
                <Camera size={18} />
                {previewUrl ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
              </button>

              {/* Upload Button */}
              <button
                onClick={handleImageUpload}
                disabled={!previewUrl || isUploading}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                  !previewUrl || isUploading
                    ? 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
                    : 'bg-[#22D3EE] text-[#061a1a] hover:shadow-[0_0_30px_#22D3EE50]'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Subiendo a Drive...
                  </>
                ) : (
                  <>
                    <Upload size={14} />
                    Subir Evidencia a Google Drive
                  </>
                )}
              </button>

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                    {uploadMessage}
                  </p>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 shrink-0">!</div>
                  <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">
                    {uploadMessage}
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Info Panel */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <GlassCard title="Instrucciones" icon={Clock} accent="green">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] text-[10px] font-black shrink-0">1</div>
                <p className="text-white/60 text-[10px] font-medium leading-relaxed">
                  Selecciona una foto clara de tu evidencia (clase, pizarra, alumnos, etc.)
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] text-[10px] font-black shrink-0">2</div>
                <p className="text-white/60 text-[10px] font-medium leading-relaxed">
                  Asegúrate de que la imagen sea legible y muestre la actividad realizada
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#DEFF9A]/20 flex items-center justify-center text-[#DEFF9A] text-[10px] font-black shrink-0">3</div>
                <p className="text-white/60 text-[10px] font-medium leading-relaxed">
                  Presiona "Subir Evidencia a Google Drive" y espera la confirmación
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Formatos Aceptados" icon={Zap} accent="orange">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center text-[#22D3EE]">
                  <Camera size={16} />
                </div>
                <div>
                  <p className="text-white text-[10px] font-bold">JPG / JPEG</p>
                  <p className="text-white/40 text-[8px]">Fotos de evidencia</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="w-8 h-8 rounded-lg bg-[#DEFF9A]/10 flex items-center justify-center text-[#DEFF9A]">
                  <ImageIcon size={16} />
                </div>
                <div>
                  <p className="text-white text-[10px] font-bold">PNG</p>
                  <p className="text-white/40 text-[8px]">Capturas de pantalla</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Sección original: Vincular evidencia a folio */}
      <div className="grid grid-cols-12 gap-8">
        {/* Dropzone de Cristal */}
        <div className="col-span-12 lg:col-span-7">
          <GlassCard title="Vincular Evidencia a Folio" icon={FileCheck} accent="green">
             <div className="space-y-6">
                <div className="flex flex-col gap-2">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">Vincular a Folio Firmado</label>
                   <select 
                    value={selectedFolioId}
                    onChange={(e) => setSelectedFolioId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-xs font-bold focus:border-[#22D3EE]/40 outline-none appearance-none"
                   >
                      <option value="" className="bg-[#061a1a]">-- Selecciona un folio validado --</option>
                      {mySignedFolios.map(f => (
                        <option key={f.id} value={f.id} className="bg-[#061a1a]">{f.id} - {f.title}</option>
                      ))}
                   </select>
                </div>

                <div 
                  onDragOver={() => setIsHovering(true)}
                  onDragLeave={() => setIsHovering(false)}
                  onClick={() => selectedFolioId && handleUpload()}
                  className={`aspect-video rounded-[3rem] border-2 border-dashed transition-all flex flex-col items-center justify-center p-12 group cursor-pointer ${
                    !selectedFolioId ? 'opacity-20 cursor-not-allowed border-white/5' :
                    isHovering ? 'bg-[#22D3EE]/5 border-[#22D3EE] scale-[1.02]' : 
                    'bg-white/[0.02] border-white/10 hover:border-white/20'
                  }`}
                >
                   <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#22D3EE] group-hover:bg-[#22D3EE]/10 transition-all mb-6">
                      {isUploading ? <div className="w-12 h-12 border-4 border-[#22D3EE] border-t-transparent rounded-full animate-spin" /> : <Upload size={40} />}
                   </div>
                   <h4 className="text-white text-xl font-black uppercase tracking-tight mb-2">
                      {isUploading ? 'Validando Archivos...' : 'Subir Evidencia PDF'}
                   </h4>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] text-center max-w-sm leading-loose">
                      {!selectedFolioId 
                        ? 'Primero selecciona un folio firmado para habilitar el repositorio.' 
                        : 'Arrastra tus evidencias PDF o toca para seleccionar archivos. El sistema TECLINGO PRO 1.1 vinculará la evidencia al folio seleccionado.'}
                   </p>
                </div>
             </div>
          </GlassCard>
        </div>

        {/* Metadata & Status Dashboard */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
           <GlassCard title="Estatus de Validación" icon={FileCheck} accent="green">
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Folios con Evidencia</p>
                       <p className="text-xs font-black text-white">{folios.filter(f => f.evidence.length > 0).length}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-white/20 text-[8px] font-black uppercase tracking-widest mb-1">Total Archivos</p>
                       <p className="text-xs font-black text-white">{folios.reduce((acc, f) => acc + f.evidence.length, 0)}</p>
                    </div>
                 </div>

                 <div className="p-6 rounded-3xl bg-[#DEFF9A]/5 border border-[#DEFF9A]/10">
                    <p className="text-xs font-black text-[#DEFF9A] uppercase tracking-widest mb-2 flex items-center gap-2">
                       <History size={14} /> Trazabilidad Institucional
                    </p>
                    <p className="text-white/40 text-[10px] font-medium leading-relaxed italic">
                       "Cada documento adjunto se vincula perpetuamente a la ID de tu folio firmado. Este proceso garantiza la transparencia académica ante auditorías."
                    </p>
                 </div>

                 <div className="bg-black/40 rounded-2xl border border-white/5 p-4 space-y-3">
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Recién Vinculados</p>
                    <div className="space-y-2">
                       {folios.flatMap(f => f.evidence).slice(0, 3).map((e, idx) => (
                         <div key={idx} className="flex items-center gap-3 text-[10px] text-white/60">
                            <Paperclip size={12} className="text-[#DEFF9A]" />
                            <span className="truncate">{e.fileName}</span>
                            <CheckCircle2 size={10} className="text-[#4ADE80] ml-auto" />
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
}
