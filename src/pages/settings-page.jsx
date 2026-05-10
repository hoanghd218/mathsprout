// MathSprout — Settings: profile, about, reset data

import { useApp } from '../context/app-context.jsx';
import { PageHeader } from '../components/layout/page-header.jsx';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const u = state.user || {};

  function handleReset() {
    const ok = window.confirm(
      'Reset all data? You will lose XP, streak, and badges.\n(Bạn có chắc muốn xóa hết dữ liệu?)'
    );
    if (ok) dispatch({ type: 'RESET' });
  }

  return (
    <section className="page">
      <div className="max-w-md mx-auto p-6">
        <PageHeader title="⚙️ Settings" />

        <div className="bg-white rounded-2xl p-4 mb-4 shadow">
          <div className="font-bold mb-2">👤 Profile</div>
          <div className="text-sm">Name: <strong>{u.nickname || '—'}</strong></div>
          <div className="text-sm">Age: <strong>{u.age || '—'}</strong></div>
          <div className="text-sm">Grade: <strong>{u.grade || '—'}</strong></div>
          <div className="text-sm">Buddy: <strong>{u.avatar || '—'}</strong></div>
        </div>

        <div className="bg-white rounded-2xl p-4 mb-4 shadow">
          <div className="font-bold mb-2">ℹ️ About</div>
          <div className="text-sm">MathSprout v1.0.0</div>
          <div className="text-sm">Made with ❤️ by Trần Nhật Minh</div>
          <div className="text-xs text-gray-500 mt-1">STEMFEST 2026 — Vinschool Ocean Park</div>
        </div>

        <button className="btn-destructive" onClick={handleReset}>
          🗑 Reset All Data
        </button>
      </div>
    </section>
  );
}
