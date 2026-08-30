import { useState, useMemo } from "react";
import { apiUrl } from '../../services/apiConfig';
import {
  Edit3,
  ChevronLeft,
  Trash2,
  Copy,
  Sparkles,
  CheckCircle2,
  Info,
  Type,
  FileText,
  MousePointer2,
  Menu,
  Zap,
  RefreshCw,
  Trophy,
  Languages,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const CHALLENGES = [
  {
    level: "A1",
    spanish: "Hola, mi nombre es Juan.",
    english: "Hello, my name is John.",
    hint: "Usa: my name is...",
  },
  {
    level: "A1",
    spanish: "¿Cómo te llamas?",
    english: "What is your name?",
    hint: "Usa 'What is'...",
  },
  {
    level: "A2",
    spanish: "Me gustaría ir al cine esta noche.",
    english: "I would like to go to the cinema tonight.",
    hint: "I would like to...",
  },
  {
    level: "A2",
    spanish: "Tengo veinticinco años.",
    english: "I am twenty-five years old.",
    hint: "Usa el verbo 'to be'...",
  },
  {
    level: "B1",
    spanish: "Aunque estaba lloviendo, decidimos salir.",
    english: "Even though it was raining, we decided to go out.",
    hint: "Usa 'Even though'...",
  },
  {
    level: "B1",
    spanish: "He estado viviendo aquí por tres años.",
    english: "I have been living here for three years.",
    hint: "Usa Presente Perfecto Continuo.",
  },
  {
    level: "B2",
    spanish: "Si tuviera más dinero, viajaría por el mundo.",
    english: "If I had more money, I would travel the world.",
    hint: "Condicional tipo 2.",
  },
  {
    level: "B2",
    spanish: "Es fundamental que entendamos las consecuencias.",
    english: "It is fundamental that we understand the consequences.",
    hint: "Usa 'fundamental that'...",
  },
  {
    level: "C1",
    spanish: "A pesar de los obstáculos, él nunca se rindió.",
    english: "Despite the obstacles, he never gave up.",
    hint: "Usa 'Despite' y el phrasal verb 'give up'.",
  },
  {
    level: "C1",
    spanish: "Apenas había llegado cuando sonó el teléfono.",
    english: "Hardly had I arrived when the phone rang.",
    hint: "Usa inversión con 'Hardly'.",
  },
  {
    level: "C2",
    spanish:
      "La efímera naturaleza de la fama a menudo desemboca en desencanto.",
    english: "The ephemeral nature of fame often leads to disillusionment.",
    hint: "Usa 'ephemeral' y 'leads to'.",
  },
  {
    level: "C2",
    spanish: "Bajo ninguna circunstancia debes abrir esa puerta.",
    english: "Under no circumstances should you open that door.",
    hint: "Usa inversión con 'Under no circumstances'.",
  },
];

export function GrammarFixer({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"rewrite" | "challenge">("rewrite");
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    cefr?: string;
    suggestion: string;
  } | null>(null);
  const [isExpertMode, setIsExpertMode] = useState(false);

  // Challenge State
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [userTranslation, setUserTranslation] = useState("");
  const [challengeFeedback, setChallengeFeedback] = useState<{
    score: number;
    details: string;
  } | null>(null);

  const filteredChallenges = useMemo(
    () =>
      selectedLevel ? CHALLENGES.filter((c) => c.level === selectedLevel) : [],
    [selectedLevel],
  );

  const currentChallenge = filteredChallenges[currentChallengeIdx];

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const response = await fetch(apiUrl("/api/grammar/analyze"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, expertMode: isExpertMode }),
      });
      const data = await response.json();
      if (data.error) {
        setAnalysisResult({ score: 0, suggestion: "Error: " + data.error });
      } else {
        setAnalysisResult(data);
      }
      setShowAnalysis(true);
    } catch (error) {
      console.error(error);
      setAnalysisResult({
        score: 0,
        suggestion: "Error de conexión con el servidor.",
      });
      setShowAnalysis(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const verifyTranslation = async () => {
    if (!userTranslation.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch(apiUrl("/api/grammar/verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spanish: currentChallenge.spanish,
          studentEnglish: userTranslation,
          targetEnglish: currentChallenge.english,
        }),
      });

      const data = await response.json();

      if (data.error) {
        setChallengeFeedback({
          score: 0,
          details: "No se pudo conectar con el motor de IA: " + data.error,
        });
      } else {
        setChallengeFeedback(data);
      }
    } catch (error: any) {
      console.error(error);
      setChallengeFeedback({
        score: 0,
        details: "Error de red al validar la traducción.",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextChallenge = () => {
    setUserTranslation("");
    setChallengeFeedback(null);
    setCurrentChallengeIdx((prev) => (prev + 1) % filteredChallenges.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[120] bg-[#061a1a] flex flex-col"
    >
      {/* Header */}
      <header className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-white/40 hover:text-blue-400 transition-colors"
          >
            <ChevronLeft size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Regresar
            </span>
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-400/10 border border-blue-400/20 flex items-center justify-center text-blue-400">
              {mode === "rewrite" ? (
                <Edit3 size={20} />
              ) : (
                <Languages size={20} />
              )}
            </div>
            <div>
              <h1 className="text-white text-base font-black uppercase tracking-tight">
                {mode === "rewrite"
                  ? "AI Grammar Fixer"
                  : "AI Translation Challenge"}
              </h1>
              <p className="text-blue-400 text-[8px] font-black uppercase tracking-[0.2em]">
                Grammar & Logic Engine
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Mode Switcher */}
          <div className="flex items-center bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setMode("rewrite")}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                mode === "rewrite"
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Análisis
            </button>
            <button
              onClick={() => setMode("challenge")}
              className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                mode === "challenge"
                  ? "text-blue-400 bg-blue-400/10"
                  : "text-white/40 hover:text-white"
              }`}
            >
              Retos
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {mode === "rewrite" ? (
          <>
            {/* Rewrite Editor */}
            <div className="flex-1 p-12 bg-white/[0.01] overflow-y-auto">
              <div className="max-w-4xl mx-auto h-full flex flex-col space-y-6">
                <div className="flex items-center justify-between text-white/20 text-[9px] font-black uppercase tracking-widest">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-2">
                      <FileText size={12} /> Documento Zen
                    </span>
                    <span className="flex items-center gap-2">
                      <Type size={12} />{" "}
                      {text.split(" ").filter(Boolean).length} palabras
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setText("")}
                      className="hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={12} /> Limpiar
                    </button>
                    <button className="hover:text-blue-400 transition-colors flex items-center gap-2">
                      <Copy size={12} /> Copiar
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpertMode && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, scale: 0.95 }}
                      animate={{ opacity: 1, height: "auto", scale: 1 }}
                      exit={{ opacity: 0, height: 0, scale: 0.95 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 rounded-[2rem] bg-cyan-400/5 border border-cyan-400/30 text-cyan-400 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(34,211,238,0.15)] relative">
                        <div className="absolute top-3 right-5 text-[8px] font-black tracking-widest text-cyan-400/40 uppercase animate-pulse">
                          System Expert Signal Active
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-cyan-400/15 flex items-center justify-center text-cyan-400 shrink-0 border border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                            <Zap
                              size={22}
                              fill="currentColor"
                              className="animate-pulse"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                              MODO EXPERTO ACTIVADO (EXPERT MODE ON)
                            </h4>
                            <p className="text-[10px] text-cyan-300/80 font-medium leading-relaxed max-w-xl">
                              La Inteligencia Artificial analizará tu texto
                              aplicando un nivel máximo de rigurosidad
                              gramatical, vocabulario avanzado C1/C2 y
                              recomendaciones idiomáticas refinadas.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setIsExpertMode(false)}
                          className="px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all shrink-0 shadow-lg"
                        >
                          Desactivar
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Comienza a escribir tu ensayo, correo o frase en inglés..."
                    className="w-full h-full bg-transparent resize-none text-white text-2xl font-medium leading-relaxed focus:outline-none placeholder:text-white/5 placeholder:font-black placeholder:uppercase placeholder:tracking-[0.5em]"
                  />
                </div>
              </div>
            </div>

            {/* Analysis Sidebar */}
            <AnimatePresence>
              {showAnalysis && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  className="w-full md:w-96 border-l border-white/5 bg-white/[0.02] backdrop-blur-3xl p-8 overflow-y-auto custom-scrollbar"
                >
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-sm font-black uppercase tracking-tight">
                        Análisis IA
                      </h3>
                      <button
                        onClick={() => setShowAnalysis(false)}
                        className="text-white/20 hover:text-white"
                      >
                        <Menu size={16} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 rounded-2xl bg-amber-400/5 border border-amber-400/20 space-y-4">
                        <div className="flex items-center gap-2 text-amber-400">
                          <Info size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Sugerencia de Estilo
                          </span>
                        </div>
                        <p className="text-white text-xs font-medium leading-relaxed">
                          {analysisResult?.suggestion || "Analysis complete."}
                        </p>
                      </div>

                      <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 text-center space-y-2">
                        <p className="text-white/20 text-[8px] font-black uppercase tracking-widest">
                          Writing Quality Score
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <Zap size={20} className="text-blue-400" />
                          <span className="text-3xl font-black text-white">
                            {analysisResult?.score || 0}/100
                          </span>
                        </div>
                      </div>

                      {/* CEFR/MCER Level Progress Tracker */}
                      {analysisResult && (
                        <div className="p-6 rounded-[2rem] bg-black/40 border border-[#DEFF9A]/10 space-y-4">
                          <div className="text-center space-y-1">
                            <p className="text-[#DEFF9A] text-[9px] font-black uppercase tracking-widest">
                              Nivel Gramatical Estimado
                            </p>
                            <h4 className="text-white text-2xl font-black">
                              {analysisResult.cefr || "A1"}
                            </h4>
                          </div>

                          {/* Progress Line and Nodes */}
                          <div className="space-y-3">
                            <div className="relative w-full h-1 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-[#DEFF9A] transition-all duration-700"
                                style={{
                                  width: `${
                                    ((["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(analysisResult.cefr || "A1") + 1) / 6) * 100
                                  }%`,
                                }}
                              />
                            </div>

                            {/* Node labels */}
                            <div className="grid grid-cols-6 text-center gap-1">
                              {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl, index) => {
                                const currentCefr = analysisResult.cefr || "A1";
                                const isCurrent = currentCefr === lvl;
                                const isPassed = ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(currentCefr) >= index;

                                return (
                                  <div key={lvl} className="flex flex-col items-center">
                                    <span
                                      className={`text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                                        isCurrent
                                          ? "bg-[#DEFF9A] border-[#DEFF9A] text-[#061a1a] shadow-[0_0_10px_#DEFF9A]"
                                          : isPassed
                                          ? "bg-[#DEFF9A]/10 border-[#DEFF9A]/20 text-[#DEFF9A]"
                                          : "bg-white/5 border-white/5 text-white/25"
                                      }`}
                                    >
                                      {lvl}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-white/5">
                            <p className="text-white/50 text-[10px] leading-relaxed">
                              💡 <span className="text-[#DEFF9A] font-bold">Consejo de Progreso:</span> ¡Cuanto más escribas, más estructures tus frases con descripciones, conectores de secuencia y cláusulas de relativo, más rápido desbloquearás los niveles de maestría <strong className="text-white">B2 y C1</strong>!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          /* Challenge Mode UI */
          <div className="flex-1 p-12 bg-white/[0.01] overflow-y-auto flex items-center justify-center">
            <div className="max-w-4xl w-full space-y-12">
              {!selectedLevel ? (
                <div className="text-center space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-white text-3xl font-black uppercase tracking-tight">
                      Escoge tu Nivel de Reto
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto italic">
                      Traduce frases complejas del español al inglés y deja que
                      la IA evalúe tu gramática y vocabulario.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {["A1", "A2", "B1", "B2", "C1", "C2"].map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => {
                          setSelectedLevel(lvl);
                          setCurrentChallengeIdx(0);
                        }}
                        className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group flex flex-col items-center"
                      >
                        <span className="text-3xl font-black text-white mb-2">
                          {lvl}
                        </span>
                        <span className="text-[9px] font-black uppercase text-blue-400/60 group-hover:text-blue-400">
                          Iniciar Reto
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  {/* Challenge Panel */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedLevel(null)}
                        className="flex items-center gap-2 text-white/20 hover:text-white transition-colors"
                      >
                        <ChevronLeft size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Niveles
                        </span>
                      </button>
                      <div className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                        Reto {currentChallengeIdx + 1} /{" "}
                        {filteredChallenges.length}
                      </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-blue-500/5 border border-blue-500/20 space-y-6">
                      <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">
                        Frase a Traducir
                      </p>
                      <h3 className="text-white text-2xl font-black italic">
                        "{currentChallenge.spanish}"
                      </h3>
                      <div className="flex items-center gap-3 text-white/20 italic text-xs">
                        <Info size={14} />
                        <span>Sugerencia: {currentChallenge.hint}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-white/20 text-[9px] font-black uppercase tracking-widest ml-4">
                        Tu Traducción
                      </p>
                      <textarea
                        value={userTranslation}
                        onChange={(e) => setUserTranslation(e.target.value)}
                        placeholder="Escribe aquí tu traducción..."
                        className="w-full h-40 bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 text-white text-lg font-medium resize-none focus:border-blue-400/50 transition-colors focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={verifyTranslation}
                      disabled={isAnalyzing || !userTranslation.trim()}
                      className={`w-full py-6 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 transition-all ${
                        isAnalyzing || !userTranslation.trim()
                          ? "bg-white/10 text-white/20"
                          : "bg-blue-500 text-white shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:scale-105"
                      }`}
                    >
                      {isAnalyzing ? (
                        <RefreshCw size={18} className="animate-spin" />
                      ) : (
                        <Sparkles size={18} />
                      )}
                      Validar con IA
                    </button>
                  </div>

                  {/* Feedback Panel */}
                  <div className="h-full flex flex-col">
                    <AnimatePresence mode="wait">
                      {challengeFeedback ? (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="neo-glass rounded-[3rem] p-10 border-white/10 space-y-8 flex-1"
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className={`p-4 rounded-2xl ${challengeFeedback.score >= 80 ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}
                            >
                              {challengeFeedback.score >= 80 ? (
                                <Trophy size={32} />
                              ) : (
                                <Zap size={32} />
                              )}
                            </div>
                            <div className="text-right">
                              <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mb-1">
                                Precisión IA
                              </p>
                              <h4 className="text-4xl font-black text-white">
                                {challengeFeedback.score}%
                              </h4>
                            </div>
                          </div>

                          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                              Evaluación
                            </p>
                            <p className="text-white text-sm font-medium leading-relaxed italic">
                              "{challengeFeedback.details}"
                            </p>
                          </div>

                          <div className="space-y-4">
                            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">
                              Referencia Nativa
                            </p>
                            <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-white text-sm font-bold">
                              {currentChallenge.english}
                            </div>
                          </div>

                          <button
                            onClick={nextChallenge}
                            className="w-full py-5 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3"
                          >
                            Siguiente Reto <ArrowRight size={14} />
                          </button>
                        </motion.div>
                      ) : (
                        <div className="flex-1 neo-glass rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center p-12 space-y-6">
                          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10">
                            <Zap size={32} />
                          </div>
                          <p className="text-white/10 text-xs font-black uppercase tracking-widest">
                            Esperando Evaluación...
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {mode === "rewrite" && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 px-6 py-4 rounded-3xl neo-glass border-white/10 flex items-center gap-6 shadow-2xl z-50">
          <button
            className="text-white/40 hover:text-white transition-colors"
            title="Negrita"
          >
            <Type size={18} />
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button
            className="text-white/40 hover:text-white transition-colors"
            title="Seleccionar IA"
          >
            <MousePointer2 size={18} />
          </button>
          <button
            onClick={() => setIsExpertMode((prev) => !prev)}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all border ${
              isExpertMode
                ? "bg-cyan-400/20 border-cyan-400/40 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.25)] scale-105 animate-pulse"
                : "bg-white/5 border-white/5 text-blue-400 hover:text-blue-300 hover:border-blue-400/20"
            }`}
            title="Activar o desactivar el Modo Experto de Inteligencia Artificial"
          >
            <Zap
              size={14}
              fill={isExpertMode ? "currentColor" : "none"}
              className={isExpertMode ? "text-cyan-400" : ""}
            />
            {isExpertMode ? "Expert Mode: ON" : "Expert Mode"}
          </button>
          <div className="w-px h-6 bg-white/10" />
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all border ${
              isAnalyzing || !text.trim()
                ? "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
                : "bg-blue-500 border-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] hover:bg-blue-400 hover:scale-105 cursor-pointer font-bold"
            }`}
            title="Analizar texto con Inteligencia Artificial"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Analizar
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
