/* MathSprout — Main app: page handlers, event wiring, render functions */

(function () {
  const { $, $$, navigate, showToast, celebrate, speak } = UI;

  let state = Storage.load();
  let questionStartTime = 0;
  let hintUsed = false;
  let lastResult = null;

  function save() { Storage.save(state); }

  /* ===== INIT ===== */

  function init() {
    setupEventListeners();

    if (!state.user) {
      navigate('welcome');
    } else {
      navigate('dashboard');
      renderDashboard();
    }
  }

  function setupEventListeners() {
    /* Welcome */
    $('#btn-get-started')?.addEventListener('click', () => navigate('signup'));

    /* Signup */
    $('#signup-form')?.addEventListener('submit', handleSignup);
    setupChoiceGroup('.age-btn');
    setupChoiceGroup('.grade-btn');
    setupChoiceGroup('.avatar-btn');

    /* Dashboard */
    $('#btn-start-lesson')?.addEventListener('click', startLesson);
    $('#btn-go-skillmap')?.addEventListener('click', () => { navigate('skillmap'); renderSkillMap(); });
    $('#btn-go-progress')?.addEventListener('click', () => { navigate('progress'); renderProgress(); });
    $('#btn-go-achievements')?.addEventListener('click', () => { navigate('achievements'); renderAchievements(); });
    $('#btn-go-practice')?.addEventListener('click', startLesson);
    $('#btn-go-settings')?.addEventListener('click', () => { navigate('settings'); renderSettings(); });

    /* Practice */
    $('#btn-toggle-bilingual')?.addEventListener('click', toggleBilingual);
    $('#btn-listen')?.addEventListener('click', listenQuestion);
    $('#btn-hint')?.addEventListener('click', showHint);
    $('#btn-submit')?.addEventListener('click', submitAnswer);
    $('#answer-input')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') submitAnswer();
    });

    /* Result */
    $('#btn-next-question')?.addEventListener('click', nextQuestion);

    /* Back buttons */
    $$('.btn-back').forEach(btn => btn.addEventListener('click', () => {
      navigate('dashboard');
      renderDashboard();
    }));

    /* Settings */
    $('#btn-reset-data')?.addEventListener('click', () => {
      const ok = confirm('Reset all data? You will lose XP, streak, and badges.\n(Bạn có chắc muốn xóa hết dữ liệu?)');
      if (ok) {
        Storage.clear();
        location.reload();
      }
    });
  }

  function setupChoiceGroup(selector) {
    $$(selector).forEach(btn => btn.addEventListener('click', (e) => {
      $$(selector).forEach(b => b.classList.remove('selected'));
      e.currentTarget.classList.add('selected');
    }));
  }

  /* ===== SIGNUP ===== */

  function handleSignup(e) {
    e.preventDefault();
    const nickname = $('#input-nickname').value.trim();
    const ageBtn = $('.age-btn.selected');
    const gradeBtn = $('.grade-btn.selected');
    const avatarBtn = $('.avatar-btn.selected');

    if (!nickname) return showToast('Please enter your name / Hãy nhập tên', 'error');
    if (!ageBtn) return showToast('Please select your age / Hãy chọn tuổi', 'error');
    if (!gradeBtn) return showToast('Please select your grade / Hãy chọn lớp', 'error');

    state.user = {
      nickname,
      age: parseInt(ageBtn.dataset.age, 10),
      grade: parseInt(gradeBtn.dataset.grade, 10),
      avatar: avatarBtn?.dataset.avatar || '🌱',
      createdAt: Date.now()
    };
    save();
    showToast(`Welcome, ${nickname}! 🌱`, 'success');
    navigate('dashboard');
    renderDashboard();
  }

  /* ===== DASHBOARD ===== */

  function renderDashboard() {
    if (!state.user) return navigate('welcome');

    const u = state.user;
    const xp = state.progress.totalXP;
    const level = Recommender.getCurrentLevel(xp);
    const nextLevel = Recommender.getNextLevel(xp);
    const progressPct = nextLevel.min > level.min
      ? Math.min(100, ((xp - level.min) / (nextLevel.min - level.min)) * 100)
      : 100;

    $('#dash-greeting').textContent = `Hi ${u.nickname}! 👋`;
    $('#dash-greeting-vi').textContent = `Chào ${u.nickname}! Sẵn sàng cho 10 phút hôm nay?`;
    $('#dash-level-emoji').textContent = level.emoji;
    $('#dash-level-name').textContent = level.name;
    $('#dash-xp').textContent = `⭐ ${xp} XP`;
    $('#dash-streak').textContent = `🔥 ${state.progress.streakDays}-day streak`;
    $('#dash-progress-bar').style.width = `${progressPct}%`;
    $('#dash-xp-to-next').textContent = nextLevel.min > xp
      ? `${nextLevel.min - xp} XP to ${nextLevel.name}`
      : 'Max level reached! 🎉';

    /* Today's recommendation preview */
    const previewLesson = Recommender.getNextLesson(state, 10);
    const [recType, recTopic] = previewLesson.recommendation.split(':');
    let recText = '';
    if (recType === 'focus_weak') {
      const t = TOPICS[recTopic];
      recText = `Today let's focus on ${t.emoji} ${t.name} (you need practice here!)`;
    } else if (recType === 'learn_new') {
      const t = TOPICS[recTopic];
      recText = `Time to learn ${t.emoji} ${t.name} — let's go!`;
    } else if (recType === 'improve') {
      const t = TOPICS[recTopic];
      recText = `Let's improve ${t.emoji} ${t.name} today!`;
    } else {
      recText = `You're doing great! Mixed practice today 💪`;
    }
    $('#dash-recommendation').textContent = recText;
  }

  /* ===== PRACTICE ===== */

  function startLesson() {
    state.currentLesson = Recommender.getNextLesson(state, 10);
    save();
    navigate('practice');
    renderQuestion();
  }

  function renderQuestion() {
    const lesson = state.currentLesson;
    if (!lesson || lesson.currentIndex >= lesson.questions.length) {
      finishLesson();
      return;
    }

    const q = lesson.questions[lesson.currentIndex];
    questionStartTime = Date.now();
    hintUsed = false;

    $('#practice-progress').textContent = `Question ${lesson.currentIndex + 1} of ${lesson.questions.length}`;
    $('#practice-progress-bar').style.width = `${(lesson.currentIndex / lesson.questions.length) * 100}%`;
    $('#practice-topic').textContent = `${TOPICS[q.topic].emoji} ${TOPICS[q.topic].name}`;
    $('#practice-question-en').textContent = q.questionEn;
    $('#practice-question-vi').textContent = q.questionVi;

    const input = $('#answer-input');
    input.value = '';
    setTimeout(() => input.focus(), 100);

    $('#hint-text').textContent = '';
    $('#hint-text').style.display = 'none';

    const showVi = state.settings.bilingualMode;
    $('#practice-question-vi').style.display = showVi ? 'block' : 'none';
    $('#btn-toggle-bilingual').textContent = showVi ? '🇬🇧 Hide Vietnamese' : '🇻🇳 Show Vietnamese';
  }

  function toggleBilingual() {
    state.settings.bilingualMode = !state.settings.bilingualMode;
    state.bilingualUseCount = (state.bilingualUseCount || 0) + 1;
    if (state.bilingualUseCount >= 10 && !state.badges.includes('bilingual')) {
      state.badges.push('bilingual');
      showToast('🏆 New badge: Bilingual Brain!', 'success');
    }
    save();
    renderQuestion();
  }

  function listenQuestion() {
    const q = state.currentLesson?.questions[state.currentLesson.currentIndex];
    if (q) speak(q.questionEn, 'en-US');
  }

  function showHint() {
    const q = state.currentLesson?.questions[state.currentLesson.currentIndex];
    if (!q) return;
    hintUsed = true;
    $('#hint-text').textContent = '💡 ' + (q.hint || 'Think step by step!');
    $('#hint-text').style.display = 'block';
  }

  function submitAnswer() {
    const lesson = state.currentLesson;
    if (!lesson) return;

    const q = lesson.questions[lesson.currentIndex];
    const userAnswer = $('#answer-input').value.trim();
    if (!userAnswer) return showToast('Please enter an answer / Hãy nhập đáp án', 'error');

    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const result = Recommender.recordAttempt(state, q, userAnswer, timeSpent, hintUsed);
    lastResult = { ...result, question: q, userAnswer };
    save();

    /* Show new badge toasts */
    if (result.newBadges?.length) {
      result.newBadges.forEach(code => {
        const badge = BADGES.find(b => b.code === code);
        if (badge) showToast(`🏆 New badge: ${badge.name}!`, 'success');
      });
    }

    navigate('result');
    renderResult();
  }

  /* ===== RESULT ===== */

  function renderResult() {
    if (!lastResult) return;
    const { isCorrect, xpGained, question, userAnswer } = lastResult;

    if (isCorrect) {
      $('#result-icon').textContent = '✅';
      $('#result-title').textContent = 'AWESOME!';
      $('#result-title-vi').textContent = '(Tuyệt vời!)';
      $('#result-emoji').textContent = '🎉';
      $('#result-card').className = 'result-card correct rounded-3xl p-8 text-center shadow-lg';
      $('#result-xp').textContent = `+${xpGained} XP ⭐`;
      $('#result-comparison').style.display = 'none';
      celebrate();
    } else {
      $('#result-icon').textContent = '😅';
      $('#result-title').textContent = 'Almost there!';
      $('#result-title-vi').textContent = '(Gần đúng rồi!)';
      $('#result-emoji').textContent = '';
      $('#result-card').className = 'result-card incorrect rounded-3xl p-8 text-center shadow-lg';
      $('#result-xp').textContent = `Keep going!`;
      $('#result-comparison').innerHTML = `
        Your answer: <strong>${userAnswer}</strong><br>
        Correct answer: <strong>${question.answer}</strong>
      `;
      $('#result-comparison').style.display = 'block';
    }

    $('#result-explanation-en').textContent = '🇬🇧 ' + question.explanation.en;
    $('#result-explanation-vi').textContent = '🇻🇳 ' + question.explanation.vi;

    const lesson = state.currentLesson;
    const isLast = lesson.currentIndex + 1 >= lesson.questions.length;
    $('#btn-next-question').textContent = isLast ? '🏁 Finish Lesson' : '▶ Next Question';
  }

  function nextQuestion() {
    const lesson = state.currentLesson;
    lesson.currentIndex++;
    save();
    if (lesson.currentIndex >= lesson.questions.length) {
      finishLesson();
    } else {
      navigate('practice');
      renderQuestion();
    }
  }

  function finishLesson() {
    const lesson = state.currentLesson;
    /* Count correct from the most recent <length> attempts */
    const recent = state.attempts.slice(-lesson.questions.length);
    const correctCount = recent.filter(a => a.isCorrect).length;

    state.currentLesson = null;
    save();
    showToast(`🎊 Lesson complete! ${correctCount}/${lesson.questions.length} correct`, 'success');
    navigate('dashboard');
    renderDashboard();
    celebrate();
  }

  /* ===== SKILL MAP ===== */

  function renderSkillMap() {
    const grade = state.user?.grade || 2;
    const eligible = Recommender.getEligibleTopics(grade);
    const container = $('#skillmap-list');
    container.innerHTML = '';

    eligible.forEach(topic => {
      const skill = state.skillMap[topic];
      const tInfo = TOPICS[topic];
      let masteryColor = 'bg-red-400';
      if (skill.mastery >= 70) masteryColor = 'bg-green-400';
      else if (skill.mastery >= 30) masteryColor = 'bg-yellow-400';

      let status = '🆕 Not started yet';
      if (skill.attempts > 0) {
        if (skill.mastery >= 90) status = '⭐ Mastered!';
        else if (skill.mastery >= 70) status = '🟢 Strong';
        else if (skill.mastery >= 30) status = '🟡 Practicing';
        else status = '🔴 Need practice';
      }

      const card = document.createElement('div');
      card.className = 'bg-white rounded-2xl p-4 shadow';
      card.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <div>
            <div class="font-bold text-lg">${tInfo.emoji} ${tInfo.name}</div>
            <div class="text-sm text-gray-600">${tInfo.name_vi}</div>
          </div>
          <div class="text-right">
            <div class="font-bold">${Math.round(skill.mastery)}%</div>
            <div class="text-xs text-gray-500">${skill.correct}/${skill.attempts} correct</div>
          </div>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 mb-2 overflow-hidden">
          <div class="h-3 rounded-full mastery-bar ${masteryColor}" style="width: ${skill.mastery}%"></div>
        </div>
        <div class="text-sm">${status}</div>
      `;
      container.appendChild(card);
    });
  }

  /* ===== PROGRESS ===== */

  function renderProgress() {
    $('#progress-total-xp').textContent = state.progress.totalXP;
    $('#progress-streak').textContent = state.progress.streakDays;
    $('#progress-attempts').textContent = state.attempts.length;

    const correct = state.attempts.filter(a => a.isCorrect).length;
    const accuracy = state.attempts.length > 0
      ? Math.round((correct / state.attempts.length) * 100)
      : 0;
    $('#progress-accuracy').textContent = accuracy + '%';

    /* Last 7 days bar chart */
    const today = new Date();
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      const dayStart = d.getTime();
      const dayEnd = dayStart + 86400000;
      const dayAttempts = state.attempts.filter(a =>
        a.timestamp >= dayStart && a.timestamp < dayEnd
      ).length;
      last7.push({
        label: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
        count: dayAttempts
      });
    }

    const maxCount = Math.max(1, ...last7.map(d => d.count));
    const chart = $('#progress-chart');
    chart.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'flex items-end gap-1 h-32';
    last7.forEach(d => {
      const heightPct = (d.count / maxCount) * 100;
      const col = document.createElement('div');
      col.className = 'flex flex-col items-center flex-1';
      col.innerHTML = `
        <div class="text-xs mb-1 font-bold">${d.count}</div>
        <div class="w-full bg-green-400 rounded-t" style="height: ${Math.max(4, heightPct)}%; min-height: 4px;"></div>
        <div class="text-xs mt-1 text-gray-600">${d.label}</div>
      `;
      wrap.appendChild(col);
    });
    chart.appendChild(wrap);
  }

  /* ===== ACHIEVEMENTS ===== */

  function renderAchievements() {
    const container = $('#achievements-list');
    container.innerHTML = '';

    BADGES.forEach(badge => {
      const earned = state.badges.includes(badge.code);
      const card = document.createElement('div');
      card.className = `bg-white rounded-2xl p-4 shadow text-center ${earned ? '' : 'opacity-40'}`;
      card.innerHTML = `
        <div class="text-4xl mb-2">${earned ? badge.emoji : '🔒'}</div>
        <div class="font-bold text-sm">${earned ? badge.name : '???'}</div>
        <div class="text-xs text-gray-600 mt-1">${earned ? badge.desc : 'Keep playing to unlock'}</div>
      `;
      container.appendChild(card);
    });

    $('#achievements-count').textContent = `${state.badges.length} / ${BADGES.length}`;
  }

  /* ===== SETTINGS ===== */

  function renderSettings() {
    if (state.user) {
      $('#settings-nickname').textContent = state.user.nickname;
      $('#settings-age').textContent = state.user.age;
      $('#settings-grade').textContent = state.user.grade;
      $('#settings-avatar').textContent = state.user.avatar;
    }
  }

  /* Re-render on hash change so back/forward works */
  window.addEventListener('hashchange', () => {
    const page = window.location.hash.substring(1) || 'welcome';
    const renderers = {
      dashboard: renderDashboard,
      practice: renderQuestion,
      skillmap: renderSkillMap,
      progress: renderProgress,
      achievements: renderAchievements,
      settings: renderSettings
    };
    renderers[page]?.();
  });

  /* Boot */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
