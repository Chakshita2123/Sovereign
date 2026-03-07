import { motion } from 'motion/react';
import { Shield, Award } from 'lucide-react';

export function TrustSecuritySection() {
  const badges = [
    { name: 'GDPR', subtitle: 'Compliant' },
    { name: 'eIDAS', subtitle: 'Certified' },
    { name: 'ISO 27001', subtitle: 'Certified' },
    { name: 'W3C DID', subtitle: 'Standard' },
    { name: 'SOC 2', subtitle: 'Type II' }
  ];

  const partners = [
    'European Commission', 'MIT Digital Currency', 'Hyperledger',
    'W3C', 'DIF', 'OpenID Foundation', 'Linux Foundation'
  ];

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#030912]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="font-mono text-[#00C2FF] text-sm tracking-[0.2em] uppercase">
            TRUST & SECURITY
          </span>
          <h2 className="mt-4 text-5xl font-bold">Enterprise-Grade Protection</h2>
        </div>

        {/* Centered security shield with orbiting badges */}
        <div className="relative max-w-4xl mx-auto h-[500px] flex items-center justify-center mb-20">
          {/* Central shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            <SecurityShieldSVG />
          </motion.div>

          {/* Orbiting compliance badges */}
          {badges.map((badge, i) => {
            const angle = (i / badges.length) * 2 * Math.PI;
            const radius = 220;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                animate={{
                  rotate: 360
                }}
                transition={{
                  rotate: { duration: 40, repeat: Infinity, ease: "linear" }
                }}
                className="absolute"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <motion.div
                  animate={{
                    rotate: -360
                  }}
                  transition={{
                    rotate: { duration: 40, repeat: Infinity, ease: "linear" }
                  }}
                  className="p-4 rounded-xl backdrop-blur-xl"
                  style={{
                    background: 'rgba(10, 22, 40, 0.9)',
                    border: '1px solid rgba(0, 194, 255, 0.3)',
                    boxShadow: '0 0 30px rgba(0, 194, 255, 0.1)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#00C2FF]" />
                    <div>
                      <div className="font-mono text-sm font-semibold">{badge.name}</div>
                      <div className="text-xs text-[#7A8FA6]">{badge.subtitle}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* Orbital ring */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[440px] h-[440px] rounded-full border border-dashed border-[rgba(0,194,255,0.15)]" />
          </motion.div>
        </div>

        {/* Scrolling partner logos */}
        <div className="relative overflow-hidden">
          <div className="text-center mb-8">
            <span className="text-sm text-[#7A8FA6]">Trusted by leading organizations</span>
          </div>
          
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#030912] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#030912] to-transparent z-10" />
            
            {/* Scrolling container */}
            <motion.div
              animate={{ x: [0, -1400] }}
              transition={{ 
                x: { duration: 30, repeat: Infinity, ease: "linear" }
              }}
              className="flex gap-12"
            >
              {[...partners, ...partners].map((partner, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 px-8 py-4 rounded-lg"
                  style={{
                    background: 'rgba(15, 30, 53, 0.4)',
                    border: '1px solid rgba(0, 194, 255, 0.1)'
                  }}
                >
                  <span className="text-sm text-[#7A8FA6] whitespace-nowrap font-medium">
                    {partner}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SecurityShieldSVG() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main shield outline */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        d="M100 20 L160 50 L160 110 C160 150 130 175 100 180 C70 175 40 150 40 110 L40 50 Z"
        stroke="url(#shieldGradient)"
        strokeWidth="2"
        fill="rgba(0, 194, 255, 0.03)"
      />

      {/* Inner layers */}
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
        d="M100 40 L145 60 L145 105 C145 135 120 155 100 160 C80 155 55 135 55 105 L55 60 Z"
        stroke="#7B2FFF"
        strokeWidth="1.5"
        fill="rgba(123, 47, 255, 0.05)"
      />

      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
        d="M100 60 L130 75 L130 100 C130 120 110 135 100 140 C90 135 70 120 70 100 L70 75 Z"
        stroke="#00FF88"
        strokeWidth="1"
        fill="rgba(0, 255, 136, 0.05)"
      />

      {/* Center lock icon */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <rect x="90" y="95" width="20" height="25" rx="3" fill="#00C2FF" opacity="0.8" />
        <path d="M95 95 L95 85 C95 80 100 75 105 75 C110 75 115 80 115 85 L115 95" 
              stroke="#00C2FF" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="100" cy="107" r="3" fill="#050D1A" />
      </motion.g>

      {/* Glow effects */}
      <defs>
        <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00C2FF" />
          <stop offset="100%" stopColor="#7B2FFF" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Animated particles */}
      {[...Array(8)].map((_, i) => (
        <motion.circle
          key={i}
          cx={100 + Math.cos(i * Math.PI / 4) * 70}
          cy={100 + Math.sin(i * Math.PI / 4) * 70}
          r="2"
          fill="#00C2FF"
          opacity="0.6"
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </svg>
  );
}
