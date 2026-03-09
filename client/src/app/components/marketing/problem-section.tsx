import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { AlertTriangle, Database, Users } from 'lucide-react';

export function ProblemSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const breachProgress = useTransform(scrollYProgress, [0.2, 0.8], [0, 1]);
  const [breached, setBreached] = useState(0);

  useEffect(() => {
    return breachProgress.on('change', (latest) => {
      setBreached(latest);
    });
  }, [breachProgress]);

  const companies = [
    { name: 'Social Media', position: { x: '15%', y: '20%' } },
    { name: 'E-commerce', position: { x: '75%', y: '25%' } },
    { name: 'Banking', position: { x: '20%', y: '70%' } },
    { name: 'Healthcare', position: { x: '70%', y: '75%' } },
    { name: 'Government', position: { x: '50%', y: '15%' } }
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center py-32 overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #050D1A 0%, #0A1628 100%)' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section intro */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="font-mono text-[#F5A623] text-sm tracking-[0.2em] uppercase">
              THE PROBLEM
            </span>
            <h2 className="mt-4 text-5xl font-bold">
              Your Data is{' '}
              <span className="text-[#F5A623]">Everywhere</span>
            </h2>
          </motion.div>

          {/* Interactive breach visualization */}
          <div className="relative h-[600px] w-full">
            {/* Central database node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                animate={{
                  scale: breached > 0.5 ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: breached > 0.5 ? Infinity : 0, repeatDelay: 1 }}
                className="relative"
              >
                <div className="w-32 h-32 rounded-2xl flex items-center justify-center"
                     style={{
                       background: breached > 0.5 ? 'rgba(245, 166, 35, 0.1)' : 'rgba(10, 22, 40, 0.8)',
                       border: `2px solid ${breached > 0.5 ? '#F5A623' : 'rgba(0, 194, 255, 0.3)'}`,
                       boxShadow: breached > 0.5 
                         ? '0 0 60px rgba(245, 166, 35, 0.4)' 
                         : '0 0 40px rgba(0, 194, 255, 0.1)'
                     }}>
                  <Database className="w-12 h-12" style={{ color: breached > 0.5 ? '#F5A623' : '#00C2FF' }} />
                </div>
                
                <div className="absolute -top-2 -right-2">
                  {breached > 0.5 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-[#F5A623] flex items-center justify-center"
                    >
                      <AlertTriangle className="w-5 h-5 text-[#050D1A]" />
                    </motion.div>
                  )}
                </div>

                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="font-mono text-sm" style={{ color: breached > 0.5 ? '#F5A623' : '#7A8FA6' }}>
                    {breached > 0.5 ? 'BREACHED' : 'YOUR DATA'}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Company nodes */}
            {companies.map((company, i) => {
              const isBreached = breached > (i * 0.15 + 0.2);
              
              return (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: company.position.x,
                    top: company.position.y
                  }}
                >
                  {/* Connection line */}
                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none"
                       style={{ 
                         width: '100vw', 
                         height: '100vh',
                         transform: 'translate(-50%, -50%)'
                       }}>
                    <motion.line
                      x1="50%"
                      y1="50%"
                      x2="50vw"
                      y2="50vh"
                      stroke={isBreached ? '#F5A623' : 'rgba(0, 194, 255, 0.2)'}
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: breached > 0.1 ? 1 : 0 }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                    />
                  </svg>

                  {/* Company node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative -translate-x-1/2 -translate-y-1/2"
                  >
                    <div className="w-20 h-20 rounded-xl flex items-center justify-center"
                         style={{
                           background: 'rgba(15, 30, 53, 0.9)',
                           border: `1px solid ${isBreached ? '#F5A623' : 'rgba(0, 194, 255, 0.15)'}`,
                           boxShadow: isBreached 
                             ? '0 0 30px rgba(245, 166, 35, 0.3)' 
                             : '0 0 20px rgba(0, 194, 255, 0.05)'
                         }}>
                      <Users className="w-8 h-8" style={{ color: isBreached ? '#F5A623' : '#7A8FA6' }} />
                    </div>
                    
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium" style={{ color: isBreached ? '#F5A623' : '#7A8FA6' }}>
                        {company.name}
                      </span>
                    </div>

                    {/* Breach animation */}
                    {isBreached && (
                      <motion.div
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl border-2 border-[#F5A623]"
                      />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* Text fragments */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: breached > 0.3 ? 1 : 0, y: breached > 0.3 ? 0 : 20 }}
            viewport={{ once: false }}
            className="text-center space-y-4 mt-16"
          >
            <p className="text-xl text-[#7A8FA6] max-w-3xl mx-auto">
              Every company you interact with stores your personal data in centralized databases.
            </p>
            {breached > 0.6 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-semibold text-[#F5A623]"
              >
                One breach. Everywhere exposed.
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
