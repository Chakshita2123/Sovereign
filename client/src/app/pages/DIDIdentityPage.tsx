import { motion } from 'motion/react';
import { DIDDisplay } from '../components/credentials/DIDDisplay';
import { SecurityScoreRing } from '../components/credentials/SecurityScoreRing';
import { userDID, mockKPIData } from '../data/mockData';
import { QrCode, Key, Clock, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function DIDIdentityPage() {
  const [expandedDID, setExpandedDID] = useState(false);

  const verificationMethods = [
    {
      id: 'key-1',
      type: 'Ed25519VerificationKey2020',
      controller: userDID,
      publicKey: '8PqN3mR4vT2wX5yZ9aB7cD1eF',
      created: '2023-06-15',
    },
    {
      id: 'key-2',
      type: 'EcdsaSecp256k1VerificationKey2019',
      controller: userDID,
      publicKey: '3Lm7nP9qR2sT4vW6xY8zA1bC',
      created: '2024-01-10',
    },
  ];

  const keyHistory = [
    {
      action: 'Key Rotation',
      keyType: 'Ed25519',
      date: '2024-03-03T16:30:00Z',
      status: 'completed',
    },
    {
      action: 'Key Added',
      keyType: 'EcdsaSecp256k1',
      date: '2024-01-10T10:15:00Z',
      status: 'completed',
    },
    {
      action: 'DID Created',
      keyType: 'Ed25519',
      date: '2023-06-15T14:20:00Z',
      status: 'completed',
    },
  ];

  const didDocument = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    id: userDID,
    verificationMethod: verificationMethods,
    authentication: ["key-1"],
    assertionMethod: ["key-1", "key-2"],
    created: "2023-06-15T14:20:00Z",
    updated: "2024-03-03T16:30:00Z",
  };

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-[#F0F4FF] mb-2">Decentralized Identity</h1>
        <p className="text-[#7A8FA6] text-sm">
          Your self-sovereign digital identity on the blockchain
        </p>
      </div>

      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-8"
      >
        <div className="flex items-start gap-8">
          {/* Left: Avatar and DID */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-6">
              {/* Avatar with verification ring */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#7B2FFF] flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">AC</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#00FF88] rounded-full border-4 border-[#0A1628] flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-[#F0F4FF] text-2xl font-bold">Alex Chen</h2>
                  <div className="px-3 py-1 rounded-full bg-[rgba(0,255,136,0.08)] border border-[#00FF88] text-[#00FF88] text-xs font-semibold">
                    VERIFIED IDENTITY
                  </div>
                </div>
                <p className="text-[#7A8FA6] text-sm mb-4">Identity Owner since June 2023</p>
                
                {/* DID Display */}
                <DIDDisplay did={userDID} className="mb-3" />
              </div>
            </div>

            {/* QR Code */}
            <div className="flex items-center gap-4 p-4 bg-[rgba(0,194,255,0.04)] border border-[rgba(0,194,255,0.12)] rounded-xl">
              <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center">
                <QrCode className="w-20 h-20 text-[#0A1628]" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#F0F4FF] font-semibold mb-1">DID Document QR Code</h3>
                <p className="text-[#7A8FA6] text-xs">
                  Scannable by other wallets to verify your identity
                </p>
              </div>
            </div>
          </div>

          {/* Right: Security Score */}
          <div className="flex flex-col items-center justify-center p-6 bg-[rgba(0,194,255,0.02)] rounded-xl border border-[rgba(0,194,255,0.08)]">
            <SecurityScoreRing score={mockKPIData.securityScore} size="large" />
            <div className="mt-4 text-center">
              <p className="text-[#7A8FA6] text-xs mb-2">Last Updated</p>
              <p className="text-[#F0F4FF] text-sm">March 7, 2024</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Three panels */}
      <div className="grid grid-cols-3 gap-6">
        {/* DID Document */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-[#00C2FF]" />
            <h3 className="text-[#F0F4FF] font-semibold">DID Document</h3>
          </div>
          <div className="bg-[rgba(0,0,0,0.3)] rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <pre className="text-xs leading-relaxed" style={{ fontFamily: 'var(--font-mono)' }}>
              <code>
                {JSON.stringify(didDocument, null, 2)
                  .split('\n')
                  .map((line, idx) => {
                    const keyMatch = line.match(/"([^"]+)":/);
                    if (keyMatch) {
                      return (
                        <div key={idx}>
                          <span className="text-[#00C2FF]">{line.split(':')[0]}:</span>
                          <span className="text-[#00FF88]">{line.substring(line.indexOf(':') + 1)}</span>
                        </div>
                      );
                    }
                    return <div key={idx} className="text-[#F0F4FF]">{line}</div>;
                  })}
              </code>
            </pre>
          </div>
        </motion.div>

        {/* Verification Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-[#00C2FF]" />
            <h3 className="text-[#F0F4FF] font-semibold">Verification Methods</h3>
          </div>
          <div className="space-y-3">
            {verificationMethods.map((method) => (
              <div
                key={method.id}
                className="p-4 bg-[rgba(0,194,255,0.04)] border border-[rgba(0,194,255,0.12)] rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#F0F4FF] text-sm font-semibold">{method.id}</span>
                  <div className="w-2 h-2 rounded-full bg-[#00FF88] pulse-dot" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="text-[#7A8FA6]">Type</div>
                  <div className="text-[#F0F4FF] mb-2">{method.type}</div>
                  <div className="text-[#7A8FA6]">Public Key</div>
                  <div className="did-text text-[#00C2FF] break-all">{method.publicKey}...</div>
                  <div className="text-[#7A8FA6] mt-2">
                    Created: {new Date(method.created).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
            <button className="w-full py-2.5 rounded-lg border border-[rgba(0,194,255,0.3)] text-[#00C2FF] text-sm font-semibold hover:bg-[rgba(0,194,255,0.04)] transition-colors">
              + Add Verification Method
            </button>
          </div>
        </motion.div>

        {/* Key History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-[#00C2FF]" />
            <h3 className="text-[#F0F4FF] font-semibold">Key History</h3>
          </div>
          <div className="space-y-4">
            {keyHistory.map((event, idx) => (
              <div key={idx} className="relative flex gap-3">
                <div className="relative flex flex-col items-center shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00C2FF] shrink-0" />
                  {idx < keyHistory.length - 1 && (
                    <div className="w-px flex-1 mt-1 bg-[rgba(0,194,255,0.2)]" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="text-[#F0F4FF] text-sm font-semibold mb-0.5">
                    {event.action}
                  </div>
                  <div className="text-[#7A8FA6] text-xs mb-1">
                    Key Type: {event.keyType}
                  </div>
                  <div className="did-text text-[11px] text-[#7A8FA6]">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
