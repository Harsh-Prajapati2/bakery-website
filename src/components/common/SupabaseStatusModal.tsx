import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Key, 
  Layers,
  Terminal,
  Zap
} from 'lucide-react';
import { 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY, 
  isSupabaseConfigured, 
  saveSupabaseCredentials, 
  resetSupabaseCredentials,
  pingSupabase 
} from '../../lib/supabase';

interface SupabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReloadData?: () => void;
}

export const SupabaseStatusModal: React.FC<SupabaseStatusModalProps> = ({
  isOpen,
  onClose,
  onReloadData,
}) => {
  const [urlInput, setUrlInput] = useState(SUPABASE_URL || '');
  const [keyInput, setKeyInput] = useState(SUPABASE_ANON_KEY || '');
  const [pingResult, setPingResult] = useState<{ connected: boolean; latencyMs: number; error?: string } | null>(null);
  const [isPinging, setIsPinging] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && isSupabaseConfigured) {
      handleTestPing();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestPing = async () => {
    setIsPinging(true);
    const res = await pingSupabase();
    setPingResult(res);
    setIsPinging(false);
  };

  const handleSave = () => {
    const res = saveSupabaseCredentials(urlInput, keyInput);
    setSaveStatus(res.message);
    if (res.success) {
      setTimeout(() => {
        handleTestPing();
        if (onReloadData) onReloadData();
      }, 300);
    }
  };

  const copySqlSchemaPath = () => {
    navigator.clipboard.writeText('/supabase/schema.sql');
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-[#1c0d0b] border border-[#44211d] rounded-3xl shadow-2xl overflow-hidden text-[#f7efe6] relative p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#2a1310] hover:bg-[#3d1a16] border border-[#48221d] flex items-center justify-center text-[#debba9] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start justify-between pr-8">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#faeedd]">
                Supabase Backend Integration
              </h2>
            </div>
            <p className="text-xs text-[#a98271] mt-1">
              Connect your live Supabase PostgreSQL database, authentication, and realtime websocket subscriptions.
            </p>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
            isSupabaseConfigured 
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm' 
              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            {isSupabaseConfigured ? 'Live Connection Active' : 'Local Fallback / Ready'}
          </span>
        </div>

        {/* Connection Diagnostics Card */}
        <div className="p-4 rounded-2xl bg-[#140807] border border-[#2d1411] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8e6857] font-semibold uppercase tracking-wider text-[10px]">
              Connection Status:
            </span>
            <button
              onClick={handleTestPing}
              disabled={isPinging || !isSupabaseConfigured}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors disabled:opacity-40"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging Database...' : 'Run Diagnostics Ping'}</span>
            </button>
          </div>

          {pingResult ? (
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              pingResult.connected 
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}>
              {pingResult.connected ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
              )}
              <div className="space-y-0.5">
                <span className="font-semibold block">
                  {pingResult.connected 
                    ? `Successfully connected to Supabase table (Latency: ${pingResult.latencyMs}ms)`
                    : 'Connection attempt returned an error'}
                </span>
                {pingResult.error && (
                  <span className="text-[11px] text-rose-300/90 block">
                    {pingResult.error}. (Make sure you have run `/supabase/schema.sql` in your Supabase SQL Editor).
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[#8e6857] text-[11px]">
              {isSupabaseConfigured 
                ? 'Click "Run Diagnostics Ping" to check live database connectivity.'
                : 'Enter your Supabase URL & Anon Key below, or set them in your .env file to enable live sync.'}
            </div>
          )}
        </div>

        {/* Credentials Form */}
        <div className="space-y-4">
          <div className="space-y-1 text-xs">
            <label className="text-[#debba9] font-medium flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Supabase Project URL:
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          <div className="space-y-1 text-xs">
            <label className="text-[#debba9] font-medium flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              Supabase Anon Public API Key:
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full bg-[#140807] border border-[#3b1c18] rounded-xl px-3 py-2 text-xs text-amber-100 placeholder-[#6e483a] focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {saveStatus && (
            <div className="text-xs text-amber-300">
              {saveStatus}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs shadow-md transition-all cursor-pointer"
            >
              Save Credentials & Connect Live
            </button>

            {isSupabaseConfigured && (
              <button
                onClick={resetSupabaseCredentials}
                className="px-4 py-2.5 rounded-xl bg-[#2a1310] hover:bg-[#3d1a16] border border-[#48221d] text-rose-300 text-xs font-medium transition-colors"
              >
                Clear Credentials
              </button>
            )}
          </div>
        </div>

        {/* Step-by-Step Instructions & SQL Schema Helper */}
        <div className="pt-4 border-t border-[#311613] space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-[#f5ece3] flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-amber-400" />
              Supabase SQL Migration File Included
            </span>
            <button
              onClick={copySqlSchemaPath}
              className="px-2.5 py-1 rounded-lg bg-[#251210] hover:bg-[#331815] border border-[#44221d] text-amber-300 text-[11px] flex items-center gap-1 transition-colors"
            >
              {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copied Path!' : 'Copy Path: /supabase/schema.sql'}</span>
            </button>
          </div>

          <div className="bg-[#140807] border border-[#2d1411] rounded-2xl p-3.5 space-y-2 text-[#a88273] text-[11px]">
            <p className="text-[#debba9] font-medium">To run the schema in your Supabase project:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Open your project at <a href="https://app.supabase.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">app.supabase.com</a>.</li>
              <li>Go to <strong>SQL Editor</strong> in the left sidebar.</li>
              <li>Click <strong>New query</strong> and paste the contents of <code className="text-amber-300">/supabase/schema.sql</code>.</li>
              <li>Click <strong>Run</strong> — this creates all 7 tables, sets up RLS security policies, and enables live WebSocket replication!</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
