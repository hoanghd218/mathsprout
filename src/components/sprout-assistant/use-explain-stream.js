// MathSprout — Hook that drives the Sprout explain stream and parses the
// `<en>...</en><vi>...</vi>` bilingual format into two separate text panels.
//
// Usage:
//   const { status, en, vi, error, start, reset } = useExplainStream();
//   useEffect(() => { if (open) start({ question, userAnswer, ... }); }, [open]);

import { useCallback, useRef, useState } from 'react';
import { streamExplain } from '../../lib/sprout-api.js';

export function useExplainStream() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'streaming' | 'done' | 'error'
  const [en, setEn] = useState('');
  const [vi, setVi] = useState('');
  const [error, setError] = useState(null);
  const bufferRef = useRef('');

  const start = useCallback(async (params) => {
    setStatus('streaming');
    setEn('');
    setVi('');
    setError(null);
    bufferRef.current = '';

    await streamExplain({
      ...params,
      onChunk: (chunk) => {
        bufferRef.current += chunk;
        const parts = extractBilingual(bufferRef.current);
        setEn(parts.en);
        setVi(parts.vi);
      },
      onDone: () => setStatus('done'),
      onError: (err) => {
        setError(err);
        setStatus('error');
      }
    });
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setEn('');
    setVi('');
    setError(null);
    bufferRef.current = '';
  }, []);

  return { status, en, vi, error, start, reset };
}

// Extract `<en>...</en>` and `<vi>...</vi>` from a partial stream buffer.
// Handles open-but-not-yet-closed tags (during streaming).
function extractBilingual(buffer) {
  const enMatch = buffer.match(/<en>([\s\S]*?)(?:<\/en>|$)/);
  const viMatch = buffer.match(/<vi>([\s\S]*?)(?:<\/vi>|$)/);
  return {
    en: enMatch ? enMatch[1].trim() : '',
    vi: viMatch ? viMatch[1].trim() : ''
  };
}
