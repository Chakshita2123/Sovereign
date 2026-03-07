import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const stats = [
    { value: '50K', label: 'Active Wallets', suffix: '+' },
    { value: '0', label: 'Data Breaches', suffix: '' },
    { value: '10', label: 'Verification Time', suffix: 'ms' }
  ];

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Full-bleed gradient */}
      <div className="absolute inset-0"
           style={{
             background: 'linear-gradient(135deg, rgba(0, 194, 255, 0.1) 0%, rgba(123, 47, 255, 0.1) 100%)'
           }} />
      
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(0, 194, 255, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(0, 194, 255, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px'
             }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Stats displayed vertically rotated */}
          <div className="flex items-center justify-around gap-16">
            {stats.map((stat, i) => {
              const progress = useTransform(
                scrollYProgress,
                [0.3, 0.7],
                [0, 1]
              );

              return (
                <div key={i} className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex flex-col items-center gap-8"
                  >
                    {/* Rotated number reading upward */}
                    <div className="relative">
                      <div className="text-[80px] font-bold leading-none"
                           style={{
                             fontFamily: 'var(--font-display)',
                             background: 'linear-gradient(180deg, #00C2FF 0%, #7B2FFF 100%)',
                             WebkitBackgroundClip: 'text',
                             WebkitTextFillColor: 'transparent',
                             backgroundClip: 'text'
                           }}>
                        {stat.value}{stat.suffix}
                      </div>
                      
                      {/* Animated progress line */}
                      <motion.div
                        style={{ scaleX: progress }}
                        className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] origin-left"
                      />
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div className="font-mono text-sm text-[#7A8FA6] tracking-wider uppercase">
                        {stat.label}
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
