import { Search, Bell, Wifi } from 'lucide-react';

export function TopCommandBar() {
  return (
    <div className="h-10 sticky top-0 z-40 bg-[rgba(5,13,26,0.85)] backdrop-blur-2xl border-b border-[rgba(0,194,255,0.08)]">
      <div className="h-full px-6 flex items-center gap-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#7A8FA6]">
          <span>Dashboard</span>
          <span>/</span>
          <span className="text-[#F0F4FF]">Overview</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8FA6]" />
            <input
              type="text"
              placeholder="Search credentials, DIDs, issuers..."
              className="w-full h-8 pl-10 pr-4 bg-[#0A1628] border border-[rgba(0,194,255,0.12)] rounded-lg text-[13px] text-[#F0F4FF] placeholder:text-[#7A8FA6] focus:outline-none focus:border-[#00C2FF] transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Network Status */}
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-[#00FF88]" />
            <span className="text-xs text-[#7A8FA6]">Sovrin MainNet</span>
          </div>

          {/* Notifications */}
          <button className="relative p-1 hover:bg-[rgba(0,194,255,0.04)] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#7A8FA6]" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF4444] rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00C2FF] to-[#7B2FFF] flex items-center justify-center cursor-pointer">
            <span className="text-white text-xs font-bold">AC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
