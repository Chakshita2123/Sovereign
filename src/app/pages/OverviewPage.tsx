import { motion } from 'motion/react';
import { KPIStatPod } from '../components/credentials/KPIStatPod';
import { SecurityScoreRing } from '../components/credentials/SecurityScoreRing';
import { CredentialCard } from '../components/credentials/CredentialCard';
import { ActivityFeedItem } from '../components/credentials/ActivityFeedItem';
import { ProofRequestCard } from '../components/credentials/ProofRequestCard';
import { mockCredentials, mockActivities, mockProofRequests, mockKPIData } from '../data/mockData';
import { Vault, CheckCircle, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import { ShareCredentialModal } from '../components/modals/ShareCredentialModal';

export function OverviewPage() {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState(mockCredentials[0]);

  const recentCredentials = mockCredentials.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-[#F0F4FF] mb-2">Dashboard Overview</h1>
        <p className="text-[#7A8FA6] text-sm">
          Welcome back, Alex. Here's what's happening with your digital identity.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <KPIStatPod
          label="Total Credentials"
          value={mockKPIData.totalCredentials}
          trend={mockKPIData.totalCredentialsTrend}
          sparklineData={[8, 10, 9, 11, 12]}
          icon={<Vault className="w-6 h-6" />}
        />
        <KPIStatPod
          label="Active Verifications Today"
          value={mockKPIData.activeVerifications}
          trend={mockKPIData.activeVerificationsTrend}
          sparklineData={[18, 20, 19, 22, 23]}
          icon={<CheckCircle className="w-6 h-6" />}
        />
        <KPIStatPod
          label="Credentials Expiring Soon"
          value={mockKPIData.credentialsExpiring}
          trend={mockKPIData.credentialsExpiringTrend}
          icon={<AlertCircle className="w-6 h-6" />}
        />
        <div className="glass-card glass-card-hover rounded-2xl p-5 flex items-center justify-center">
          <SecurityScoreRing score={mockKPIData.securityScore} size="small" />
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

        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="text-[#F0F4FF] mb-4">Recent Activity</h2>
          <div className="space-y-0 max-h-[400px] overflow-y-auto pr-2">
            {mockActivities.slice(0, 8).map((activity, idx) => (
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
          {mockProofRequests.map((request) => (
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
