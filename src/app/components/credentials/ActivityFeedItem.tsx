import { Activity } from '../../data/mockData';
import { formatDistanceToNow } from 'date-fns';

interface ActivityFeedItemProps {
  activity: Activity;
  isLast?: boolean;
}

export function ActivityFeedItem({ activity, isLast = false }: ActivityFeedItemProps) {
  const getColorConfig = (type: Activity['type']) => {
    switch (type) {
      case 'received':
        return { color: '#00FF88', hasPulse: true };
      case 'shared':
        return { color: '#00C2FF', hasPulse: false };
      case 'expiring':
        return { color: '#F5A623', hasPulse: false };
      case 'revoked':
        return { color: '#FF4444', hasPulse: false };
      case 'rotated':
        return { color: '#7B2FFF', hasPulse: false };
    }
  };

  const config = getColorConfig(activity.type);

  return (
    <div className="relative flex gap-3 group hover:bg-[rgba(255,255,255,0.02)] px-3 py-2.5 -mx-3 rounded-lg transition-colors">
      {/* Timeline dot and line */}
      <div className="relative flex flex-col items-center shrink-0">
        <div
          className={`w-2 h-2 rounded-full shrink-0 ${config.hasPulse ? 'pulse-dot' : ''}`}
          style={{ background: config.color }}
        />
        {!isLast && (
          <div 
            className="w-px flex-1 mt-1"
            style={{ background: 'rgba(0, 194, 255, 0.1)' }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pb-4">
        <div className="flex items-start justify-between gap-3 mb-1">
          <p className="text-[#F0F4FF] text-[13px] font-medium">
            {activity.title}
          </p>
          <span className="did-text text-[11px] text-[#7A8FA6] shrink-0">
            {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
          </span>
        </div>
        <p className="text-[#7A8FA6] text-xs">
          {activity.description}
        </p>
      </div>
    </div>
  );
}
