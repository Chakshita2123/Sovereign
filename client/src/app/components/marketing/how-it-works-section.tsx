import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { FileCheck, ToggleLeft, CheckCircle2, ArrowRight } from 'lucide-react';

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-66.666%']);

  const acts = [
    {
      number: '01',
      title: 'You Receive a Credential',
      description: 'An issuer (university, government, employer) sends a verifiable credential directly to your wallet.',
      icon: FileCheck,
      color: '#00C2FF',
      animation: 'credential-receive'
    },
    {
      number: '02',
      title: 'You Control What You Share',
      description: 'Selective disclosure lets you choose exactly which data points to reveal. Share your age without your birthdate.',
      icon: ToggleLeft,
      color: '#7B2FFF',
      animation: 'selective-disclosure'
    },
    {
      number: '03',
      title: 'They Verify, Never Store',
      description: 'Verifiers cryptographically confirm your credential is valid without storing any of your data.',
      icon: CheckCircle2,
      color: '#00FF88',
      animation: 'verification'
    }
  ];

  return (
    <section ref={containerRef} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[#050D1A]" />

        {/* Section header */}
        <div className="absolute top-20 left-0 right-0 z-20 text-center">
          <span className="font-mono text-[#00C2FF] text-sm tracking-[0.2em] uppercase">
            HOW IT WORKS
          </span>
          <h2 className="mt-4 text-5xl font-bold">Three Simple Steps</h2>
        </div>

        {/* Horizontal scroll container */}
        <motion.div
          style={{ x }}
          className="absolute top-0 left-0 h-full flex items-center"
        >
          {acts.map((act, i) => (
            <div
              key={i}
              className="w-screen h-full flex-shrink-0 flex items-center justify-center px-12"
            >
              <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* Left: Typography */}
                <div className="space-y-6">
                  <div className="inline-block">
                    <span className="font-mono text-sm tracking-[0.3em]" style={{ color: act.color }}>
                      {act.number}
                    </span>
                  </div>

                  <h3 className="text-5xl font-bold leading-tight">
                    {act.title.split(' ').map((word, wi) => (
                      <span key={wi}>
                        {wi === act.title.split(' ').length - 1 ? (
                          <span style={{ color: act.color }}>{word}</span>
                        ) : (
                          <>{word} </>
                        )}
                      </span>
                    ))}
                  </h3>

                  <p className="text-xl text-[#7A8FA6] leading-relaxed max-w-lg">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-3 pt-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                         style={{
                           background: `${act.color}15`,
                           border: `1px solid ${act.color}40`
                         }}>
                      <act.icon className="w-6 h-6" style={{ color: act.color }} />
                    </div>
                    {i < acts.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-[#7A8FA6]" />
                    )}
                  </div>
                </div>

                {/* Right: Animated mockup */}
                <div className="relative">
                  {act.animation === 'credential-receive' && (
                    <CredentialReceiveAnimation />
                  )}
                  {act.animation === 'selective-disclosure' && (
                    <SelectiveDisclosureAnimation />
                  )}
                  {act.animation === 'verification' && (
                    <VerificationAnimation />
                  )}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3">
          <div className="h-1 w-24 bg-[rgba(0,194,255,0.2)] rounded-full overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full bg-[#00C2FF] origin-left"
            />
          </div>
          <span className="text-xs font-mono text-[#7A8FA6]">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

function CredentialReceiveAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Issuer card */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -top-12 -left-8 z-20"
      >
        <div className="px-4 py-2 rounded-lg bg-[rgba(0,194,255,0.1)] border border-[#00C2FF] backdrop-blur-xl">
          <span className="text-xs font-mono text-[#00C2FF]">University Issuer</span>
        </div>
      </motion.div>

      {/* Credential card flying in */}
      <motion.div
        initial={{ y: -200, opacity: 0, rotate: -10 }}
        whileInView={{ y: 0, opacity: 1, rotate: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        className="p-6 rounded-2xl"
        style={{
          background: 'rgba(10, 22, 40, 0.8)',
          border: '1px solid rgba(0, 194, 255, 0.15)',
          boxShadow: '0 0 40px rgba(0, 194, 255, 0.1)',
          backdropFilter: 'blur(12px)'
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm font-semibold">Bachelor's Degree</div>
            <div className="text-xs text-[#7A8FA6] font-mono mt-1">Computer Science</div>
          </div>
          <FileCheck className="w-5 h-5 text-[#00C2FF]" />
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[#7A8FA6]">Issued by:</span>
            <span className="font-mono">MIT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A8FA6]">Date:</span>
            <span className="font-mono">2024-06-15</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7A8FA6]">Grade:</span>
            <span className="font-mono">3.8 GPA</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[rgba(0,194,255,0.1)]">
          <div className="text-xs font-mono text-[#00C2FF] break-all">
            vc:z6MkhaXg...3dk2pE
          </div>
        </div>
      </motion.div>

      {/* Wallet destination */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.6 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(15,30,53,0.6)] border border-[rgba(0,194,255,0.2)]">
          <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          <span className="text-xs font-mono text-[#7A8FA6]">Added to Your Wallet</span>
        </div>
      </motion.div>
    </div>
  );
}

function SelectiveDisclosureAnimation() {
  const fields = [
    { label: 'Full Name', value: 'Sarah Chen', shared: true },
    { label: 'Date of Birth', value: '1995-04-12', shared: false },
    { label: 'Age', value: '29', shared: true },
    { label: 'Address', value: '123 Main St...', shared: false },
    { label: 'Degree Type', value: 'Bachelor', shared: true }
  ];

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="p-6 rounded-2xl"
           style={{
             background: 'rgba(10, 22, 40, 0.8)',
             border: '1px solid rgba(0, 194, 255, 0.15)',
             boxShadow: '0 0 40px rgba(0, 194, 255, 0.1)',
             backdropFilter: 'blur(12px)'
           }}>
        <div className="mb-6">
          <div className="text-sm font-semibold mb-1">Select Data to Share</div>
          <div className="text-xs text-[#7A8FA6]">Choose what the verifier sees</div>
        </div>

        <div className="space-y-3">
          {fields.map((field, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg"
              style={{
                background: field.shared ? 'rgba(123, 47, 255, 0.05)' : 'rgba(15, 30, 53, 0.6)',
                border: `1px solid ${field.shared ? 'rgba(123, 47, 255, 0.3)' : 'rgba(0, 194, 255, 0.1)'}`
              }}
            >
              <div className="flex-1">
                <div className="text-xs text-[#7A8FA6] mb-1">{field.label}</div>
                <div className="text-sm font-mono" style={{
                  opacity: field.shared ? 1 : 0.3,
                  filter: field.shared ? 'none' : 'blur(4px)'
                }}>
                  {field.value}
                </div>
              </div>
              
              <div className={`w-10 h-6 rounded-full relative transition-all ${
                field.shared ? 'bg-[#7B2FFF]' : 'bg-[rgba(122,143,166,0.2)]'
              }`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                  field.shared ? 'left-5' : 'left-1'
                }`} />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: 0.6 }}
          className="w-full mt-6 py-3 rounded-lg font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg, #7B2FFF, #00C2FF)',
            color: 'white'
          }}
        >
          Share Selected Fields
        </motion.button>
      </div>
    </div>
  );
}

function VerificationAnimation() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Verifier receives checkmark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <div className="w-48 h-48 mx-auto rounded-full flex items-center justify-center relative"
             style={{
               background: 'rgba(0, 255, 136, 0.05)',
               border: '2px solid rgba(0, 255, 136, 0.3)'
             }}>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <CheckCircle2 className="w-24 h-24 text-[#00FF88]" />
          </motion.div>

          {/* Pulsing rings */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-[#00FF88]"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-full border-2 border-[#00FF88]"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.6 }}
        className="mt-8 space-y-4"
      >
        <div className="text-center">
          <div className="text-2xl font-bold text-[#00FF88] mb-2">Verified ✓</div>
          <div className="text-sm text-[#7A8FA6]">Credential authenticated in 8ms</div>
        </div>

        <div className="p-4 rounded-lg bg-[rgba(15,30,53,0.6)] border border-[rgba(0,255,136,0.2)]">
          <div className="text-xs text-[#7A8FA6] mb-2">Verifier received:</div>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
              <span className="font-mono">Valid cryptographic proof</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
              <span className="font-mono">Issuer signature confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
              <span className="font-mono text-[#7A8FA6]">
                <span className="line-through opacity-50">Your personal data</span> (not stored)
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
