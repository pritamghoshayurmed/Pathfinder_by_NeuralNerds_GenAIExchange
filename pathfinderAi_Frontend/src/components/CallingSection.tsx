import { motion, Variants } from "framer-motion";
import { Phone, Zap, Mic, Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useRef, useEffect } from "react";

const CallingSection = () => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/audio.dat.unknown');
    
    // Add event listeners
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      setError("Failed to load audio. Please check if the file exists.");
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  const handleDemoCall = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError("");

    if (!audioRef.current) {
      setError("Audio not initialized");
      return;
    }

    if (isPlaying) {
      // Pause audio
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play audio
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Error playing audio:", err);
          setError("Failed to play audio. Please try again.");
          setIsPlaying(false);
        });
    }
  };

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />

      <motion.div
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-medium text-purple-300">
              {t("calling.availability")}
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                {t("calling.mainHeading")}
              </span>
              <br />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
                  {t("calling.highlightedText")}
                </span>
                <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-30 animate-pulse" />
              </span>
            </h2>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
          >
            {t("calling.description")}
          </motion.p>

          {/* Phone Number Card */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center"
          >
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300" />
              <div className="relative bg-slate-900/90 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                    <div className="relative w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Phone className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-slate-400 font-medium">
                      {t("calling.phoneLabel")}
                    </div>
                    <a
                      href={`tel:${t("calling.phoneNumber")}`}
                      className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-300"
                    >
                      {t("calling.phoneNumber")}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-500/5 rounded-xl border border-purple-500/10">
                  <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300 text-left">
                    {t("calling.ctaText")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className="pt-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {/* Call Now Button */}
              <a
                href={`tel:${t("calling.phoneNumber")}`}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                {t("calling.button")}
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {t("calling.badge")}
                </span>
              </a>

              {/* Demo Voice Call Button */}
              <button
                onClick={handleDemoCall}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-xl font-semibold text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 border border-indigo-400/20 relative overflow-hidden"
              >
                {/* Animated background when playing */}
                {isPlaying && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-blue-400/20 animate-pulse" />
                )}
                
                <div className="relative flex items-center gap-3">
                  {isPlaying ? (
                    <Pause className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  )}
                  {isPlaying ? "Pause Demo" : "Demo Voice Call"}
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {isPlaying ? (
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Playing
                      </span>
                    ) : (
                      "Try Now"
                    )}
                  </span>
                </div>
              </button>
            </div>

            {/* Playing Indicator */}
            {isPlaying && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex justify-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full backdrop-blur-sm">
                  <div className="flex gap-1">
                    <div className="w-1 h-4 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-4 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-4 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-indigo-300 font-medium">
                    Demo call in progress...
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallingSection;
