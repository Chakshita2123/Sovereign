import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

interface KPIStatPodProps {
  label: string;
  value: number;
  trend?: number;
  sparklineData?: number[];
  icon?: React.ReactNode;
}

export function KPIStatPod({ label, value, trend, sparklineData, icon }: KPIStatPodProps) {
  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card glass-card-hover rounded-2xl p-5 min-w-[200px]"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-[#7A8FA6] text-[13px] mb-2">{label}</p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-[#F0F4FF] text-[32px] font-bold leading-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {value}
          </motion.div>
        </div>
        {icon && (
          <div className="text-[#00C2FF] opacity-40">
            {icon}
          </div>
        )}
      </div>

      {/* Trend indicator */}
      {trend !== undefined && (
        <div className="flex items-center gap-1.5">
          {isPositiveTrend ? (
            <TrendingUp className={`w-3.5 h-3.5 ${trend > 0 ? 'text-[#00FF88]' : 'text-[#7A8FA6]'}`} />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-[#FF4444]" />
          )}
          <span className={`text-xs font-semibold ${
            trend > 0 ? 'text-[#00FF88]' : trend < 0 ? 'text-[#FF4444]' : 'text-[#7A8FA6]'
          }`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        </div>
      )}

      {/* Mini sparkline */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-3 h-10 flex items-end gap-0.5">
          {sparklineData.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              animate={{ height: `${(val / Math.max(...sparklineData)) * 100}%` }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex-1 bg-[#00C2FF] opacity-40 rounded-t"
              style={{ minHeight: '2px' }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
