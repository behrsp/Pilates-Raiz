import { useState, useEffect, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { EXERCISES, PRINCIPLES } from './data/exercises';
import { Screen, Exercise } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

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
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setCurrentScreen('home')} className="p-2 hover:bg-pilates-green/10 rounded-full">
          <ChevronLeft />
        </button>
        <h2 className="text-3xl">Biblioteca de Exercícios</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXERCISES.map((ex) => (
          <motion.div
            key={ex.id}
            layoutId={`ex-${ex.id}`}
            onClick={() => setSelectedExercise(ex)}
            className="glass-card p-6 cursor-pointer hover:border-pilates-green/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold uppercase tracking-widest opacity-50">#{ex.id}</span>
              <span className={`text-[10px] px-2 py-1 rounded-full border ${
                ex.nivel === 'Iniciante' ? 'border-emerald-500 text-emerald-600' :
                ex.nivel === 'Intermediário' ? 'border-amber-500 text-amber-600' :
                'border-rose-500 text-rose-600'
              }`}>
                {ex.nivel}
              </span>
            </div>
            <h3 className="text-xl mb-1">{ex.nome_pt}</h3>
            <p className="text-sm italic opacity-60">{ex.nome_en}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedExercise && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedExercise(null)}
          >
            <motion.div
              layoutId={`ex-${selectedExercise.id}`}
              className="bg-pilates-beige w-full max-w-2xl rounded-3xl p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-4xl mb-2">{selectedExercise.nome_pt}</h2>
                  <p className="text-xl italic opacity-60">{selectedExercise.nome_en}</p>
                </div>
                <button onClick={() => setSelectedExercise(null)} className="p-2 hover:bg-pilates-green/10 rounded-full">
                  <ChevronLeft className="rotate-90" />
                </button>
              </div>

              <div className="mb-8 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <img 
                  src={selectedExercise.imagem} 
                  alt={selectedExercise.nome_pt} 
                  className="w-full h-64 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-6">
                <section>
                  <h4 className="font-bold uppercase text-xs tracking-widest mb-2 opacity-50">Posição Inicial</h4>
                  <p>{selectedExercise.posicao_inicial}</p>
                </section>
                <section>
                  <h4 className="font-bold uppercase text-xs tracking-widest mb-2 opacity-50">Execução</h4>
                  <p>{selectedExercise.execucao}</p>
                </section>
                <section>
                  <h4 className="font-bold uppercase text-xs tracking-widest mb-2 opacity-50">Respiração</h4>
                  <p>{selectedExercise.respiracao}</p>
                </section>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-pilates-green/10">
                  <div>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-1 opacity-50">Repetições</h4>
                    <p className="font-medium">{selectedExercise.repeticoes}</p>
                  </div>
                  <div>
                    <h4 className="font-bold uppercase text-xs tracking-widest mb-1 opacity-50">Benefícios</h4>
                    <p className="text-sm">{selectedExercise.beneficios}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderSequence = () => {
    const ex = EXERCISES[sequenceIndex];
    const progress = ((sequenceIndex + 1) / EXERCISES.length) * 100;

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
              {sequenceIndex + 1} / {EXERCISES.length}
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
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-40 mb-4 block">Exercício {ex.id}</span>
              <h2 className="text-5xl mb-2">{ex.nome_pt}</h2>
              <p className="text-xl italic opacity-60 mb-8">{ex.nome_en}</p>

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
                  <h4 className="font-bold uppercase text-[10px] tracking-widest mb-3 opacity-50 flex items-center gap-2">
                    <RotateCcw size={14} /> Posição e Execução
                  </h4>
                  <p className="text-lg leading-relaxed">{ex.posicao_inicial} {ex.execucao}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="glass-card p-6 border-l-4 border-pilates-green">
                    <h4 className="font-bold uppercase text-[10px] tracking-widest mb-2 opacity-50">Respiração</h4>
                    <p>{ex.respiracao}</p>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-pilates-green">
                    <h4 className="font-bold uppercase text-[10px] tracking-widest mb-2 opacity-50">Repetições</h4>
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
          
          {sequenceIndex < EXERCISES.length - 1 ? (
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
              <p className="text-lg opacity-70 leading-relaxed">{p.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 p-8 glass-card bg-pilates-green text-pilates-beige">
        <h3 className="text-2xl mb-4 text-white">O que é Contrologia?</h3>
        <p className="opacity-90 leading-relaxed">
          "A Contrologia é o controle consciente de todos os movimentos musculares do corpo. É a utilização e aplicação correta dos princípios mecânicos que abrangem a estrutura do esqueleto, um conhecimento completo dos mecanismos funcionais do corpo e o entendimento total dos princípios de equilíbrio e gravidade aplicados a cada movimento."
        </p>
        <p className="mt-4 font-serif italic">— Joseph Pilates</p>
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
        <p className="text-lg opacity-70 leading-relaxed mb-6">
          Este aplicativo foi desenvolvido para ser um guia fiel aos ensinamentos originais de Joseph Pilates, conforme descritos em sua obra "Return to Life Through Contrology".
        </p>
        <p className="text-lg opacity-70 leading-relaxed">
          Nossa missão é democratizar o acesso à sequência clássica, mantendo a precisão técnica e o respeito aos princípios que tornam este método único.
        </p>
      </div>

      <p className="text-sm opacity-50">Desenvolvido para amantes da Contrologia clássica.</p>
    </div>
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
    </div>
  );
}
