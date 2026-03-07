import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter } from 'lucide-react';
import { CredentialCard } from '../components/credentials/CredentialCard';
import { CredentialDetailPanel } from '../components/credentials/CredentialDetailPanel';
import { mockCredentials, Credential } from '../data/mockData';

export function CredentialVaultPage() {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'expiring' | 'revoked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCredentials = mockCredentials.filter((cred) => {
    const matchesFilter = filterStatus === 'all' || cred.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      cred.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cred.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div>
        <h1 className="text-[#F0F4FF] mb-2">Credential Vault</h1>
        <p className="text-[#7A8FA6] text-sm">
          Manage and share your verifiable credentials
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left panel - Credential list */}
        <div className="col-span-5 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8FA6]" />
            <input
              type="text"
              placeholder="Search did:indy:..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-[#0A1628] border border-[rgba(0,194,255,0.12)] rounded-lg text-sm text-[#F0F4FF] placeholder:text-[#7A8FA6] focus:outline-none focus:border-[#00C2FF] transition-colors did-text"
            />
          </div>

          {/* Filter pills */}
          <div className="flex gap-2">
            {(['all', 'verified', 'expiring', 'revoked'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wide transition-all
                  ${filterStatus === status
                    ? 'bg-[rgba(0,194,255,0.15)] text-[#00C2FF] border border-[#00C2FF]'
                    : 'bg-[rgba(0,194,255,0.04)] text-[#7A8FA6] border border-transparent hover:border-[rgba(0,194,255,0.3)]'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Credential list */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredCredentials.map((credential) => (
                <CredentialCard
                  key={credential.id}
                  credential={credential}
                  size="medium"
                  onClick={() => setSelectedCredential(credential)}
                />
              ))}
              {filteredCredentials.length === 0 && (
                <div className="py-12 text-center">
                  <div className="text-4xl mb-4 opacity-30">🔍</div>
                  <p className="text-[#7A8FA6] text-sm">No credentials found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right panel - Credential detail */}
        <div className="col-span-7">
          {selectedCredential ? (
            <CredentialDetailPanel credential={selectedCredential} />
          ) : (
            <div className="h-full flex items-center justify-center glass-card rounded-2xl p-12">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[rgba(0,194,255,0.1)] flex items-center justify-center">
                  <Filter className="w-10 h-10 text-[#00C2FF] opacity-40" />
                </div>
                <h3 className="text-[#F0F4FF] font-semibold mb-2">Select a credential</h3>
                <p className="text-[#7A8FA6] text-sm">
                  Choose a credential from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
