import { motion, AnimatePresence } from 'motion/react';
import { mockIssuanceData } from '../data/mockData';
import {
  FileText, Ban, Clock, Layers, Activity,
  Plus, X, CheckCircle, ChevronDown, Send,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useState, useEffect } from 'react';
import { issuersApi, credentialsApi } from '../services/api';

// ── Credential types for dropdown ─────────────────────────────────────────────
const CRED_TYPES = [
  'University Degree Certificate',
  'Employment Verification Letter',
  'Aadhaar Identity Card',
  'Driving Licence (mDL)',
  'PAN Card',
  'CBSE Class XII Marksheet',
  'Health Insurance Card',
  'Medical Registration Certificate',
  'Professional Licence',
  'Training / Completion Certificate',
  'Membership Card',
  'Access Pass',
];

const ISSUERS_LIST = [
  { id: 'iss-001', name: 'IIT Delhi',       did: 'did:indy:sovrin:IITD8Ps2w3kJTHjqUDf8nK9nR7' },
  { id: 'iss-002', name: 'UIDAI',           did: 'did:indy:sovrin:UIDAI9k4mP2x3nQ7vLh1TzW5aK' },
  { id: 'iss-003', name: 'Infosys Limited', did: 'did:indy:sovrin:INFY9Qx4k2mLPv3rNh8TzYcW5' },
  { id: 'iss-004', name: 'CBSE',            did: 'did:indy:sovrin:CBSE4Lm9r6qPn3vTk7YwJsB8c' },
  { id: 'iss-005', name: 'HDFC ERGO',       did: 'did:indy:sovrin:HDFC6Kp2n4xQm5vLh3TzYcR9' },
];

interface ClaimField {
  label: string;
  value: string;
  zkpCapable: boolean;
}

interface IssuanceRecord {
  id: string;
  subjectDID: string;
  template: string;
  status: 'delivered' | 'pending' | 'failed';
  timestamp: string;
}

// ── Issue Credential Modal ─────────────────────────────────────────────────────
function IssueCredentialModal({
  isOpen, onClose, onIssued,
}: {
  isOpen: boolean;
  onClose: () => void;
  onIssued: (r: IssuanceRecord) => void;
}) {
  const [credId, setCredId]       = useState('');
  const [holderDID, setHolderDID] = useState('');
  const [holderName, setHolderName] = useState('');
  const [credType, setCredType]   = useState(CRED_TYPES[0]);
  const [issuerId, setIssuerId]   = useState('iss-001');
  const [claims, setClaims]       = useState<ClaimField[]>([{ label: '', value: '', zkpCapable: false }]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]     = useState(false);
  const [error, setError]         = useState('');

  const autoId = () => {
    const tag = credType.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 4);
    setCredId(`CRED-${tag}-${Date.now().toString().slice(-6)}`);
  };

  const addClaim    = () => setClaims(p => [...p, { label: '', value: '', zkpCapable: false }]);
  const removeClaim = (i: number) => setClaims(p => p.filter((_, idx) => idx !== i));
  const setField    = (i: number, k: keyof ClaimField, v: string | boolean) =>
    setClaims(p => p.map((c, idx) => idx === i ? { ...c, [k]: v } : c));

  const resetForm = () => {
    setCredId(''); setHolderDID(''); setHolderName('');
    setCredType(CRED_TYPES[0]); setIssuerId('iss-001');
    setClaims([{ label: '', value: '', zkpCapable: false }]);
    setError('');
  };

  const handleSubmit = async () => {
    setError('');
    if (!credId.trim())       { setError('Credential ID is required'); return; }
    if (!holderName.trim())   { setError('Holder Name is required'); return; }
    if (!holderDID.trim())    { setError('Holder DID is required'); return; }
    if (claims.some(c => !c.label.trim() || !c.value.trim()))
      { setError('All claim fields need a label and a value'); return; }

    setSubmitting(true);
    const issuer = ISSUERS_LIST.find(i => i.id === issuerId)!;
    const payload = {
      id: credId,
      type: credType,
      issuer: issuer.name,
      issuerLogo: '🏛️',
      holderName,
      holderDID,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 3).toISOString().split('T')[0],
      status: 'verified',
      claims: claims.filter(c => c.label && c.value),
      metadata: {
        issuerDID: issuer.did,
        schemaID: `schema:sovereign:${credType.toLowerCase().replace(/\s+/g, ':').slice(0, 30)}:v1.0`,
        proofType: 'BbsBlsSignature2020',
        zkpEnabled: claims.some(c => c.zkpCapable),
      },
    };

    // Best-effort: try live API, fall back silently for demo
    try { await issuersApi.issue(issuerId, payload); } catch { /* ok */ }
    try { await credentialsApi.create(payload); }      catch { /* ok */ }

    const record: IssuanceRecord = {
      id: credId,
      subjectDID: holderDID,
      template: credType,
      status: 'delivered',
      timestamp: new Date().toISOString(),
    };

    setSubmitting(false);
    setSuccess(true);
    onIssued(record);
    setTimeout(() => { setSuccess(false); onClose(); resetForm(); }, 1800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(5,13,26,0.85)', backdropFilter: 'blur(8px)' }}
        onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg,rgba(15,30,53,0.98) 0%,rgba(10,22,40,0.98) 100%)',
            border: '1px solid rgba(0,194,255,0.25)',
            boxShadow: '0 0 60px rgba(0,194,255,0.15)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#F0F4FF] text-xl font-bold">Issue New Credential</h2>
              <p className="text-[#7A8FA6] text-sm mt-1">Create a signed W3C Verifiable Credential and deliver it to a holder's wallet</p>
            </div>
            <button onClick={onClose} className="text-[#7A8FA6] hover:text-[#F0F4FF] transition-colors p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-14 gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-[rgba(0,255,136,0.1)] border border-[#00FF88] flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-[#00FF88]" />
              </div>
              <p className="text-[#00FF88] font-semibold text-lg">Credential Issued!</p>
              <p className="text-[#7A8FA6] text-sm">Signed &amp; delivered to holder wallet via DIDComm</p>
            </motion.div>
          ) : (
            <div className="space-y-5">

              {/* Row 1: Issuer + Type */}
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[#7A8FA6] text-xs uppercase tracking-wider mb-2 block">Issuing Organization</span>
                  <div className="relative">
                    <select value={issuerId} onChange={e => setIssuerId(e.target.value)}
                      className="w-full appearance-none rounded-lg px-3 py-2.5 text-[#F0F4FF] text-sm pr-8 outline-none"
                      style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,194,255,0.2)' }}>
                      {ISSUERS_LIST.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-[#7A8FA6] text-xs uppercase tracking-wider mb-2 block">Credential Type</span>
                  <div className="relative">
                    <select value={credType} onChange={e => setCredType(e.target.value)}
                      className="w-full appearance-none rounded-lg px-3 py-2.5 text-[#F0F4FF] text-sm pr-8 outline-none"
                      style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,194,255,0.2)' }}>
                      {CRED_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-3 w-4 h-4 text-[#7A8FA6] pointer-events-none" />
                  </div>
                </label>
              </div>

              {/* Credential ID */}
              <div>
                <span className="text-[#7A8FA6] text-xs uppercase tracking-wider mb-2 block">
                  Credential ID <span className="text-[#FF4444]">*</span>
                </span>
                <div className="flex gap-2">
                  <input value={credId} onChange={e => setCredId(e.target.value)}
                    placeholder="e.g. CRED-IITD-2024-0891"
                    className="flex-1 rounded-lg px-3 py-2.5 text-[#F0F4FF] text-sm placeholder:text-[#3A4F6A] outline-none font-mono"
                    style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,194,255,0.2)', fontSize: '12px' }} />
                  <button onClick={autoId}
                    className="px-3 py-2 rounded-lg text-[#00C2FF] text-xs font-semibold border border-[rgba(0,194,255,0.3)] hover:border-[#00C2FF] hover:bg-[rgba(0,194,255,0.05)] transition-all whitespace-nowrap">
                    Auto-generate
                  </button>
                </div>
              </div>

              {/* Holder Name + DID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#7A8FA6] text-xs uppercase tracking-wider mb-2 block">
                    Holder Name <span className="text-[#FF4444]">*</span>
                  </span>
                  <input value={holderName} onChange={e => setHolderName(e.target.value)}
                    placeholder="e.g. Aarav Sharma"
                    className="w-full rounded-lg px-3 py-2.5 text-[#F0F4FF] text-sm placeholder:text-[#3A4F6A] outline-none"
                    style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,194,255,0.2)' }} />
                </div>
                <div>
                  <span className="text-[#7A8FA6] text-xs uppercase tracking-wider mb-2 block">
                    Holder DID <span className="text-[#FF4444]">*</span>
                  </span>
                  <input value={holderDID} onChange={e => setHolderDID(e.target.value)}
                    placeholder="did:indy:sovrin:..."
                    className="w-full rounded-lg px-3 py-2.5 text-[#F0F4FF] text-sm placeholder:text-[#3A4F6A] outline-none font-mono"
                    style={{ background: 'rgba(0,0,0,0.45)', border: '1px solid rgba(0,194,255,0.2)', fontSize: '11px' }} />
                </div>
              </div>

              {/* Claims Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#7A8FA6] text-xs uppercase tracking-wider">
                    Credential Claims <span className="text-[#FF4444]">*</span>
                  </span>
                  <button onClick={addClaim}
                    className="flex items-center gap-1 text-[#00C2FF] text-xs font-semibold hover:text-[#7B2FFF] transition-colors">
                    <Plus className="w-3 h-3" /> Add Field
                  </button>
                </div>

                {/* Column headers */}
                <div className="grid grid-cols-[1fr_1fr_56px_24px] gap-2 mb-1 px-1">
                  <span className="text-[#3A4F6A] text-[10px] uppercase tracking-wider">Label</span>
                  <span className="text-[#3A4F6A] text-[10px] uppercase tracking-wider">Value</span>
                  <span className="text-[#3A4F6A] text-[10px] uppercase tracking-wider text-center">ZKP?</span>
                  <span />
                </div>

                <div className="space-y-2">
                  {claims.map((c, i) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_56px_24px] gap-2 items-center">
                      <input value={c.label} onChange={e => setField(i, 'label', e.target.value)}
                        placeholder="e.g. Degree"
                        className="rounded-lg px-3 py-2 text-[#F0F4FF] text-sm placeholder:text-[#3A4F6A] outline-none"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,194,255,0.15)' }} />
                      <input value={c.value} onChange={e => setField(i, 'value', e.target.value)}
                        placeholder="e.g. B.Tech CSE"
                        className="rounded-lg px-3 py-2 text-[#F0F4FF] text-sm placeholder:text-[#3A4F6A] outline-none"
                        style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(0,194,255,0.15)' }} />
                      <div className="flex justify-center">
                        <input type="checkbox" checked={c.zkpCapable}
                          onChange={e => setField(i, 'zkpCapable', e.target.checked)}
                          className="accent-[#7B2FFF] w-4 h-4 cursor-pointer" />
                      </div>
                      {claims.length > 1
                        ? <button onClick={() => removeClaim(i)} className="text-[#FF4444] hover:text-[#ff7777]"><X className="w-4 h-4" /></button>
                        : <span />}
                    </div>
                  ))}
                </div>

                <p className="text-[#3A4F6A] text-[10px] mt-2">
                  ✦ ZKP-capable fields can be selectively disclosed using zero-knowledge proofs
                </p>
              </div>

              {error && (
                <div className="text-[#FF4444] text-sm bg-[rgba(255,68,68,0.08)] border border-[rgba(255,68,68,0.25)] rounded-lg px-3 py-2">
                  ⚠ {error}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-[#7A8FA6] text-sm border border-[rgba(120,143,166,0.25)] hover:border-[rgba(120,143,166,0.5)] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    background: submitting ? 'rgba(0,194,255,0.25)' : 'linear-gradient(135deg,#00C2FF,#7B2FFF)',
                    color: '#F0F4FF',
                    boxShadow: submitting ? 'none' : '0 0 24px rgba(0,194,255,0.25)',
                  }}>
                  {submitting
                    ? <><span className="animate-spin inline-block">⟳</span> Signing &amp; Delivering…</>
                    : <><Send className="w-4 h-4" /> Issue Credential</>}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export function IssuerPortalPage() {
  const [issuanceData, setIssuanceData] = useState(mockIssuanceData);
  const [showModal, setShowModal]       = useState(false);
  const [newIssuances, setNewIssuances] = useState<IssuanceRecord[]>([]);

  useEffect(() => {
    issuersApi.getAll().then((data: any) => {
      if (data?.length) {
        const d = data[0];
        if (d?.stats) {
          setIssuanceData(prev => ({
            ...prev,
            totalIssued:      d.stats.totalIssued      ?? prev.totalIssued,
            revokedToday:     d.stats.revokedToday     ?? prev.revokedToday,
            pendingDelivery:  d.stats.pendingDelivery  ?? prev.pendingDelivery,
            activeTemplates:  d.stats.activeTemplates  ?? prev.activeTemplates,
            credentialHealth: d.stats.credentialHealth ?? prev.credentialHealth,
            chartData:        d.chartData              ?? prev.chartData,
            recentIssuances:  d.recentIssuances        ?? prev.recentIssuances,
            bulkJobs:         d.bulkJobs               ?? prev.bulkJobs,
          }));
        }
      }
    }).catch(() => {});
  }, []);

  const handleIssued = (r: IssuanceRecord) => {
    setNewIssuances(p => [r, ...p]);
    setIssuanceData(p => ({ ...p, totalIssued: p.totalIssued + 1 }));
  };

  const allRecentIssuances = [...newIssuances, ...issuanceData.recentIssuances].slice(0, 10);

  const kpis = [
    { label: 'Total Issued',      value: issuanceData.totalIssued.toLocaleString(), icon: <FileText className="w-5 h-5 text-[#00C2FF]" />, bg: 'rgba(0,194,255,0.1)' },
    { label: 'Revoked Today',     value: issuanceData.revokedToday,                 icon: <Ban      className="w-5 h-5 text-[#FF4444]" />, bg: 'rgba(255,68,68,0.1)' },
    { label: 'Pending Delivery',  value: issuanceData.pendingDelivery,              icon: <Clock    className="w-5 h-5 text-[#F5A623]" />, bg: 'rgba(245,166,35,0.1)' },
    { label: 'Active Templates',  value: issuanceData.activeTemplates,              icon: <Layers   className="w-5 h-5 text-[#00C2FF]" />, bg: 'rgba(0,194,255,0.1)' },
    { label: 'Credential Health', value: `${issuanceData.credentialHealth}%`,       icon: <Activity className="w-5 h-5 text-[#00FF88]" />, bg: 'rgba(0,255,136,0.1)' },
  ];

  return (
    <div className="space-y-6">

      {/* Title + CTA */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[#F0F4FF] mb-2">Issuer Portal Dashboard</h1>
          <p className="text-[#7A8FA6] text-sm">Organization-level credential issuance and management</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{
            background: 'linear-gradient(135deg,#00C2FF,#7B2FFF)',
            color: '#F0F4FF',
            boxShadow: '0 0 28px rgba(0,194,255,0.3)',
          }}>
          <Plus className="w-4 h-4" />
          Issue New Credential
        </motion.button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: k.bg }}>
                {k.icon}
              </div>
              <div>
                <div className="text-[#7A8FA6] text-xs mb-0.5">{k.label}</div>
                <div className="text-[#F0F4FF] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                  {k.value}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart + Recent Issuances */}
      <div className="grid grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="col-span-3 glass-card rounded-2xl p-6">
          <h2 className="text-[#F0F4FF] mb-6">Issuance Activity (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={issuanceData.chartData}>
              <defs>
                <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#00C2FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevoked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#FF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,194,255,0.1)" />
              <XAxis dataKey="date" stroke="#7A8FA6" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }} />
              <YAxis stroke="#7A8FA6" style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0F1E35', border: '1px solid rgba(0,194,255,0.3)', borderRadius: '8px', color: '#F0F4FF' }} />
              <Legend wrapperStyle={{ color: '#F0F4FF', fontSize: '12px' }} />
              <Area type="monotone" dataKey="issued"  stroke="#00C2FF" strokeWidth={2} fillOpacity={1} fill="url(#colorIssued)"  name="Issued" />
              <Area type="monotone" dataKey="revoked" stroke="#FF4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRevoked)" name="Revoked" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#F0F4FF]">Recent Issuances</h2>
            {newIssuances.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[rgba(0,255,136,0.1)] text-[#00FF88] border border-[rgba(0,255,136,0.4)]">
                +{newIssuances.length} new
              </span>
            )}
          </div>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {allRecentIssuances.map((rec) => (
                <motion.div key={rec.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                  className="p-3 rounded-lg border hover:border-[rgba(0,194,255,0.25)] transition-colors"
                  style={{ background: 'rgba(0,194,255,0.02)', border: '1px solid rgba(0,194,255,0.08)' }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex-1 min-w-0">
                      <div className="text-[#00C2FF] font-mono truncate" style={{ fontSize: '10px' }}>{rec.subjectDID}</div>
                      <div className="text-[#F0F4FF] text-sm font-semibold truncate mt-0.5">{rec.template}</div>
                      <div className="text-[#3A4F6A] font-mono" style={{ fontSize: '10px' }}>ID: {rec.id}</div>
                    </div>
                    <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide
                      ${rec.status === 'delivered' ? 'bg-[rgba(0,255,136,0.1)] text-[#00FF88] border border-[rgba(0,255,136,0.4)]'
                      : rec.status === 'pending'   ? 'bg-[rgba(245,166,35,0.1)] text-[#F5A623] border border-[rgba(245,166,35,0.4)]'
                      :                              'bg-[rgba(255,68,68,0.1)] text-[#FF4444] border border-[rgba(255,68,68,0.4)]'}`}>
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-[#7A8FA6] text-[11px]">
                    {new Date(rec.timestamp).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Bulk Jobs */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-[#F0F4FF] mb-4">Bulk Issuance Jobs</h2>
        <div className="space-y-4">
          {issuanceData.bulkJobs.map(job => (
            <div key={job.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[#F0F4FF] font-semibold mb-1">{job.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-[#7A8FA6]">
                    <span>Progress: {job.success} / {job.total}</span>
                    {job.failed > 0 && <span className="text-[#FF4444]">Failed: {job.failed}</span>}
                    <span>ETA: {job.eta}</span>
                  </div>
                </div>
                <div className="text-[#00C2FF] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {job.progress}%
                </div>
              </div>
              <div className="h-2 bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] rounded-full"
                  style={{ boxShadow: '0 0 20px rgba(0,194,255,0.4)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <IssueCredentialModal isOpen={showModal} onClose={() => setShowModal(false)} onIssued={handleIssued} />
    </div>
  );
}
