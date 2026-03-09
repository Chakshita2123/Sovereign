import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  const [didGeneration, setDidGeneration] = useState('');
  const fullDID = 'did:vault:z6MkhaXgW2jK8yP5x3k9L2mN4vB7qR8sT1uC3dE5fG7hI9j';

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullDID.length) {
        setDidGeneration(fullDID.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[#050D1A]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left panel - pitch black */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-16 flex flex-col justify-center"
              style={{
                background: '#000000',
                borderRight: '1px solid rgba(0, 194, 255, 0.2)'
              }}
            >
              <div className="space-y-8">
                <div>
                  <h2 className="text-[64px] font-bold leading-[0.95] mb-6"
                      style={{ fontFamily: 'var(--font-display)' }}>
                    Your Identity,
                    <br />
                    <span className="bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] bg-clip-text text-transparent">
                      Your Rules
                    </span>
                  </h2>
                  <p className="text-xl text-[#7A8FA6] leading-relaxed">
                    Take control of your digital identity. No centralized databases. No data breaches. Just you.
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center gap-3 py-4 px-8 rounded-lg font-semibold text-lg relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)',
                    color: 'white'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 194, 255, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 0 0px rgba(0, 194, 255, 0)';
                  }}
                >
                  Create Your Vault
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <div className="pt-8 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#7A8FA6]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                    <span>Free forever for personal use</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7A8FA6]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7A8FA6]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
                    <span>Enterprise plans available</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right panel - DID generation animation */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-16 flex flex-col justify-center"
              style={{
                background: 'rgba(10, 22, 40, 0.8)',
                backdropFilter: 'blur(20px)'
              }}
            >
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-mono text-[#00C2FF] mb-4 tracking-wider">
                    GENERATING YOUR IDENTITY...
                  </div>
                  
                  {/* Terminal-style output */}
                  <div className="p-6 rounded-lg"
                       style={{
                         background: 'rgba(5, 13, 26, 0.9)',
                         border: '1px solid rgba(0, 194, 255, 0.2)',
                         fontFamily: 'var(--font-mono)'
                       }}>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-[#00FF88]">✓</span>
                        <span className="text-[#7A8FA6]">Generating keypair...</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#00FF88]">✓</span>
                        <span className="text-[#7A8FA6]">Creating DID document...</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[#00FF88]">✓</span>
                        <span className="text-[#7A8FA6]">Publishing to ledger...</span>
                      </div>
                      
                      <div className="pt-4 border-t border-[rgba(0,194,255,0.1)]">
                        <div className="text-xs text-[#7A8FA6] mb-2">Your Decentralized Identifier:</div>
                        <div className="p-3 rounded bg-[rgba(0,194,255,0.05)] border-l-4 border-[#00C2FF]">
                          <div className="text-[#00C2FF] break-all leading-relaxed">
                            {didGeneration}
                            <motion.span
                              animate={{ opacity: [1, 0, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="inline-block w-2 h-4 bg-[#00C2FF] ml-1"
                            />
                          </div>
                        </div>
                      </div>

                      {didGeneration === fullDID && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="pt-4"
                        >
                          <div className="flex items-center gap-2 text-[#00FF88]">
                            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                            <span className="text-sm">Identity created successfully</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-[rgba(0,194,255,0.05)] border border-[rgba(0,194,255,0.2)]">
                  <div className="text-xs text-[#7A8FA6] leading-relaxed">
                    Your DID is cryptographically secure, globally unique, and completely under your control. 
                    No central authority can revoke or modify it.
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
