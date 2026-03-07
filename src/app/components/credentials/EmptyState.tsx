import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="w-20 h-20 mb-6 rounded-full bg-[rgba(0,194,255,0.1)] flex items-center justify-center float-animation"
      >
        <Icon className="w-10 h-10 text-[#00C2FF] opacity-40" />
      </motion.div>
      <h3 className="text-[#F0F4FF] text-xl font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h3>
      <p className="text-[#7A8FA6] text-sm mb-6 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 rounded-lg gradient-cta text-white font-semibold"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}