import { motion } from 'motion/react';
import { Shield, Lock, Key } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background particles and grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 194, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 194, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
        
        {/* Hexagonal pattern overlay */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="50" height="43.4" patternUnits="userSpaceOnUse" patternTransform="scale(2)">
              <path d="M25 0 L50 14.43 L50 28.87 L25 43.3 L0 28.87 L0 14.43 Z" 
                    fill="none" 
                    stroke="rgba(0, 194, 255, 0.03)" 
                    strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Cyan glow */}
      <div className="absolute top-1/4 right-1/4 w-[800px] h-[800px] rounded-full opacity-20 blur-[120px]"
           style={{ background: 'radial-gradient(circle, #00C2FF 0%, transparent 70%)' }} />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Typography Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div className="inline-block">
              <span className="font-mono text-[#00C2FF] text-sm tracking-[0.2em] uppercase">
                SELF-SOVEREIGN IDENTITY
              </span>
            </div>
            
            <h1 className="text-[64px] lg:text-[72px] leading-[0.95] font-bold"
                style={{ fontFamily: 'var(--font-display)' }}>
              Your Identity,
              <br />
              <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] bg-clip-text text-transparent">
                Your Vault
              </span>
            </h1>

            <p className="text-xl text-[#7A8FA6] max-w-xl leading-relaxed">
              Take complete ownership of your personal data through cryptographic wallets. 
              Share what you choose. Verify instantly. Store nothing centrally.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="did:vault:z6Mk..."
                  className="w-full bg-[rgba(10,22,40,0.8)] border border-[rgba(0,194,255,0.15)] rounded-lg px-6 py-4 text-[#F0F4FF] font-mono text-sm backdrop-blur-xl focus:border-[rgba(0,194,255,0.5)] focus:outline-none transition-all"
                  style={{ boxShadow: '0 0 40px rgba(0, 194, 255, 0.06) inset' }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#00C2FF] opacity-50">
                  <Key className="w-5 h-5" />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                className="w-full py-4 px-8 rounded-lg text-white font-semibold relative overflow-hidden group"
                style={{ 
                  background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)',
                  boxShadow: '0 0 0px rgba(0, 194, 255, 0)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 194, 255, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 0 0px rgba(0, 194, 255, 0)';
                }}
              >
                Create Your Vault
              </motion.button>
            </div>
          </motion.div>

          {/* Right: 3D Vault Device */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-[600px] mx-auto">
              {/* Glassmorphic phone mockup */}
              <div className="absolute inset-0 rounded-[48px] overflow-hidden"
                   style={{
                     background: 'rgba(10, 22, 40, 0.8)',
                     border: '1px solid rgba(0, 194, 255, 0.15)',
                     boxShadow: '0 0 80px rgba(0, 194, 255, 0.1) inset, 0 20px 60px rgba(0, 0, 0, 0.5)',
                     backdropFilter: 'blur(12px)',
                     transform: 'perspective(1200px) rotateY(-15deg) rotateX(5deg)'
                   }}>
                
                {/* Phone screen content */}
                <div className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                      <Shield className="w-6 h-6 text-[#00C2FF]" />
                      <span className="font-semibold">VaultID</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                  </div>

                  {/* Credential cards */}
                  <div className="space-y-4 flex-1">
                    {[
                      { title: 'Passport', status: 'Verified', color: '#00FF88' },
                      { title: 'Driver License', status: 'Verified', color: '#00FF88' },
                      { title: 'University Degree', status: 'Pending', color: '#F5A623' }
                    ].map((credential, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="p-4 rounded-2xl"
                        style={{
                          background: 'rgba(15, 30, 53, 0.6)',
                          border: `1px solid ${credential.color}33`,
                          boxShadow: `0 0 20px ${credential.color}10`
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-sm">{credential.title}</div>
                            <div className="text-xs text-[#7A8FA6] font-mono mt-1">
                              vc:z6Mk{Math.random().toString(36).substring(2, 8)}...
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" 
                                 style={{ backgroundColor: credential.color }} />
                            <span className="text-xs font-mono" style={{ color: credential.color }}>
                              {credential.status}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Lock indicator */}
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full"
                         style={{
                           background: 'rgba(0, 194, 255, 0.05)',
                           border: '1px solid rgba(0, 194, 255, 0.2)'
                         }}>
                      <Lock className="w-4 h-4 text-[#00C2FF]" />
                      <span className="text-xs font-mono text-[#00C2FF]">End-to-End Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow effect around device */}
              <div className="absolute inset-0 rounded-[48px] opacity-30 blur-xl"
                   style={{ background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
