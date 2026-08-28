import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Particles } from './Particles';
import { Fog } from './Fog';

const getAssetUrl = (path: string) => {
  if (!path) return '';
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
};

// A placeholder for the background audio. 
const AUDIO_SRC = getAssetUrl("/aria-of-the-soul.mp3");

// A placeholder for the default background image. 
const DEFAULT_BG_IMAGE = "";

type MessageLine = {
  text: string;
  bgImage?: string | string[];
  portraitPosition?: 'left' | 'right';
  mobilePortraitPosition?: 'left' | 'right';
  mobileTopPosition?: 'left' | 'right';
  mobileBottomPosition?: 'left' | 'right';
  mobileTopOffset?: string;
  mirrorRight?: boolean;
};

const messageLines: MessageLine[] = [
  { text: "Bienvenido a la Velvet Room. Tu destino te ha traído hasta este nuevo año de vida." },
  { text: "Este lugar existe entre el sueño y la realidad, la mente y la materia... y hoy la Velvet Room abre sus puertas para honrar tu progreso, tu viaje y las decisiones que te han traído hasta aquí." },
  { text: "A lo largo del tiempo, has forjado vínculos inquebrantables, superado adversidades y descubierto nuevas facetas de tu propio corazón a través de la saga de tu propia existencia:", bgImage: "/renders/new_p1.png", portraitPosition: "left", mobilePortraitPosition: "left", mobileTopOffset: "-top-18" },
  { text: "Has aprendido a buscar la Verdad entre los rumores, transformando tus pensamientos en la fuerza que moldea el mundo a tu alrededor.", bgImage: ["/renders/new_p2m.png", "/renders/new_p2w.png"], mirrorRight: false, mobileTopPosition: "left", mobileBottomPosition: "right" },
  { text: "Miraste de frente al Memento Mori para encender tu propia determinación (Burn My Dread), enfrentando la hora medianoche con un valor que solo tú posees.", bgImage: ["/renders/new_p3m.png", "/renders/new_p3k.png"], mirrorRight: false, mobileTopPosition: "right", mobileBottomPosition: "left" },
  { text: "Despejaste la niebla de la incertidumbre aceptando cada parte de tu ser, demostrando que comprender tu sombra es el paso definitivo para alcanzar la autenticidad.", bgImage: "/renders/new_p4.png", portraitPosition: "left", mobilePortraitPosition: "right", mobileTopOffset: "-top-20" },
  { text: "Rompiste las cadenas del destino como un verdadero rebelde, robándote el corazón de quienes te rodean con la convicción de tu libertad.", bgImage: "/renders/new_p5.png", portraitPosition: "right", mobilePortraitPosition: "right", mobileTopOffset: "-top-10" },
  { text: "La vida es un viaje compuesto de innumerables elecciones. Aunque las antiguas leyendas hablen de profecías entre la luz y la sombra, la verdad es que ninguna profecía está tallada en piedra." },
  { text: "Algunas decisiones son sencillas; otras exigen un poder que siempre ha residido en ti. Has aceptado la responsabilidad de tu camino y tus Vínculos Sociales continúan otorgándote la energía para despertar a tu verdadero potencial." },
  { text: "Tú eres yo, y yo soy tú... Los vínculos que has forjado se han convertido en la fuerza que guía tu destino. Que estas alianzas rompan cualquier cadena y se conviertan en las alas que te lleven hacia tu verdadero potencial." },
  { text: "Nunca lo olvides: eres el autor de tu propio destino, nada está escrito y el poder de cambiar el mundo está en tus manos. Las cartas están a tu favor." },
  { text: "¡Feliz Cumpleaños Eduardo!" },
  { text: "Hasta que nos volvamos a encontrar en este lugar donde el destino se forja..." }
];

export function VelvetRoom() {
  const [hasEntered, setHasEntered] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleEnter = () => {
    setHasEntered(true);
    if (audioRef.current && AUDIO_SRC) {
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
    if (isMuted && parseFloat(e.target.value) > 0) {
      setIsMuted(false);
    }
  };

  const currentBgImage = messageLines[currentLineIndex].bgImage || DEFAULT_BG_IMAGE;
  const currentPortraitPos = messageLines[currentLineIndex].portraitPosition || 'right';
  const mobilePortraitPos = messageLines[currentLineIndex].mobilePortraitPosition || currentPortraitPos;
  const mobileTopPos = messageLines[currentLineIndex].mobileTopPosition || 'left';
  const mobileBottomPos = messageLines[currentLineIndex].mobileBottomPosition || 'right';
  const mobileTopOffset = messageLines[currentLineIndex].mobileTopOffset || '-top-10';
  const shouldMirrorRight = messageLines[currentLineIndex].mirrorRight !== false;
  const isDualPortrait = Array.isArray(currentBgImage) && currentBgImage.length >= 2;
  const isSinglePortrait = !Array.isArray(currentBgImage) && !!currentBgImage;

  return (
    <div className="relative w-full h-screen font-sans text-white overflow-hidden bg-velvet-dark">
      {/* Background audio element */}
      {AUDIO_SRC && <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" />}

      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="welcome"
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-velvet-dark overflow-hidden"
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
          >
            {/* Velvet Room V Logo — translucent pulsing watermark on welcome screen */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, delay: 0.5 }}
            >
              <motion.img
                src={getAssetUrl("/velvet_logo.png")}
                alt=""
                className="w-[88vw] md:w-[44vw] max-w-[560px] select-none"
                animate={{
                  opacity: [0.07, 0.14, 0.07],
                  filter: [
                    "drop-shadow(0 0 14px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.15))",
                    "drop-shadow(0 0 30px rgba(212,175,55,0.9)) drop-shadow(0 0 75px rgba(212,175,55,0.45))",
                    "drop-shadow(0 0 14px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.15))",
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center gap-10"
            >
              <h1 className="text-4xl md:text-5xl font-serif text-velvet-gold-light text-glow-gold tracking-widest text-center px-6">
                Te doy la bienvenida a la<br className="md:hidden" /> Velvet Room
              </h1>

              <button
                onClick={handleEnter}
                className="group relative px-8 py-3 overflow-hidden rounded-sm border border-velvet-gold/60 bg-transparent transition-all duration-500 hover:border-velvet-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:outline-none"
              >
                <div className="absolute inset-0 bg-velvet-gold/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                <span className="relative font-serif text-xl tracking-wider text-velvet-gold-light group-hover:text-white transition-colors duration-300">
                  Firmar el Contrato
                </span>
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="main-room"
            className="absolute inset-0 bg-velvet-gradient flex flex-col items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          >
            <Fog />
            <Particles />

            {/* Velvet Room V Logo — translucent pulsing watermark */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 3, delay: 1 }}
            >
              <motion.img
                src={getAssetUrl("/velvet_logo.png")}
                alt=""
                className="w-[82vw] md:w-[42vw] max-w-[540px] select-none"
                style={{ filter: "drop-shadow(0 0 18px rgba(212,175,55,0.55)) drop-shadow(0 0 50px rgba(212,175,55,0.25))" }}
                animate={{
                  opacity: [0.07, 0.13, 0.07],
                  filter: [
                    "drop-shadow(0 0 14px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.15))",
                    "drop-shadow(0 0 28px rgba(212,175,55,0.85)) drop-shadow(0 0 70px rgba(212,175,55,0.4))",
                    "drop-shadow(0 0 14px rgba(212,175,55,0.4)) drop-shadow(0 0 40px rgba(212,175,55,0.15))",
                  ]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* === DUAL-PORTRAIT SIDE FLANKS (when 2 protagonists) === */}
            <AnimatePresence mode="wait">
              {isDualPortrait && (
                <motion.div
                  key={(currentBgImage as string[]).join(',')}
                  className="absolute inset-0 pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  {/* Top protagonist — dynamic top-left / top-right on mobile, bottom-left on desktop */}
                  <motion.img
                    src={getAssetUrl((currentBgImage as string[])[0])}
                    alt=""
                    className={`absolute -top-16 ${mobileTopPos === 'left' ? 'left-0' : 'right-0'} md:top-auto md:bottom-0 md:left-0 md:right-auto h-[55vh] max-h-[58vh] md:h-[88vh] md:max-h-[88vh] w-auto object-contain ${mobileTopPos === 'left' ? 'object-left-top' : 'object-right-top'} md:object-bottom select-none`}
                    style={{
                      filter: mobileTopPos === 'left'
                        ? "drop-shadow(0 0 25px rgba(212,175,55,0.25)) drop-shadow(4px 0 20px rgba(10,10,40,0.6))"
                        : "drop-shadow(0 0 25px rgba(212,175,55,0.25)) drop-shadow(-4px 0 20px rgba(10,10,40,0.6))",
                      maskImage: mobileTopPos === 'left'
                        ? "linear-gradient(135deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                        : "linear-gradient(225deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)",
                      WebkitMaskImage: mobileTopPos === 'left'
                        ? "linear-gradient(135deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                        : "linear-gradient(225deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                    }}
                    initial={{ x: mobileTopPos === 'left' ? -60 : 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.55 }}
                    exit={{ x: mobileTopPos === 'left' ? -60 : 60, opacity: 0 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                  />
                  {/* Bottom protagonist — dynamic bottom-right / bottom-left on mobile, bottom-right on desktop */}
                  <motion.img
                    src={getAssetUrl((currentBgImage as string[])[1])}
                    alt=""
                    className={`absolute bottom-0 ${mobileBottomPos === 'left' ? 'left-0' : 'right-0'} md:right-0 md:left-auto h-[55vh] max-h-[58vh] md:h-[88vh] md:max-h-[88vh] w-auto object-contain ${mobileBottomPos === 'left' ? 'object-left-bottom' : 'object-right-bottom'} md:object-bottom select-none`}
                    style={{
                      filter: mobileBottomPos === 'left'
                        ? "drop-shadow(0 0 25px rgba(212,175,55,0.25)) drop-shadow(4px 0 20px rgba(10,10,40,0.6))"
                        : "drop-shadow(0 0 25px rgba(212,175,55,0.25)) drop-shadow(-4px 0 20px rgba(10,10,40,0.6))",
                      maskImage: mobileBottomPos === 'left'
                        ? "linear-gradient(135deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                        : "linear-gradient(315deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)",
                      WebkitMaskImage: mobileBottomPos === 'left'
                        ? "linear-gradient(135deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                        : "linear-gradient(315deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                    }}
                    initial={{ x: mobileBottomPos === 'left' ? -60 : 60, opacity: 0, scaleX: shouldMirrorRight ? -1 : 1 }}
                    animate={{ x: 0, opacity: 0.55, scaleX: shouldMirrorRight ? -1 : 1 }}
                    exit={{ x: mobileBottomPos === 'left' ? -60 : 60, opacity: 0, scaleX: shouldMirrorRight ? -1 : 1 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* === SINGLE PORTRAIT — background figure (positioned per character) === */}
            <AnimatePresence mode="wait">
              {isSinglePortrait && (
                <motion.div
                  key={currentBgImage as string}
                  className="absolute inset-0 pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                >
                  <motion.img
                    src={getAssetUrl(currentBgImage as string)}
                    alt=""
                    className={`absolute ${mobileTopOffset} ${mobilePortraitPos === 'left' ? 'left-0' : 'right-0'} ${currentPortraitPos === 'left' ? 'md:left-0 md:right-auto' : 'md:right-0 md:left-auto'} md:top-auto md:bottom-0 h-[55vh] max-h-[58vh] md:h-[88vh] md:max-h-[88vh] w-auto object-contain ${mobilePortraitPos === 'left' ? 'object-left-top' : 'object-right-top'} md:object-bottom select-none`}
                    style={{
                      filter: mobilePortraitPos === 'left'
                        ? "drop-shadow(0 0 30px rgba(212,175,55,0.2)) drop-shadow(4px 0 20px rgba(10,10,40,0.5))"
                        : "drop-shadow(0 0 30px rgba(212,175,55,0.2)) drop-shadow(-4px 0 20px rgba(10,10,40,0.5))",
                      maskImage: mobilePortraitPos === 'left'
                        ? "linear-gradient(135deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                        : "linear-gradient(225deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)",
                      WebkitMaskImage: mobilePortraitPos === 'left'
                        ? "linear-gradient(135deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                        : "linear-gradient(225deg, rgba(0,0,0,1) 30%, rgba(0,0,0,0.75) 58%, rgba(0,0,0,0.2) 82%, rgba(0,0,0,0) 98%)"
                    }}
                    initial={{ x: mobilePortraitPos === 'left' ? -60 : 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.55 }}
                    exit={{ x: mobilePortraitPos === 'left' ? -60 : 60, opacity: 0 }}
                    transition={{ duration: 1.3, ease: "easeOut" }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* === DIALOG layout wrapper — ALWAYS CENTERED === */}
            <div className="relative z-20 w-full flex items-center justify-center px-4 md:px-8">

              {/* Main Content Glass Panel — Always Centered */}
              <motion.div
                className="relative w-full max-w-3xl md:max-w-4xl py-10 md:py-12 px-6 md:px-12 glass-panel rounded-sm flex flex-col items-center justify-center min-h-[28vh] md:min-h-[32vh] cursor-pointer mx-auto"
                initial={{ scale: 0.8, opacity: 0, rotateX: 15, y: 50, filter: 'blur(10px)' }}
                animate={{ scale: 1, opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1.8, delay: 0.2, type: "spring", bounce: 0.2 }}
                style={{ perspective: 1000 }}
                onClick={() => {
                  if (currentLineIndex < messageLines.length - 1) {
                    setCurrentLineIndex(prev => prev + 1);
                  }
                }}
              >
                {/* Animated Glowing Borders */}
                <motion.div className="absolute top-0 left-1/2 h-[2px] bg-velvet-gold-light shadow-[0_0_15px_2px_rgba(212,175,55,1)]" initial={{ width: 0, x: "-50%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }} />
                <motion.div className="absolute bottom-0 left-1/2 h-[2px] bg-velvet-gold-light shadow-[0_0_15px_2px_rgba(212,175,55,1)]" initial={{ width: 0, x: "-50%" }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 1 }} />
                <motion.div className="absolute top-1/2 left-0 w-[2px] bg-velvet-gold-light shadow-[0_0_15px_2px_rgba(212,175,55,1)]" initial={{ height: 0, y: "-50%" }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 2.2 }} />
                <motion.div className="absolute top-1/2 right-0 w-[2px] bg-velvet-gold-light shadow-[0_0_15px_2px_rgba(212,175,55,1)]" initial={{ height: 0, y: "-50%" }} animate={{ height: "100%" }} transition={{ duration: 1.5, ease: "easeInOut", delay: 2.2 }} />

                {/* Decorative Corner Ornaments */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.5, duration: 1.5 }}>
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-velvet-gold/80 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-velvet-gold/80 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-velvet-gold/80 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-velvet-gold/80 shadow-[0_0_10px_rgba(212,175,55,0.8)]"></div>
                </motion.div>

                {/* Text Display Sequence */}
                <div className="w-full relative flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentLineIndex}
                      initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className={`font-serif leading-relaxed tracking-wide text-center px-4 ${messageLines[currentLineIndex].text.includes("Feliz Cumpleaños")
                        ? "text-3xl md:text-5xl text-velvet-gold-light text-glow-gold font-bold"
                        : isDualPortrait
                          ? "text-base md:text-xl text-blue-50 text-glow-blue"
                          : "text-lg md:text-2xl text-blue-50 text-glow-blue"
                        }`}
                    >
                      {messageLines[currentLineIndex].text}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Indicator for clicking */}
                {currentLineIndex < messageLines.length - 1 && (
                  <motion.div
                    className="absolute bottom-4 right-6 text-velvet-gold-light text-xs font-sans tracking-widest text-glow-gold"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ▼
                  </motion.div>
                )}
              </motion.div>

            </div>{/* end layout wrapper */}

            {/* Audio Controls */}
            {AUDIO_SRC && (
              <motion.div
                className="absolute bottom-4 right-4 z-40 flex items-center gap-3 bg-velvet-dark/70 backdrop-blur-md p-2 px-3 rounded-md border border-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                <button
                  onClick={toggleMute}
                  className="text-velvet-gold-light hover:text-white transition-colors focus:outline-none"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-velvet-gold-light"
                  aria-label="Volume"
                />
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
