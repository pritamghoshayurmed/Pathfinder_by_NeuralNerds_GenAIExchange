import { motion, Variants } from "framer-motion";
import { Phone, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const CallingSection = () => {
  const { t } = useTranslation();

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
        ease: [0.43, 0.13, 0.23, 0.96], // Cubic bezier array instead of string
      },
    },
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

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="pt-4">
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
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default CallingSection;