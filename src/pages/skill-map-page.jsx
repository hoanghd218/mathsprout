// MathSprout — Skill map: per-topic mastery bars and status

import { useApp } from '../context/app-context.jsx';
import { PageHeader } from '../components/layout/page-header.jsx';
import { TOPICS } from '../data/topics.js';
import { getEligibleTopics } from '../lib/recommender.js';

function masteryColor(mastery) {
  if (mastery >= 70) return 'bg-green-400';
  if (mastery >= 30) return 'bg-yellow-400';
  return 'bg-red-400';
}

function masteryStatus(skill) {
  if (skill.attempts === 0) return '🆕 Not started yet';
  if (skill.mastery >= 90) return '⭐ Mastered!';
  if (skill.mastery >= 70) return '🟢 Strong';
  if (skill.mastery >= 30) return '🟡 Practicing';
  return '🔴 Need practice';
}

export default function SkillMapPage() {
  const { state } = useApp();
  const grade = state.user?.grade || 2;
  const eligible = getEligibleTopics(grade);

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <PageHeader title="🗺️ Your Skill Map" />
        <p className="text-sm text-gray-600 mb-4">Your math superpowers! 💪</p>

        <div className="space-y-3">
          {eligible.map(topic => {
            const skill = state.skillMap[topic];
            const tInfo = TOPICS[topic];
            return (
              <div key={topic} className="bg-white rounded-2xl p-4 shadow">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="font-bold text-lg">{tInfo.emoji} {tInfo.name}</div>
                    <div className="text-sm text-gray-600">{tInfo.name_vi}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold tnum">{Math.round(skill.mastery)}%</div>
                    <div className="text-xs text-gray-500 tnum">{skill.correct}/{skill.attempts} correct</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
                  <div
                    className={`h-3 mastery-bar ${masteryColor(skill.mastery)}`}
                    style={{ width: `${skill.mastery}%` }}
                  />
                </div>
                <div className="text-sm">{masteryStatus(skill)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
