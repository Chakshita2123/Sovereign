interface SidebarIdentityCardProps {
  did: string;
  name: string;
}

export function SidebarIdentityCard({ did, name }: SidebarIdentityCardProps) {
  const truncateDID = (didString: string) => {
    const parts = didString.split(':');
    if (parts.length >= 3) {
      const identifier = parts[parts.length - 1];
      return `${parts[0]}:${parts[1]}:${parts[2]}:${identifier.slice(0, 4)}...${identifier.slice(-4)}`;
    }
    return didString;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="glass-card rounded-xl p-3">
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#7B2FFF] flex items-center justify-center">
            <span className="text-white text-sm font-bold">{getInitials(name)}</span>
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FF88] rounded-full border-2 border-[#080F1E] pulse-dot" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[#F0F4FF] text-sm font-semibold truncate">{name}</div>
          <div className="text-[#7A8FA6] text-xs">Identity Owner</div>
        </div>
      </div>
      <div className="bg-[rgba(0,194,255,0.04)] border-l-[3px] border-[#00C2FF] rounded-r-lg px-3 py-2">
        <div className="did-text text-xs truncate" title={did}>
          {truncateDID(did)}
        </div>
      </div>
    </div>
  );
}
