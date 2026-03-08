import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  BookOpen, 
  Dumbbell, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Heart,
  RotateCcw,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { EXERCISES, PRINCIPLES } from './data/exercises';
import { Screen, Exercise } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('pilates_exercises');
    return saved ? JSON.parse(saved) : EXERCISES;
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [deletingExerciseId, setDeletingExerciseId] = useState<number | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('pilates_exercises', JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSequence = () => {
    setSequenceIndex(0);
    setTimer(0);
    setIsTimerRunning(true);
    setCurrentScreen('sequence');
  };

  const handleSaveExercise = () => {
    if (!editingExercise) return;

    if (isAddingNew) {
      setExercises(prev => [...prev, editingExercise]);
    } else {
      setExercises(prev => prev.map(ex => ex.id === editingExercise.id ? editingExercise : ex));
    }
    setEditingExercise(null);
    setIsAddingNew(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingExercise) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingExercise({
          ...editingExercise,
          imagem: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderEditModal = () => (
    <AnimatePresence>
      {editingExercise && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-pilates-beige w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-medium">{isAddingNew ? 'Novo Exercício' : 'Editar Exercício'}</h2>
              <button onClick={() => setEditingExercise(null)} className="p-2 hover:bg-pilates-green/10 rounded-full">
                <X size={24} />
              </button>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Nome (EN)</label>
                  <input 
                    type="text" 
                    value={editingExercise.nome_en}
                    onChange={(e) => setEditingExercise({...editingExercise, nome_en: e.target.value})}
                    className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                    placeholder="Ex: The Hundred"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Nome (PT)</label>
                  <input 
                    type="text" 
                    value={editingExercise.nome_pt}
                    onChange={(e) => setEditingExercise({...editingExercise, nome_pt: e.target.value})}
                    className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                    placeholder="Ex: O Cem"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Imagem do Exercício</label>
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full md:w-48 aspect-video md:aspect-square rounded-2xl border-2 border-dashed border-pilates-green/20 bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-pilates-green/5 transition-colors overflow-hidden group relative"
                  >
                    {editingExercise.imagem ? (
                      <>
                        <img src={editingExercise.imagem} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Upload className="text-white" />
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={32} className="opacity-20 mb-2" />
                        <span className="text-xs opacity-40">Escolher Imagem</span>
                      </>
                    )}
                  </div>
                  <div className="flex-1 space-y-4 w-full">
                    <p className="text-xs opacity-50 leading-relaxed">
                      Selecione uma imagem do seu dispositivo. Ela será salva localmente no seu navegador.
                    </p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-pilates-green/20 text-sm font-medium hover:bg-pilates-green/5 transition-colors"
                    >
                      <Upload size={16} /> Alterar Imagem
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest opacity-30">Ou use uma URL</label>
                      <input 
                        type="text" 
                        value={editingExercise.imagem.startsWith('data:') ? '' : editingExercise.imagem}
                        onChange={(e) => setEditingExercise({...editingExercise, imagem: e.target.value})}
                        className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                        placeholder="https://exemplo.com/imagem.png"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Nível</label>
                  <select 
                    value={editingExercise.nivel}
                    onChange={(e) => setEditingExercise({...editingExercise, nivel: e.target.value as any})}
                    className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Repetições</label>
                  <input 
                    type="text" 
                    value={editingExercise.repeticoes}
                    onChange={(e) => setEditingExercise({...editingExercise, repeticoes: e.target.value})}
                    className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                    placeholder="Ex: 10 ciclos"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Posição Inicial</label>
                <textarea 
                  value={editingExercise.posicao_inicial}
                  onChange={(e) => setEditingExercise({...editingExercise, posicao_inicial: e.target.value})}
                  className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20 h-24 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Execução</label>
                <textarea 
                  value={editingExercise.execucao}
                  onChange={(e) => setEditingExercise({...editingExercise, execucao: e.target.value})}
                  className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20 h-24 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Respiração</label>
                  <input 
                    type="text" 
                    value={editingExercise.respiracao}
                    onChange={(e) => setEditingExercise({...editingExercise, respiracao: e.target.value})}
                    className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest opacity-50">Benefícios</label>
                  <input 
                    type="text" 
                    value={editingExercise.beneficios}
                    onChange={(e) => setEditingExercise({...editingExercise, beneficios: e.target.value})}
                    className="w-full bg-white border border-pilates-green/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pilates-green/20"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => setEditingExercise(null)}
                  className="flex-1 px-6 py-4 rounded-2xl border-2 border-pilates-green/20 text-pilates-green font-bold hover:bg-pilates-green/5 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleSaveExercise}
                  className="flex-1 px-6 py-4 rounded-2xl bg-pilates-green text-white font-bold hover:bg-pilates-green/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Salvar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl md:text-7xl mb-4 text-pilates-green">Pilates Raiz</h1>
        <p className="text-xl italic opacity-80">"Retorne à vida através do movimento consciente"</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button 
          onClick={() => setCurrentScreen('exercises')}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Dumbbell size={20} /> Exercícios
        </button>
        <button 
          onClick={startSequence}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Play size={20} /> Sequência Clássica
        </button>
        <button 
          onClick={() => setCurrentScreen('library')}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <BookOpen size={20} /> Biblioteca
        </button>
        <button 
          onClick={() => setCurrentScreen('about')}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <Info size={20} /> Sobre
        </button>
      </div>
    </div>
  );

  const renderExercises = () => (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-pilates-green/10 rounded-full">
            <ChevronLeft />
          </button>
          <h2 className="text-3xl font-medium">Biblioteca de Exercícios</h2>
        </div>
        <button 
          onClick={() => {
            setIsAddingNew(true);
            setEditingExercise({
              id: Math.max(0, ...exercises.map(e => e.id)) + 1,
              nome_en: '',
              nome_pt: '',
              posicao_inicial: '',
              execucao: '',
              respiracao: '',
              repeticoes: '',
              beneficios: '',
              nivel: 'Iniciante',
              imagem: 'https://picsum.photos/seed/pilates/800/600'
            });
          }}
          className="flex items-center gap-2 bg-pilates-green text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-pilates-green/90 transition-colors"
        >
          <Plus size={18} /> Novo Exercício
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exercises.map((ex) => (
          <motion.div
            key={ex.id}
            layoutId={`ex-${ex.id}`}
            className="glass-card p-6 cursor-pointer hover:border-pilates-green/30 transition-colors group relative"
            onClick={() => setSelectedExercise(ex)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-70">#{ex.id}</span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-1 rounded-full border ${
                  ex.nivel === 'Iniciante' ? 'border-emerald-500 text-emerald-600' :
                  ex.nivel === 'Intermediário' ? 'border-amber-500 text-amber-600' :
                  'border-rose-500 text-rose-600'
                }`}>
                  {ex.nivel}
                </span>
              </div>
            </div>
            <h3 className="text-xl mb-1">{ex.nome_en}</h3>
            <p className="text-sm italic opacity-80">{ex.nome_pt}</p>

            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingExercise(ex);
                  setIsAddingNew(false);
                }}
                className="p-2 bg-white/80 hover:bg-white text-pilates-green rounded-full shadow-sm"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingExerciseId(ex.id);
                }}
                className="p-2 bg-white/80 hover:bg-white text-rose-500 rounded-full shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedExercise && (() => {
          const ex = exercises.find(e => e.id === selectedExercise.id) || selectedExercise;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedExercise(null)}
            >
              <motion.div
                layoutId={`ex-${ex.id}`}
                className="bg-pilates-beige w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-4xl mb-2">{ex.nome_en}</h2>
                    <p className="text-xl italic opacity-80">{ex.nome_pt}</p>
                  </div>
                  <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-pilates-green/10 rounded-full">
                    <ChevronLeft className="rotate-90" />
                  </button>
                </div>

                <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                  <img 
                    src={ex.imagem} 
                    alt={ex.nome_pt} 
                    className="w-full h-64 object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="space-y-6">
                  <section>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-2 opacity-70">Posição Inicial</h4>
                    <p>{ex.posicao_inicial}</p>
                  </section>
                  <section>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-2 opacity-70">Execução</h4>
                    <p>{ex.execucao}</p>
                  </section>
                  <section>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-2 opacity-70">Respiração</h4>
                    <p>{ex.respiracao}</p>
                  </section>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pilates-green/10">
                    <div>
                      <h4 className="font-bold uppercase text-xs tracking-widest mb-1 opacity-70">Repetições</h4>
                      <p className="font-medium">{ex.repeticoes}</p>
                    </div>
                    <div>
                      <h4 className="font-bold uppercase text-xs tracking-widest mb-1 opacity-70">Benefícios</h4>
                      <p className="text-sm">{ex.beneficios}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );

  const renderSequence = () => {
    const ex = exercises[sequenceIndex];
    const progress = ((sequenceIndex + 1) / exercises.length) * 100;

    if (!ex) return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <p>Nenhum exercício na sequência.</p>
        <button onClick={() => setCurrentScreen('home')} className="btn-primary">Voltar</button>
      </div>
    );

    return (
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="p-6 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <button onClick={() => { setIsTimerRunning(false); setCurrentScreen('home'); }} className="flex items-center gap-2 opacity-60 hover:opacity-100">
            <ChevronLeft size={20} /> Sair
          </button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-pilates-green font-mono">
              <Clock size={16} /> {formatTime(timer)}
            </div>
            <div className="text-sm font-bold">
              {sequenceIndex + 1} / {exercises.length}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-pilates-green/10 w-full">
          <motion.div 
            className="h-full bg-pilates-green"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full text-center"
            >
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 mb-4 block">Exercício {ex.id}</span>
              <h2 className="text-5xl mb-2">{ex.nome_en}</h2>
              <p className="text-xl italic opacity-80 mb-8">{ex.nome_pt}</p>

              <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl border-8 border-white max-w-md mx-auto aspect-video">
                <img 
                  src={ex.imagem} 
                  alt={ex.nome_pt} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="grid gap-8 text-left">
                <div className="glass-card p-6">
                  <h4 className="font-bold uppercase text-[10px] tracking-widest mb-3 opacity-70 flex items-center gap-2">
                    <RotateCcw size={14} /> Posição e Execução
                  </h4>
                  <p className="text-lg leading-relaxed">{ex.posicao_inicial} {ex.execucao}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-6 border-l-4 border-pilates-green">
                    <h4 className="font-bold uppercase text-[10px] tracking-widest mb-2 opacity-70">Respiração</h4>
                    <p>{ex.respiracao}</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-pilates-green">
                    <h4 className="font-bold uppercase text-[10px] tracking-widest mb-2 opacity-70">Repetições</h4>
                    <p className="text-xl font-serif">{ex.repeticoes}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="p-8 flex justify-center gap-6 bg-white/50 backdrop-blur-md sticky bottom-0">
          <button 
            disabled={sequenceIndex === 0}
            onClick={() => setSequenceIndex(prev => prev - 1)}
            className="p-4 rounded-full border-2 border-pilates-green/20 text-pilates-green disabled:opacity-20"
          >
            <ChevronLeft size={32} />
          </button>
          
          {sequenceIndex < exercises.length - 1 ? (
            <button 
              onClick={() => setSequenceIndex(prev => prev + 1)}
              className="bg-pilates-green text-white px-12 py-4 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-pilates-green/20"
            >
              Próximo <ChevronRight size={24} />
            </button>
          ) : (
            <button 
              onClick={() => { setIsTimerRunning(false); setCurrentScreen('home'); }}
              className="bg-emerald-600 text-white px-12 py-4 rounded-full font-bold flex items-center gap-3 shadow-lg shadow-emerald-600/20"
            >
              Finalizar Treino <CheckCircle2 size={24} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderLibrary = () => (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-12">
        <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-pilates-green/10 rounded-full">
          <ChevronLeft />
        </button>
        <h2 className="text-4xl">Os 6 Princípios</h2>
      </div>

      <div className="space-y-8">
        {PRINCIPLES.map((p, i) => (
          <motion.div 
            key={p.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-6 items-start"
          >
            <div className="text-4xl font-serif opacity-20 w-12 shrink-0">0{i+1}</div>
            <div>
              <h3 className="text-2xl mb-2">{p.title}</h3>
              <p className="text-lg opacity-90 leading-relaxed">{p.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-8 rounded-3xl bg-pilates-green text-pilates-beige shadow-xl">
        <h3 className="text-2xl mb-4 text-white">O que é Contrologia?</h3>
        <p className="opacity-100 leading-relaxed text-lg">
          "A Contrologia é o controle consciente de todos os movimentos musculares do corpo. É a utilização e aplicação correta dos princípios mecânicos que abrangem a estrutura do esqueleto, um conhecimento completo dos mecanismos funcionais do corpo e o entendimento total dos princípios de equilíbrio e gravidade aplicados a cada movimento."
        </p>
        <p className="mt-4 font-serif italic text-white/80">— Joseph Pilates</p>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="p-6 max-w-2xl mx-auto text-center">
      <div className="flex items-center gap-4 mb-12 text-left">
        <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-pilates-green/10 rounded-full">
          <ChevronLeft />
        </button>
        <h2 className="text-4xl">Sobre o Pilates Raiz</h2>
      </div>
      
      <div className="glass-card p-12 mb-8">
        <div className="w-24 h-24 bg-pilates-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <RotateCcw size={40} className="text-pilates-green" />
        </div>
        <h3 className="text-3xl mb-4">Preservando a História</h3>
        <p className="text-lg opacity-90 leading-relaxed mb-6">
          Este aplicativo foi desenvolvido para ser um guia fiel aos ensinamentos originais de Joseph Pilates, conforme descritos em sua obra "Return to Life Through Contrology".
        </p>
        <p className="text-lg opacity-90 leading-relaxed">
          Nossa missão é democratizar o acesso à sequência clássica, mantendo a precisão técnica e o respeito aos princípios que tornam este método único.
        </p>
      </div>

      <p className="text-sm opacity-50">Desenvolvido para amantes da Contrologia clássica.</p>
    </div>
  );

  const renderDeleteConfirmation = () => (
    <AnimatePresence>
      {deletingExerciseId !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} className="text-rose-500" />
            </div>
            <h3 className="text-2xl mb-2 font-medium">Excluir Exercício?</h3>
            <p className="text-sm opacity-60 mb-8 leading-relaxed">
              Esta ação não pode ser desfeita. O exercício será removido permanentemente da sua biblioteca.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeletingExerciseId(null)}
                className="flex-1 px-6 py-3 rounded-2xl border-2 border-pilates-green/10 text-pilates-green font-bold hover:bg-pilates-green/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setExercises(prev => prev.filter(ex => ex.id !== deletingExerciseId));
                  setDeletingExerciseId(null);
                }}
                className="flex-1 px-6 py-3 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition-colors"
              >
                Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-pilates-beige selection:bg-pilates-green selection:text-white">
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass-card px-6 py-3 flex gap-8 z-40 shadow-xl border-white/20">
        <button onClick={() => setCurrentScreen('home')} className={`p-2 transition-colors ${currentScreen === 'home' ? 'text-pilates-green' : 'text-pilates-green/40'}`}>
          <Home size={24} />
        </button>
        <button onClick={() => setCurrentScreen('exercises')} className={`p-2 transition-colors ${currentScreen === 'exercises' ? 'text-pilates-green' : 'text-pilates-green/40'}`}>
          <Dumbbell size={24} />
        </button>
        <button onClick={() => setCurrentScreen('library')} className={`p-2 transition-colors ${currentScreen === 'library' ? 'text-pilates-green' : 'text-pilates-green/40'}`}>
          <BookOpen size={24} />
        </button>
        <button onClick={() => setCurrentScreen('about')} className={`p-2 transition-colors ${currentScreen === 'about' ? 'text-pilates-green' : 'text-pilates-green/40'}`}>
          <Info size={24} />
        </button>
      </nav>

      <main className="pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentScreen === 'home' && renderHome()}
            {currentScreen === 'exercises' && renderExercises()}
            {currentScreen === 'sequence' && renderSequence()}
            {currentScreen === 'library' && renderLibrary()}
            {currentScreen === 'about' && renderAbout()}
          </motion.div>
        </AnimatePresence>
      </main>
      {renderEditModal()}
      {renderDeleteConfirmation()}
    </div>
  );
}
