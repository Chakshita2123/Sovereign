import { motion } from 'motion/react';
import { Shield, Fingerprint, Key, Smartphone, HardDrive, Wifi } from 'lucide-react';
import { useState } from 'react';

export function BentoFeatures() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0A1628 0%, #050D1A 100%)' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="font-mono text-[#00C2FF] text-sm tracking-[0.2em] uppercase">
            FEATURES
          </span>
          <h2 className="mt-4 text-5xl font-bold">Built for Security & Control</h2>
        </div>

        {/* Bento grid - asymmetric layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Large card - ZKP Visualizer (2 cols, 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              borderColor: 'rgba(0, 194, 255, 0.5)',
              boxShadow: '0 0 60px rgba(0, 194, 255, 0.15)'
            }}
            transition={{ duration: 0.3 }}
            className="md:col-span-2 md:row-span-2 p-8 rounded-2xl relative overflow-hidden group"
            style={{
              background: 'rgba(10, 22, 40, 0.8)',
              border: '1px solid rgba(0, 194, 255, 0.15)',
              boxShadow: '0 0 40px rgba(0, 194, 255, 0.06) inset',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{
                       background: 'rgba(0, 194, 255, 0.1)',
                       border: '1px solid rgba(0, 194, 255, 0.3)'
                     }}>
                  <Shield className="w-6 h-6 text-[#00C2FF]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Zero-Knowledge Proofs</h3>
                  <p className="text-sm text-[#7A8FA6]">Prove facts without revealing data</p>
                </div>
              </div>

              <ZKPAnimation />
            </div>

            {/* Hover glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                 style={{
                   background: 'radial-gradient(circle at 50% 50%, rgba(0, 194, 255, 0.05), transparent 70%)'
                 }} />
          </motion.div>

          {/* Medium card - DID Creation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              borderColor: 'rgba(0, 194, 255, 0.5)',
              boxShadow: '0 0 60px rgba(0, 194, 255, 0.15)'
            }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1 md:row-span-2 p-6 rounded-2xl group"
            style={{
              background: 'rgba(10, 22, 40, 0.8)',
              border: '1px solid rgba(0, 194, 255, 0.15)',
              boxShadow: '0 0 40px rgba(0, 194, 255, 0.06) inset',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                   style={{
                     background: 'rgba(123, 47, 255, 0.1)',
                     border: '1px solid rgba(123, 47, 255, 0.3)'
                   }}>
                <Fingerprint className="w-5 h-5 text-[#7B2FFF]" />
              </div>
              <div>
                <h3 className="text-xl font-bold">DID Creation</h3>
              </div>
            </div>

            <DIDCreationFlow />
          </motion.div>

          {/* Medium card - Credential Vault */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ 
              borderColor: 'rgba(0, 194, 255, 0.5)',
              boxShadow: '0 0 60px rgba(0, 194, 255, 0.15)'
            }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-1 md:row-span-2 p-6 rounded-2xl group"
            style={{
              background: 'rgba(10, 22, 40, 0.8)',
              border: '1px solid rgba(0, 194, 255, 0.15)',
              boxShadow: '0 0 40px rgba(0, 194, 255, 0.06) inset',
              backdropFilter: 'blur(12px)'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                   style={{
                     background: 'rgba(0, 255, 136, 0.1)',
                     border: '1px solid rgba(0, 255, 136, 0.3)'
                   }}>
                <Key className="w-5 h-5 text-[#00FF88]" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Credential Vault</h3>
              </div>
            </div>

            <CredentialVaultPreview />
          </motion.div>

          {/* Small cards row */}
          <SmallFeatureCard
            icon={HardDrive}
            title="Recovery"
            description="Social recovery with trusted contacts"
            color="#00C2FF"
          />

          <SmallFeatureCard
            icon={Wifi}
            title="Offline Mode"
            description="Access credentials without internet"
            color="#7B2FFF"
          />

          <SmallFeatureCard
            icon={Smartphone}
            title="Multi-Device Sync"
            description="Secure sync across all devices"
            color="#00FF88"
          />
        </div>
      </div>
    </section>
  );
}

function ZKPAnimation() {
  const [proving, setProving] = useState(false);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-[rgba(15,30,53,0.6)] border border-[rgba(0,194,255,0.1)]">
        <div className="text-xs text-[#7A8FA6] mb-2">Your secret data:</div>
        <div className="font-mono text-sm mb-4">birthdate: 1995-04-12</div>
        
        <div className="text-xs text-[#7A8FA6] mb-2">Prove you are over 21:</div>
        <div className="flex items-center gap-2">
          <motion.div
            className="flex-1 h-2 bg-[rgba(0,194,255,0.1)] rounded-full overflow-hidden"
            animate={proving ? { opacity: 1 } : { opacity: 0.5 }}
          >
            <motion.div
              className="h-full bg-[#00C2FF]"
              animate={proving ? { width: '100%' } : { width: '0%' }}
              transition={{ duration: 1.5 }}
            />
          </motion.div>
          <span className="font-mono text-xs text-[#00C2FF]">
            {proving ? 'Generating...' : 'Ready'}
          </span>
        </div>
      </div>

      <motion.button
        onClick={() => {
          setProving(true);
          setTimeout(() => setProving(false), 1500);
        }}
        disabled={proving}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-lg font-semibold text-sm disabled:opacity-50"
        style={{
          background: 'linear-gradient(135deg, #00C2FF, #7B2FFF)',
          color: 'white'
        }}
      >
        Generate Zero-Knowledge Proof
      </motion.button>

      {proving && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[rgba(0,255,136,0.05)] border border-[rgba(0,255,136,0.2)]"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-xs font-mono text-[#00FF88]">PROOF GENERATED</span>
          </div>
          <div className="font-mono text-xs text-[#7A8FA6] break-all">
            proof:0x7a9f...3e2d
          </div>
          <div className="text-xs text-[#00FF88] mt-2">
            ✓ Age verified (over 21) without revealing birthdate
          </div>
        </motion.div>
      )}
    </div>
  );
}

function DIDCreationFlow() {
  return (
    <div className="space-y-3">
      {[
        { step: '1', label: 'Generate keypair', done: true },
        { step: '2', label: 'Create DID document', done: true },
        { step: '3', label: 'Publish to ledger', done: false }
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg"
          style={{
            background: item.done ? 'rgba(0, 255, 136, 0.05)' : 'rgba(15, 30, 53, 0.6)',
            border: `1px solid ${item.done ? 'rgba(0, 255, 136, 0.2)' : 'rgba(0, 194, 255, 0.1)'}`
          }}
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono"
               style={{
                 background: item.done ? '#00FF88' : 'rgba(122, 143, 166, 0.2)',
                 color: item.done ? '#050D1A' : '#7A8FA6'
               }}>
            {item.done ? '✓' : item.step}
          </div>
          <span className="text-sm" style={{ color: item.done ? '#00FF88' : '#7A8FA6' }}>
            {item.label}
          </span>
        </motion.div>
      ))}

      <div className="mt-6 p-3 rounded-lg bg-[rgba(15,30,53,0.6)] border border-[rgba(0,194,255,0.1)]">
        <div className="text-xs text-[#7A8FA6] mb-1">Your DID:</div>
        <div className="font-mono text-xs text-[#00C2FF] break-all">
          did:vault:z6MkhaXgW...3dk2pE
        </div>
      </div>
    </div>
  );
}

function CredentialVaultPreview() {
  const credentials = [
    { name: 'Passport', status: 'active' },
    { name: 'License', status: 'active' },
    { name: 'Diploma', status: 'pending' }
  ];

  return (
    <div className="space-y-3">
      {credentials.map((cred, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-3 rounded-lg flex items-center justify-between"
          style={{
            background: 'rgba(15, 30, 53, 0.6)',
            border: `1px solid ${cred.status === 'active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(245, 166, 35, 0.2)'}`
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
              <Key className="w-4 h-4 text-[#00C2FF]" />
            </div>
            <div>
              <div className="text-sm font-medium">{cred.name}</div>
              <div className="text-xs text-[#7A8FA6] font-mono">vc:z6Mk...</div>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full"
               style={{ 
                 backgroundColor: cred.status === 'active' ? '#00FF88' : '#F5A623',
                 boxShadow: cred.status === 'active' 
                   ? '0 0 8px rgba(0, 255, 136, 0.5)' 
                   : '0 0 8px rgba(245, 166, 35, 0.5)'
               }} />
        </motion.div>
      ))}
    </div>
  );
}

function SmallFeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  color 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ 
        borderColor: `${color}80`,
        boxShadow: `0 0 40px ${color}20`
      }}
      transition={{ duration: 0.3 }}
      className="p-6 rounded-2xl group"
      style={{
        background: 'rgba(10, 22, 40, 0.8)',
        border: '1px solid rgba(0, 194, 255, 0.15)',
        boxShadow: '0 0 40px rgba(0, 194, 255, 0.06) inset',
        backdropFilter: 'blur(12px)'
      }}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
           style={{
             background: `${color}15`,
             border: `1px solid ${color}40`
           }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-[#7A8FA6]">{description}</p>
    </motion.div>
  );
}
