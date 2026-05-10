// MathSprout — Shop page: spend XP to buy easy-question packs and badges

import { useEffect } from 'react';
import { useApp } from '../context/app-context.jsx';
import { useToast } from '../components/ui/toast.jsx';
import { PageHeader } from '../components/layout/page-header.jsx';
import { PrimaryButton } from '../components/ui/button.jsx';
import { SHOP_ITEMS, BADGES } from '../data/topics.js';

export default function ShopPage() {
  const { state, dispatch } = useApp();
  const showToast = useToast();
  const xp = state.progress.totalXP || 0;
  const stock = state.easyQuestionStock || 0;
  const purchases = state.shopPurchases || [];

  // Forward purchase result as toast(s) and clear it.
  useEffect(() => {
    const r = state.lastShopResult;
    if (!r) return;
    if (!r.ok) {
      showToast('❌ Không đủ XP hoặc đã mua', 'error');
    } else {
      showToast('✅ Mua thành công!', 'success');
      r.newBadges?.forEach(code => {
        const badge = BADGES.find(b => b.code === code);
        if (badge) showToast(`🏆 New badge: ${badge.name}!`, 'success');
      });
    }
    dispatch({ type: 'CONSUME_SHOP_RESULT' });
  }, [state.lastShopResult, dispatch, showToast]);

  function buy(itemId) {
    dispatch({ type: 'BUY_SHOP_ITEM', itemId });
  }

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <PageHeader title="🛒 Shop" />

        <div className="bg-yellow-50 rounded-2xl p-4 mb-4 border-2 border-yellow-200 text-sm">
          <div className="flex justify-between">
            <span className="font-bold text-yellow-700">⭐ XP của em</span>
            <span className="tnum font-bold text-yellow-700">{xp}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-bold text-yellow-700">📚 Câu dễ tồn kho</span>
            <span className="tnum font-bold text-yellow-700">{stock}</span>
          </div>
        </div>

        <div className="space-y-3">
          {SHOP_ITEMS.map(item => {
            const buyCount = purchases.filter(id => id === item.id).length;
            const canAfford = xp >= item.cost;
            const badgeNames = (item.rewards.badges || []).map(code => {
              const b = BADGES.find(x => x.code === code);
              return b ? `${b.emoji} ${b.name}` : code;
            });

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 shadow border-2 ${
                  canAfford ? 'bg-white border-yellow-300' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-4xl">{item.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-lg">{item.name}</div>
                    <div className="text-sm text-yellow-700 font-bold tnum">
                      ⭐ {item.cost} XP
                    </div>
                  </div>
                  {buyCount > 0 && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-200 text-green-800 tnum">
                      ×{buyCount}
                    </span>
                  )}
                </div>

                <ul className="text-sm space-y-1 mb-3">
                  {item.rewards.easyQuestions > 0 && (
                    <li className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>+{item.rewards.easyQuestions} câu hỏi dễ (warm-up)</span>
                    </li>
                  )}
                  {badgeNames.map((n, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>Huy hiệu {n} {buyCount > 0 && '(đã có)'}</span>
                    </li>
                  ))}
                </ul>

                <PrimaryButton
                  className="w-full"
                  onClick={() => buy(item.id)}
                  disabled={!canAfford}
                  style={!canAfford ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
                >
                  {canAfford
                    ? buyCount > 0 ? `Mua tiếp — ${item.cost} XP` : `Mua — ${item.cost} XP`
                    : `Cần thêm ${item.cost - xp} XP`}
                </PrimaryButton>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Câu dễ tồn kho được dùng dần ({3} câu mỗi bài học) làm warm-up.
        </p>
      </div>
    </section>
  );
}
