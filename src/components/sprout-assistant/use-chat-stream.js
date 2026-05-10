// MathSprout — Hook driving the multi-turn Sprout chat stream.
// Stores conversation as { id, role, en, vi, raw, images? } items. Parses each
// assistant reply's `<en>...</en><vi>...</vi>` tags incrementally.
//
// Usage:
//   const { messages, status, error, send, reset, abort } = useChatStream({ grade, age });
//   send('How do I subtract 23 from 41?');
//   send('Giúp em giải bài này', [dataUrl]);   // with a homework photo

import { useCallback, useRef, useState } from 'react';
import { streamChat } from '../../lib/sprout-api.js';

let nextId = 1;
const newId = () => `m${nextId++}`;

export function useChatStream({ grade, age }) {
  const [messages, setMessages] = useState([]);   // see shape above
  const [status, setStatus] = useState('idle');   // 'idle' | 'streaming' | 'error'
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const send = useCallback(async (text, images) => {
    const trimmed = (text || '').trim();
    const imgs = Array.isArray(images) ? images.filter(Boolean) : [];
    // Allow empty text when an image is attached (default prompt is added server-side).
    if ((!trimmed && imgs.length === 0) || status === 'streaming') return;

    const userText = trimmed || (imgs.length > 0 ? '📷 (homework photo)' : '');
    const userMsg = {
      id: newId(),
      role: 'user',
      en: userText,
      vi: '',
      raw: trimmed,
      images: imgs
    };
    const placeholderId = newId();
    const placeholder = { id: placeholderId, role: 'assistant', en: '', vi: '', raw: '' };

    // Snapshot history for the API request BEFORE adding placeholder.
    // Strip per-message image data — only the LAST user turn carries images
    // (passed separately via the `images` request field).
    const apiHistory = [...messages, userMsg].map(m => ({
      role: m.role,
      content: m.role === 'user' ? m.raw : (m.raw || stripTags(m.en, m.vi))
    }));

    setMessages(prev => [...prev, userMsg, placeholder]);
    setStatus('streaming');
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    let buffer = '';
    await streamChat({
      messages: apiHistory,
      grade,
      age,
      images: imgs,
      signal: controller.signal,
      onChunk: (chunk) => {
        buffer += chunk;
        const { en, vi } = extractBilingual(buffer);
        setMessages(prev => prev.map(m =>
          m.id === placeholderId ? { ...m, en, vi, raw: buffer } : m
        ));
      },
      onDone: () => {
        setStatus('idle');
        abortRef.current = null;
      },
      onError: (err) => {
        setError(err);
        setStatus('error');
        abortRef.current = null;
      }
    });
  }, [messages, grade, age, status]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setStatus('idle');
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setStatus('idle');
    setError(null);
  }, []);

  return { messages, status, error, send, reset, abort };
}

function extractBilingual(buffer) {
  const enMatch = buffer.match(/<en>([\s\S]*?)(?:<\/en>|$)/);
  const viMatch = buffer.match(/<vi>([\s\S]*?)(?:<\/vi>|$)/);
  return {
    en: enMatch ? enMatch[1].trim() : '',
    vi: viMatch ? viMatch[1].trim() : ''
  };
}

function stripTags(en, vi) {
  return `<en>\n${en}\n</en>\n<vi>\n${vi}\n</vi>`;
}
