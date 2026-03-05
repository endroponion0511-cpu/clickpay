import React, { useState } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export function SupabaseDiagnostic() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');
  const [error, setError] = useState('');

  const test = async () => {
    setStatus('testing');
    setError('');
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      });
      if (res.ok) {
        setStatus('ok');
      } else {
        setStatus('fail');
        setError(`HTTP ${res.status}: ${res.statusText}`);
      }
    } catch (e) {
      setStatus('fail');
      setError(e instanceof Error ? e.message : String(e));
    }
  };

  const maskedUrl = supabaseUrl
    ? `${supabaseUrl.slice(0, 30)}...${supabaseUrl.slice(-15)}`
    : '(not set)';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Supabase connection test
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          URL: <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1 rounded">{maskedUrl}</code>
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Key: {supabaseKey ? '✓ Set' : '✗ Not set'}
        </p>
        <button
          onClick={test}
          disabled={!supabaseUrl || !supabaseKey || status === 'testing'}
          className="w-full py-2 rounded-lg font-medium bg-[#B6FF2E] text-black disabled:opacity-50 mb-4"
        >
          {status === 'testing' ? 'Testing…' : 'Test connection'}
        </button>
        {status === 'ok' && (
          <p className="text-green-600 text-sm">Connection OK</p>
        )}
        {status === 'fail' && (
          <div className="text-sm">
            <p className="text-red-600 font-medium mb-2">Connection failed</p>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{error}</p>
            <ul className="text-xs text-gray-500 space-y-1 list-disc list-inside">
              <li>Supabase Dashboard → check project is not paused</li>
              <li>Settings → API → copy Project URL exactly to .env</li>
              <li>If you have multiple projects, use the one where you ran the SQL</li>
              <li>Restart dev server after changing .env</li>
            </ul>
          </div>
        )}
        <a
          href="/admin/chat"
          className="mt-4 block text-center text-sm text-[#B6FF2E] hover:underline"
        >
          ← Back to login
        </a>
      </div>
    </div>
  );
}
