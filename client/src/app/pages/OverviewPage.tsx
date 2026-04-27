/**
 * OverviewPage.tsx — Dashboard Overview
 * Lectures 45-48: Live activity feed updates via Socket.io
 * 
 * This page now subscribes to Socket.io events and prepends new activities
 * to the feed in real-time. When a credential is issued or a proof is approved
 * anywhere in the system, the activity feed updates instantly — no polling.
 */

import { motion } from 'motion/react';
import { KPIStatPod } from '../components/credentials/KPIStatPod';
import { SecurityScoreRing } from '../components/credentials/SecurityScoreRing';
import { CredentialCard } from '../components/credentials/CredentialCard';
import { ActivityFeedItem } from '../components/credentials/ActivityFeedItem';
import { ProofRequestCard } from '../components/credentials/ProofRequestCard';
import {
  mockKPIData,
  type Credential, type Activity, type ProofRequest,
} from '../data/mockData';
import { Vault, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { ShareCredentialModal } from '../components/modals/ShareCredentialModal';
import { dashboardApi, credentialsApi } from '../services/api';
import { useSocket } from '../hooks/useSocket';

const emptyKpi = { ...mockKPIData, totalCredentials: 0, activeVerifications: 0, credentialsExpiring: 0, securityScore: 0 };

export function OverviewPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [proofRequests, setProofRequests] = useState<ProofRequest[]>([]);
  const [kpiData, setKpiData] = useState(emptyKpi);
  const [loading, setLoading] = useState(true);

  // ── Socket.io: Subscribe to live events (Lectures 45-48) ────────────────────
  const { onEvent, isConnected } = useSocket();

  useEffect(() => {
    async function loadData() {
      try {
        const [dashboard, creds] = await Promise.all([
          dashboardApi.get(),
          credentialsApi.getAll(),
        ]);
        if (dashboard) {
          setActivities(dashboard.recentActivities || []);
          setProofRequests(dashboard.pendingProofRequests || []);
          setKpiData({ ...emptyKpi, ...dashboard.kpi });
        }
        if (creds?.length) setCredentials(creds);
        if (creds?.length) setSelectedCredential(creds[0]);
      } catch {
        // Backend not running — start with empty state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // ── Socket.io: Live credential issued events ─────────────────────────────────
  useEffect(() => {
    const cleanup = onEvent('credential:issued', (data: unknown) => {
      const { credential, timestamp } = data as { credential: Credential; timestamp: string };
      // Prepend new credential to the list
      if (credential) {
        setCredentials(prev => [credential, ...prev]);
        // Update KPI count
        setKpiData(prev => ({
          ...prev,
          totalCredentials: prev.totalCredentials + 1,
        }));
      }
      // Add to activity feed
      setActivities(prev => [{
        id: `live-${Date.now()}`,
        type: 'credential_issued',
        title: `New credential: ${credential?.type || 'Unknown'}`,
        description: `Issued by ${credential?.issuer || 'Unknown'}`,
        timestamp: timestamp || new Date().toISOString(),
        actor: credential?.issuer || 'System',
        icon: '🔐',
      } as Activity, ...prev]);
    });
    return cleanup;
  }, [onEvent]);

  // ── Socket.io: Live proof approved events ────────────────────────────────────
  useEffect(() => {
    const cleanup = onEvent('proof:approved', (data: unknown) => {
      const { proofId, timestamp } = data as { proofId: string; timestamp: string };
      // Remove approved request from pending list
      setProofRequests(prev => prev.filter(r => r.id !== proofId));
      // Add to activity feed
      setActivities(prev => [{
        id: `live-${Date.now()}`,
        type: 'proof_approved',
        title: 'Proof request approved',
        description: `Proof ${proofId || ''} was verified`,
        timestamp: timestamp || new Date().toISOString(),
        actor: 'System',
        icon: '✅',
      } as Activity, ...prev]);
    });
    return cleanup;
  }, [onEvent]);

  // ── Socket.io: General activity broadcast ────────────────────────────────────
  useEffect(() => {
    const cleanup = onEvent('activity:new', (data: unknown) => {
      const { activity } = data as { activity: Activity };
      if (activity) {
        setActivities(prev => [{
          ...activity,
          id: activity.id || `live-${Date.now()}`,
        }, ...prev]);
      }
    });
    return cleanup;
  }, [onEvent]);

  const recentCredentials = credentials.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#F0F4FF] mb-2">Dashboard Overview</h1>
          <p className="text-[#7A8FA6] text-sm">
            Welcome back, Alex. Here's what's happening with your digital identity.
          </p>
        </div>
        {/* Socket.io connection indicator */}
        {isConnected && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[rgba(0,255,136,0.06)] border border-[rgba(0,255,136,0.15)]"
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-[#00FF88]"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs text-[#00FF88] font-medium">Live</span>
          </motion.div>
        )}
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPIStatPod
          label="Total Credentials"
          value={kpiData.totalCredentials}
          trend={kpiData.totalCredentialsTrend}
          sparklineData={[8, 10, 9, 11, 12]}
          icon={<Vault className="w-6 h-6" />}
        />
        <KPIStatPod
          label="Active Verifications Today"
          value={kpiData.activeVerifications}
          trend={kpiData.activeVerificationsTrend}
          sparklineData={[18, 20, 19, 22, 23]}
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <KPIStatPod
          label="Credentials Expiring Soon"
          value={kpiData.credentialsExpiring}
          trend={kpiData.credentialsExpiringTrend}
          icon={<AlertCircle className="w-6 h-6" />}
        />
        <div className="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-center">
          <SecurityScoreRing score={kpiData.securityScore} size="small" />
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Credential Vault Preview - spans 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#F0F4FF]">Recent Credentials</h2>
            <Link
              to="/dashboard/vault"
              className="flex items-center gap-1 text-[#00C2FF] text-sm hover:gap-2 transition-all"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-0">
            {recentCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                size="medium"
                onClick={() => {
                  setSelectedCredential(credential);
                  setShareModalOpen(true);
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Recent Activity Feed — now updates live via Socket.io */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#F0F4FF]">Recent Activity</h2>
            {isConnected && (
              <span className="text-[10px] text-[#00FF88] uppercase tracking-wider font-medium">
                ● Live
              </span>
            )}
          </div>
          <div className="space-y-0 max-h-[400px] overflow-y-auto pr-2">
            {activities.slice(0, 8).map((activity, idx) => (
              <ActivityFeedItem
                key={activity.id}
                activity={activity}
                isLast={idx === 7}
              />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />
        </motion.div>
      </div>

      {/* Verification Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-[#F0F4FF] mb-4">Pending Verification Requests</h2>
        <div className="grid grid-cols-1 gap-4">
          {proofRequests.map((request) => (
            <ProofRequestCard
              key={request.id}
              request={request}
              onApprove={() => alert('Approved: ' + request.verifierName)}
              onDeny={() => alert('Denied: ' + request.verifierName)}
            />
          ))}
        </div>
      </motion.div>

      {/* Share Modal */}
      <ShareCredentialModal
        credential={selectedCredential}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
    </div>
  );
}
