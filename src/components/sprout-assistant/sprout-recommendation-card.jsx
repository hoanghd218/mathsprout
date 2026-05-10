// MathSprout — Dashboard card that asks Sprout (Claude) for a personalized
// practice plan. Shows 3-5 specific drill recommendations with bilingual
// reasoning. Caches results 30 minutes to avoid spam.

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../../context/app-context.jsx';
import { useToast } from '../ui/toast.jsx';
import { requestRecommendation } from '../../lib/sprout-api.js';
import { summarizeAttempts } from '../../lib/attempt-summary.js';
import {
  getCachedRecommendation,
  setCachedRecommendation,
  clearCachedRecommendation
} from '../../lib/recommendation-cache.js';
import { SproutButton } from './sprout-button.jsx';
import { RecommendationItem } from './recommendation-item.jsx';

export function SproutRecommendationCard() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const showToast = useToast();
  const userKey = `${state.user?.nickname || 'guest'}_${state.user?.grade || 0}`;

  // Hydrate from cache on mount so a returning user sees the last plan instantly.
  const [data, setData] = useState(() => getCachedRecommendation(userKey));
  const [status, setStatus] = useState(data ? 'ready' : 'idle'); // idle|loading|ready|error
  const [error, setError] = useState(null);

  async function fetchRecommendation({ force = false } = {}) {
    if (!force) {
      const cached = getCachedRecommendation(userKey);
      if (cached) { setData(cached); setStatus('ready'); return; }
    }
    setStatus('loading');
    setError(null);
    try {
      const summary = summarizeAttempts(state.attempts);
      const res = await requestRecommendation({
        skillMap: state.skillMap,
        recentSummary: summary,
        grade: state.user?.grade ?? 2,
        age: state.user?.age ?? 7
      });
      if (!Array.isArray(res?.recommendations) || res.recommendations.length === 0) {
        throw new Error('Sprout chưa đưa ra đề xuất nào — thử lại nhé!');
      }
      setData(res);
      setCachedRecommendation(userKey, res);
      setStatus('ready');
    } catch (err) {
      console.error('recommendation error:', err);
      setError(err);
      setStatus('error');
    }
  }

  function handleStartDrill(rec) {
    dispatch({
      type: 'START_FOCUSED_LESSON',
      topic: rec.topic,
      count: Math.min(10, Math.max(3, Number(rec.drill_count) || 5))
    });
    showToast(`🌱 Luyện ${rec.title_vi}!`, 'success');
    navigate('/practice');
  }

  function handleRefresh() {
    clearCachedRecommendation(userKey);
    fetchRecommendation({ force: true });
  }

  return (
    <div className="sprout-rec-card">
      <header className="sprout-rec-card-head">
        <span className="text-2xl" aria-hidden="true">✨</span>
        <div className="flex-1">
          <div className="font-display font-bold text-base">Sprout đề xuất bài cho em</div>
          <div className="text-xs text-gray-500">AI personalized practice plan</div>
        </div>
        {status === 'ready' && (
          <button
            type="button"
            className="sprout-rec-refresh"
            onClick={handleRefresh}
            aria-label="Refresh recommendations"
            title="Làm mới đề xuất"
          >
            ↻
          </button>
        )}
      </header>

      {status === 'idle' && (
        <div className="text-center py-2">
          <div className="text-sm text-gray-600 mb-3">
            Sprout sẽ phân tích bài làm của em và đề xuất bài tập phù hợp nhất.
          </div>
          <SproutButton onClick={() => fetchRecommendation()}>
            Hỏi Sprout em nên luyện gì?
          </SproutButton>
        </div>
      )}

      {status === 'loading' && (
        <div className="sprout-loading">
          <span className="sprout-bounce" aria-hidden="true">🌱</span>
          <span className="ml-2">Sprout đang xem bài của em...</span>
        </div>
      )}

      {status === 'error' && (
        <div className="sprout-error">
          <div className="font-bold">😴 Sprout đang nghỉ ngơi</div>
          <div className="text-sm mt-1">{error?.message || 'Thử lại sau nhé!'}</div>
          <button
            type="button"
            className="sprout-rec-retry"
            onClick={() => fetchRecommendation({ force: true })}
          >
            Thử lại / Retry
          </button>
        </div>
      )}

      {status === 'ready' && data && (
        <>
          {(data.overall_summary_vi || data.overall_summary_en) && (
            <div className="sprout-rec-summary">
              <div className="text-sm">{data.overall_summary_vi}</div>
              <div className="text-xs text-gray-500 mt-1">{data.overall_summary_en}</div>
            </div>
          )}

          <div className="sprout-rec-list">
            {data.recommendations.map((rec, i) => (
              <RecommendationItem
                key={`${rec.topic}-${rec.subtype}-${i}`}
                rec={rec}
                onStart={handleStartDrill}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
