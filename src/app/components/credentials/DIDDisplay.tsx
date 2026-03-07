import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DIDDisplayProps {
  did: string;
  className?: string;
}

export function DIDDisplay({ did, className = '' }: DIDDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(did);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDID = (didString: string) => {
    const parts = didString.split(':');
    if (!expanded && parts.length >= 3) {
      const identifier = parts[parts.length - 1];
      return (
        <>
          <span className="text-[#7A8FA6]">{parts[0]}:</span>
          <span className="text-[#7A8FA6]">{parts[1]}:</span>
          <span className="text-[#7A8FA6]">{parts[2]}:</span>
          <span className="text-[#00C2FF]">
            {identifier.slice(0, 12)}...
          </span>
        </>
      );
    }
    
    return parts.map((part, index) => (
      <span key={index}>
        {index < parts.length - 1 ? (
          <span className="text-[#7A8FA6]">{part}:</span>
        ) : (
          <span className="text-[#00C2FF]">{part}</span>
        )}
      </span>
    ));
  };

  return (
    <div className={`bg-[rgba(0,194,255,0.04)] border-l-[3px] border-[#00C2FF] rounded-r-lg px-4 py-3 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <div 
          className="did-text flex-1 cursor-pointer select-all"
          onClick={() => setExpanded(!expanded)}
          title="Click to expand/collapse"
        >
          {formatDID(did)}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 hover:bg-[rgba(0,194,255,0.1)] rounded transition-colors shrink-0"
          title="Copy DID"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#00FF88]" />
          ) : (
            <Copy className="w-4 h-4 text-[#7A8FA6] hover:text-[#00C2FF]" />
          )}
        </button>
      </div>
    </div>
  );
}
