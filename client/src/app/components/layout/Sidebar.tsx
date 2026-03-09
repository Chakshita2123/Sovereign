import { NavLink } from 'react-router';
import { LayoutDashboard, Vault, User, Building2, Bell } from 'lucide-react';
import { SidebarIdentityCard } from './SidebarIdentityCard';
import { userDID } from '../../data/mockData';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { path: '/dashboard/vault', label: 'Credential Vault', icon: Vault },
  { path: '/dashboard/identity', label: 'DID Identity', icon: User },
  { path: '/dashboard/issuer', label: 'Issuer Portal', icon: Building2 },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-[#080F1E] border-r border-[rgba(0,194,255,0.08)] flex flex-col fixed left-0 top-0 z-50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-[rgba(0,194,255,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00C2FF] to-[#7B2FFF] flex items-center justify-center">
            <Vault className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-[#F0F4FF]" style={{ fontFamily: 'var(--font-heading)' }}>
            VaultID
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `
              flex items-center gap-3 h-11 px-4 mx-2 mb-1 rounded-lg
              transition-all duration-150 relative group
              ${isActive 
                ? 'bg-[rgba(0,194,255,0.08)] text-[#F0F4FF] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-[#00C2FF] before:rounded-r' 
                : 'text-[#7A8FA6] hover:bg-[rgba(0,194,255,0.04)] hover:text-[#A8D8FF]'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#00C2FF]' : 'group-hover:text-[#A8D8FF]'}`} />
                <span className="text-sm font-medium">{item.label}</span>
                {item.label === 'Issuer Portal' && (
                  <span className="ml-auto w-5 h-5 rounded-full bg-[#FF4444] text-white text-[9px] font-bold flex items-center justify-center">
                    3
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Identity Card */}
      <div className="p-4 border-t border-[rgba(0,194,255,0.08)]">
        <SidebarIdentityCard did={userDID} name="Alex Chen" />
      </div>
    </aside>
  );
}
