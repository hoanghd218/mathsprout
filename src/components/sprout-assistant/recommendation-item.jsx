// MathSprout — Single AI recommendation row inside the SproutRecommendationCard.
// Shows topic, bilingual title + reason, difficulty badge, and a "Start drill" button.

import { TOPICS } from '../../data/topics.js';

const DIFFICULTY_LABEL = {
  easy:   { en: 'Easy',   vi: 'Dễ',         color: '#10B981' },
  medium: { en: 'Medium', vi: 'Vừa',        color: '#F59E0B' },
  hard:   { en: 'Hard',   vi: 'Thử thách',  color: '#EF4444' }
};

export function RecommendationItem({ rec, onStart }) {
  const topicMeta = TOPICS[rec.topic] || { emoji: '📘', name: rec.topic };
  const diff = DIFFICULTY_LABEL[rec.difficulty] || DIFFICULTY_LABEL.medium;

  return (
    <article className="sprout-rec-item">
      <header className="sprout-rec-item-head">
        <span className="text-2xl" aria-hidden="true">{topicMeta.emoji}</span>
        <div className="flex-1">
          <div className="font-bold text-base leading-tight">{rec.title_en}</div>
          <div className="text-sm text-gray-600 leading-tight">{rec.title_vi}</div>
        </div>
        <span
          className="sprout-diff-badge"
          style={{ background: diff.color }}
          title={`${diff.en} / ${diff.vi}`}
        >
          {diff.vi}
        </span>
      </header>

      <div className="sprout-rec-reason">
        <div className="text-xs text-gray-500 font-bold mb-1">Tại sao? / Why?</div>
        <div className="text-sm">🇬🇧 {rec.reason_en}</div>
        <div className="text-sm text-gray-700 mt-1">🇻🇳 {rec.reason_vi}</div>
      </div>

      <button
        type="button"
        className="sprout-rec-start-btn"
        onClick={() => onStart(rec)}
      >
        ▶ Luyện {rec.drill_count} bài / Practice {rec.drill_count}
      </button>
    </article>
  );
}
