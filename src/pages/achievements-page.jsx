// MathSprout — Achievements / badges grid

import { useApp } from '../context/app-context.jsx';
import { PageHeader } from '../components/layout/page-header.jsx';
import { BADGES } from '../data/topics.js';

export default function AchievementsPage() {
  const { state } = useApp();

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <PageHeader title="🏆 Achievements" />
        <p className="text-center mb-4 tnum">
          {state.badges.length} / {BADGES.length} badges earned
        </p>

        <div className="grid grid-cols-2 gap-3">
          {BADGES.map(badge => {
            const earned = state.badges.includes(badge.code);
            return (
              <div
                key={badge.code}
                className={`bg-white rounded-2xl p-4 shadow text-center ${earned ? '' : 'opacity-40'}`}
              >
                <div className="text-4xl mb-2">{earned ? badge.emoji : '🔒'}</div>
                <div className="font-bold text-sm">{earned ? badge.name : '???'}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {earned ? badge.desc : 'Keep playing to unlock'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
