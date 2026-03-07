import { motion } from 'motion/react';
import { mockIssuanceData } from '../data/mockData';
import { FileText, Ban, Clock, Layers, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function IssuerPortalPage() {
  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-[#F0F4FF] mb-2">Issuer Portal Dashboard</h1>
        <p className="text-[#7A8FA6] text-sm">
          Organization-level credential issuance and management
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#00C2FF]" />
            </div>
            <div className="flex-1">
              <div className="text-[#7A8FA6] text-xs mb-1">Total Issued</div>
              <div className="text-[#F0F4FF] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {mockIssuanceData.totalIssued.toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[rgba(255,68,68,0.1)] flex items-center justify-center">
              <Ban className="w-5 h-5 text-[#FF4444]" />
            </div>
            <div className="flex-1">
              <div className="text-[#7A8FA6] text-xs mb-1">Revoked Today</div>
              <div className="text-[#F0F4FF] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {mockIssuanceData.revokedToday}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[rgba(245,166,35,0.1)] flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#F5A623]" />
            </div>
            <div className="flex-1">
              <div className="text-[#7A8FA6] text-xs mb-1">Pending Delivery</div>
              <div className="text-[#F0F4FF] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {mockIssuanceData.pendingDelivery}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#00C2FF]" />
            </div>
            <div className="flex-1">
              <div className="text-[#7A8FA6] text-xs mb-1">Active Templates</div>
              <div className="text-[#F0F4FF] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {mockIssuanceData.activeTemplates}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[rgba(0,255,136,0.1)] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#00FF88]" />
            </div>
            <div className="flex-1">
              <div className="text-[#7A8FA6] text-xs mb-1">Credential Health</div>
              <div className="text-[#F0F4FF] text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                {mockIssuanceData.credentialHealth}%
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two-panel layout */}
      <div className="grid grid-cols-5 gap-6">
        {/* Left: Activity Chart - 60% */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-3 glass-card rounded-2xl p-6"
        >
          <h2 className="text-[#F0F4FF] mb-6">Issuance Activity (30 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={mockIssuanceData.chartData}>
              <defs>
                <linearGradient id="colorIssued" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C2FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00C2FF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevoked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,194,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#7A8FA6" 
                style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
              />
              <YAxis 
                stroke="#7A8FA6" 
                style={{ fontSize: '12px', fontFamily: 'var(--font-mono)' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F1E35',
                  border: '1px solid rgba(0,194,255,0.3)',
                  borderRadius: '8px',
                  color: '#F0F4FF',
                }}
              />
              <Legend 
                wrapperStyle={{ color: '#F0F4FF', fontSize: '12px' }}
              />
              <Area
                type="monotone"
                dataKey="issued"
                stroke="#00C2FF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIssued)"
                name="Issued"
              />
              <Area
                type="monotone"
                dataKey="revoked"
                stroke="#FF4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorRevoked)"
                name="Revoked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Right: Recent Issuances Table - 40% */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-2 glass-card rounded-2xl p-6"
        >
          <h2 className="text-[#F0F4FF] mb-6">Recent Issuances</h2>
          <div className="space-y-3">
            {mockIssuanceData.recentIssuances.map((issuance) => (
              <div
                key={issuance.id}
                className="p-3 bg-[rgba(0,194,255,0.02)] border border-[rgba(0,194,255,0.08)] rounded-lg hover:border-[rgba(0,194,255,0.2)] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="did-text text-xs text-[#00C2FF] mb-1">
                      {issuance.subjectDID}
                    </div>
                    <div className="text-[#F0F4FF] text-sm font-semibold">
                      {issuance.template}
                    </div>
                  </div>
                  <div
                    className={`
                      px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide
                      ${issuance.status === 'delivered' 
                        ? 'bg-[rgba(0,255,136,0.1)] text-[#00FF88] border border-[#00FF88]'
                        : issuance.status === 'pending'
                        ? 'bg-[rgba(245,166,35,0.1)] text-[#F5A623] border border-[#F5A623]'
                        : 'bg-[rgba(255,68,68,0.1)] text-[#FF4444] border border-[#FF4444]'
                      }
                    `}
                  >
                    {issuance.status}
                  </div>
                </div>
                <div className="text-[#7A8FA6] text-xs did-text">
                  {new Date(issuance.timestamp).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bulk Issuance Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-[#F0F4FF] mb-4">Bulk Issuance Jobs</h2>
        <div className="space-y-4">
          {mockIssuanceData.bulkJobs.map((job) => (
            <div key={job.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-[#F0F4FF] font-semibold mb-1">{job.name}</h3>
                  <div className="flex items-center gap-4 text-xs text-[#7A8FA6]">
                    <span>Progress: {job.success} / {job.total}</span>
                    {job.failed > 0 && (
                      <span className="text-[#FF4444]">Failed: {job.failed}</span>
                    )}
                    <span>ETA: {job.eta}</span>
                  </div>
                </div>
                <div className="text-[#00C2FF] font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {job.progress}%
                </div>
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-[rgba(0,0,0,0.3)] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${job.progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[#00C2FF] to-[#7B2FFF] rounded-full"
                  style={{
                    boxShadow: '0 0 20px rgba(0, 194, 255, 0.4)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
