(() => {
  'use strict';

  const SETS = {
    mockA: { label: 'Mock A', subtitle: '本番相当・100問', file: 'questions/mockA.json', time: 120 },
    mockB: { label: 'Mock B', subtitle: '本番より難しめ・100問', file: 'questions/mockB.json', time: 120 },
    challenge: { label: 'Challenge', subtitle: '難問・ひっかけ・30問', file: 'questions/challenge.json', time: 0 }
  };

  const DOMAIN_NAMES = {
    D1: 'Security Concepts and Practices', D2: 'Access Controls',
    D3: 'Risk Identification, Monitoring and Analysis', D4: 'Incident Response and Recovery',
    D5: 'Cryptography', D6: 'Network and Communications Security',
    D7: 'Systems and Application Security'
  };

  const state = {
    setKey: null, questions: [], index: 0, answers: [], flagged: [],
    submitted: [], startedAt: null, deadline: null, timerId: null,
    mode: 'home', loadError: null
  };

  const root = document.getElementById('app') || document.getElementById('content-area') || document.querySelector('main') || document.body;

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function injectFallbackStyles() {
    if (document.getElementById('sscp-app-styles')) return;
    const style = document.createElement('style');
    style.id = 'sscp-app-styles';
    style.textContent = `
      :root{--navy:#082b4c;--blue:#0b5f8a;--cyan:#17a6b6;--ink:#172433;--muted:#657384;--line:#d9e2ea;--bg:#f3f6f8;--ok:#16845b;--bad:#c83e4d;--gold:#e9a23b}
      *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Noto Sans JP",sans-serif}
      .sscp-shell{min-height:100vh}.sscp-header{background:linear-gradient(125deg,#061f38,#0a476d);color:#fff;padding:22px clamp(18px,4vw,52px);box-shadow:0 4px 16px #06213a35}
      .sscp-brand{font-size:1.4rem;font-weight:800;letter-spacing:.02em}.sscp-brand span{color:#63d4db}.sscp-header-row,.sscp-toolbar,.sscp-actions,.sscp-meta,.sscp-result-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
      .sscp-header-row{justify-content:space-between}.sscp-main{width:min(1080px,calc(100% - 28px));margin:28px auto 60px}.sscp-home-copy{text-align:center;margin:40px auto 28px;max-width:720px}
      .sscp-home-copy h1{color:var(--navy);font-size:clamp(1.8rem,4vw,3rem);margin:0 0 12px}.sscp-home-copy p{color:var(--muted);line-height:1.8}
      .sscp-set-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px}.sscp-set-card,.sscp-card{background:#fff;border:1px solid var(--line);border-radius:16px;box-shadow:0 8px 26px #12314b12}
      .sscp-set-card{padding:24px;cursor:pointer;text-align:left;transition:.18s transform,.18s box-shadow;border-top:5px solid var(--cyan)}.sscp-set-card:hover{transform:translateY(-3px);box-shadow:0 12px 30px #12314b24}.sscp-set-card h2{margin:0 0 5px;color:var(--navy)}
      .sscp-set-card p{color:var(--muted);margin:0 0 18px}.sscp-pill{display:inline-flex;border-radius:999px;padding:5px 10px;background:#e7f5f7;color:#08727d;font-size:.8rem;font-weight:700}
      .sscp-toolbar{justify-content:space-between;margin-bottom:14px}.sscp-progress-wrap{flex:1;min-width:220px}.sscp-progress{height:9px;background:#dce5eb;border-radius:99px;overflow:hidden}.sscp-progress>span{display:block;height:100%;background:linear-gradient(90deg,var(--blue),var(--cyan));transition:width .2s}
      .sscp-stat{font-size:.88rem;color:var(--muted);margin-top:6px}.sscp-timer{font-variant-numeric:tabular-nums;font-weight:800;color:var(--navy);background:#fff;border:1px solid var(--line);padding:9px 13px;border-radius:10px}.sscp-timer.warn{color:#a53b22;border-color:#e9a28f}
      .sscp-card{overflow:hidden}.sscp-question-head{background:linear-gradient(125deg,var(--navy),#0a4d70);color:#fff;padding:24px clamp(18px,4vw,38px)}.sscp-meta{font-size:.78rem;opacity:.92;margin-bottom:14px}.sscp-meta span{border:1px solid #ffffff45;border-radius:999px;padding:4px 9px}
      .sscp-question{font-size:clamp(1.05rem,2vw,1.28rem);line-height:1.8;font-weight:650;margin:0}.sscp-body{padding:clamp(18px,4vw,36px)}.sscp-options{display:grid;gap:12px}
      .sscp-option{width:100%;display:grid;grid-template-columns:42px 1fr;align-items:center;text-align:left;border:2px solid var(--line);background:#fff;border-radius:12px;padding:13px 15px;color:var(--ink);cursor:pointer;font:inherit;line-height:1.55;transition:.15s}.sscp-option:hover:not(:disabled){border-color:#78aebf;background:#f7fcfd}.sscp-option.selected{border-color:var(--blue);background:#eaf5fa}.sscp-option.correct{border-color:var(--ok);background:#ebf8f1}.sscp-option.incorrect{border-color:var(--bad);background:#fff0f1}.sscp-option:disabled{cursor:default}.sscp-letter{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#e8eef2;color:var(--navy);font-weight:800}.selected .sscp-letter{background:var(--blue);color:#fff}.correct .sscp-letter{background:var(--ok);color:#fff}.incorrect .sscp-letter{background:var(--bad);color:#fff}
      .sscp-feedback{margin-top:22px;border-radius:12px;padding:18px 20px;border-left:5px solid}.sscp-feedback.ok{background:#edf8f3;border-color:var(--ok)}.sscp-feedback.bad{background:#fff1f2;border-color:var(--bad)}.sscp-feedback h3{margin:0 0 8px}.sscp-feedback p{line-height:1.75;margin:7px 0}.sscp-hint{font-size:.9rem;color:var(--muted)}
      .sscp-actions{justify-content:space-between;margin-top:22px}.sscp-actions-left,.sscp-actions-right{display:flex;gap:10px;flex-wrap:wrap}.sscp-btn{border:0;border-radius:10px;padding:11px 18px;font:inherit;font-weight:750;cursor:pointer}.sscp-btn:disabled{opacity:.42;cursor:not-allowed}.sscp-btn-primary{background:var(--blue);color:#fff}.sscp-btn-primary:hover:not(:disabled){background:#084d71}.sscp-btn-secondary{background:#e7edf1;color:var(--navy)}.sscp-btn-flag{background:#fff4dd;color:#8b5700;border:1px solid #f1ce8c}.sscp-btn-flag.active{background:var(--gold);color:#332000}
      .sscp-result{padding:clamp(22px,5vw,48px);text-align:center}.sscp-score{font-size:clamp(3rem,9vw,6rem);font-weight:850;color:var(--navy);line-height:1}.sscp-score small{font-size:.28em;color:var(--muted)}.sscp-result h1{color:var(--navy)}.sscp-result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:28px 0;text-align:left}.sscp-result-item{background:#f5f8fa;border:1px solid var(--line);padding:15px;border-radius:10px}.sscp-result-item strong{display:block;font-size:1.4rem;color:var(--navy)}
      .sscp-review-list{margin-top:24px;text-align:left}.sscp-review-row{border:1px solid var(--line);border-radius:10px;margin:9px 0;padding:13px;background:#fff;cursor:pointer}.sscp-review-row.bad{border-left:5px solid var(--bad)}.sscp-review-row.ok{border-left:5px solid var(--ok)}.sscp-error{background:#fff1f2;border:1px solid #efaab1;color:#8d2630;padding:18px;border-radius:12px;line-height:1.7}
      @media(max-width:620px){.sscp-header{padding:16px}.sscp-main{width:min(100% - 18px,1080px);margin-top:16px}.sscp-question-head{padding:19px 17px}.sscp-body{padding:16px}.sscp-option{grid-template-columns:36px 1fr;padding:11px}.sscp-actions{align-items:stretch}.sscp-actions-left,.sscp-actions-right{width:100%}.sscp-actions-right .sscp-btn{flex:1}}
    `;
    document.head.appendChild(style);
  }

  async function loadSet(key) {
    const config = SETS[key];
    if (!config) return;
    clearTimer();
    state.loadError = null;
    root.innerHTML = shell('<div class="sscp-card sscp-result"><h2>問題を読み込んでいます…</h2></div>');
    try {
      const response = await fetch(config.file, { cache: 'no-store' });
      if (!response.ok) throw new Error(`${config.file} を読み込めませんでした（HTTP ${response.status}）`);
      const data = await response.json();
      validateQuestions(data, config.file);
      state.setKey = key; state.questions = data; state.index = 0;
      state.answers = Array(data.length).fill(null); state.flagged = Array(data.length).fill(false);
      state.submitted = Array(data.length).fill(false); state.startedAt = Date.now();
      state.deadline = config.time ? state.startedAt + config.time * 60_000 : null;
      state.mode = 'quiz';
      if (state.deadline) state.timerId = window.setInterval(updateTimer, 1000);
      renderQuiz();
    } catch (error) {
      state.loadError = error.message; state.mode = 'home'; renderHome();
    }
  }

  function validateQuestions(data, file) {
    if (!Array.isArray(data) || !data.length) throw new Error(`${file} に問題がありません。`);
    const ids = new Set();
    data.forEach((q, i) => {
      if (!q.id || ids.has(q.id)) throw new Error(`${file}: 問題 ${i + 1} のIDが不正または重複しています。`);
      ids.add(q.id);
      if (!q.question || !Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) {
        throw new Error(`${file}: ${q.id} の問題形式が不正です。`);
      }
    });
  }

  function shell(content) {
    return `<div class="sscp-shell"><header class="sscp-header"><div class="sscp-header-row"><div class="sscp-brand">ISC² <span>SSCP</span> Practice</div><div>${state.setKey && SETS[state.setKey] ? escapeHtml(SETS[state.setKey].label) : 'Exam Preparation'}</div></div></header><main class="sscp-main">${content}</main></div>`;
  }

  function renderHome() {
    const error = state.loadError ? `<div class="sscp-error"><strong>読み込みエラー</strong><br>${escapeHtml(state.loadError)}<br><small>Webサーバー経由で開き、JSONが questions/ に配置されているか確認してください。</small></div>` : '';
    const cards = Object.entries(SETS).map(([key, s]) => `<button class="sscp-set-card" data-set="${key}"><span class="sscp-pill">${key === 'challenge' ? '30 QUESTIONS' : '100 QUESTIONS'}</span><h2>${escapeHtml(s.label)}</h2><p>${escapeHtml(s.subtitle)}</p><strong>開始する →</strong></button>`).join('');
    root.innerHTML = shell(`${error}<section class="sscp-home-copy"><h1>SSCP Practice Exams</h1><p>知識の暗記だけでなく、BEST・FIRST・MOST・NEXTを判断する力を鍛えます。セットを選んで開始してください。</p></section><section class="sscp-set-grid">${cards}</section>`);
    root.querySelectorAll('[data-set]').forEach(el => el.addEventListener('click', () => loadSet(el.dataset.set)));
  }

  function renderQuiz() {
    const q = state.questions[state.index];
    const selected = state.answers[state.index];
    const submitted = state.submitted[state.index];
    const letters = ['A','B','C','D'];
    const options = q.options.map((option, i) => {
      let cls = 'sscp-option';
      if (selected === i) cls += ' selected';
      if (submitted && i === q.correctIndex) cls += ' correct';
      if (submitted && selected === i && i !== q.correctIndex) cls += ' incorrect';
      return `<button class="${cls}" data-option="${i}" ${submitted ? 'disabled' : ''}><span class="sscp-letter">${letters[i]}</span><span>${escapeHtml(option)}</span></button>`;
    }).join('');
    const feedback = submitted ? feedbackHtml(q, selected) : '';
    const answered = state.submitted.filter(Boolean).length;
    const content = `
      <div class="sscp-toolbar"><div class="sscp-progress-wrap"><div class="sscp-progress"><span style="width:${((state.index + 1) / state.questions.length) * 100}%"></span></div><div class="sscp-stat">問題 ${state.index + 1} / ${state.questions.length} ・ 解答済み ${answered}</div></div>${state.deadline ? '<div id="sscp-timer" class="sscp-timer">--:--</div>' : ''}</div>
      <article class="sscp-card"><header class="sscp-question-head"><div class="sscp-meta"><span>${escapeHtml(q.id)}</span><span>${escapeHtml(q.domain)} · ${escapeHtml(DOMAIN_NAMES[q.domain] || '')}</span><span>${escapeHtml(q.objective || '')}</span></div><p class="sscp-question">${escapeHtml(q.question)}</p></header><div class="sscp-body"><div class="sscp-options">${options}</div>${feedback}<div class="sscp-actions"><div class="sscp-actions-left"><button class="sscp-btn sscp-btn-secondary" data-action="home">セット選択</button><button class="sscp-btn sscp-btn-flag ${state.flagged[state.index] ? 'active' : ''}" data-action="flag">${state.flagged[state.index] ? '★ 見直し対象' : '☆ 見直す'}</button></div><div class="sscp-actions-right"><button class="sscp-btn sscp-btn-secondary" data-action="prev" ${state.index === 0 ? 'disabled' : ''}>前へ</button>${submitted ? `<button class="sscp-btn sscp-btn-primary" data-action="next">${state.index === state.questions.length - 1 ? '結果を見る' : '次の問題へ'}</button>` : '<button class="sscp-btn sscp-btn-primary" data-action="submit" '+(selected === null ? 'disabled' : '')+'>解答を確定</button>'}</div></div></div></article>`;
    root.innerHTML = shell(content);
    bindQuizEvents(); updateTimer();
  }

  function feedbackHtml(q, selected) {
    const correct = selected === q.correctIndex;
    return `<section class="sscp-feedback ${correct ? 'ok' : 'bad'}"><h3>${correct ? '✓ 正解' : '✕ 不正解'} — 正解 ${String.fromCharCode(65 + q.correctIndex)}</h3><p>${escapeHtml(q.rationale || q.explanation || '')}</p>${q.hint ? `<p class="sscp-hint"><strong>試験ヒント：</strong>${escapeHtml(q.hint)}</p>` : ''}</section>`;
  }

  function bindQuizEvents() {
    root.querySelectorAll('[data-option]').forEach(el => el.addEventListener('click', () => { state.answers[state.index] = Number(el.dataset.option); renderQuiz(); }));
    root.querySelectorAll('[data-action]').forEach(el => el.addEventListener('click', () => {
      const action = el.dataset.action;
      if (action === 'home') { if (confirm('現在の解答を終了してセット選択へ戻りますか？')) { clearTimer(); state.mode = 'home'; renderHome(); } }
      if (action === 'flag') { state.flagged[state.index] = !state.flagged[state.index]; renderQuiz(); }
      if (action === 'prev') { state.index--; renderQuiz(); }
      if (action === 'submit' && state.answers[state.index] !== null) { state.submitted[state.index] = true; renderQuiz(); }
      if (action === 'next') { if (state.index < state.questions.length - 1) { state.index++; renderQuiz(); } else finishExam(); }
    }));
  }

  function finishExam(force = false) {
    if (!force) {
      const unanswered = state.submitted.filter(v => !v).length;
      if (unanswered && !confirm(`未確定の問題が ${unanswered} 問あります。結果を表示しますか？`)) return;
    }
    clearTimer(); state.mode = 'result'; renderResult();
  }

  function renderResult() {
    const total = state.questions.length;
    const correct = state.questions.reduce((n, q, i) => n + (state.submitted[i] && state.answers[i] === q.correctIndex ? 1 : 0), 0);
    const rate = Math.round(correct / total * 100);
    const domains = {};
    state.questions.forEach((q, i) => { const d = domains[q.domain] ||= { total: 0, correct: 0 }; d.total++; if (state.submitted[i] && state.answers[i] === q.correctIndex) d.correct++; });
    const domainHtml = Object.entries(domains).map(([key, d]) => `<div class="sscp-result-item"><span>${key}</span><strong>${Math.round(d.correct / d.total * 100)}%</strong><small>${d.correct} / ${d.total}</small></div>`).join('');
    const rows = state.questions.map((q, i) => { const ok = state.submitted[i] && state.answers[i] === q.correctIndex; return `<div class="sscp-review-row ${ok ? 'ok' : 'bad'}" data-review="${i}"><strong>${escapeHtml(q.id)} ${ok ? '✓' : '✕'}</strong> ${escapeHtml(q.question)}</div>`; }).join('');
    root.innerHTML = shell(`<section class="sscp-card sscp-result"><span class="sscp-pill">${escapeHtml(SETS[state.setKey].label)}</span><h1>${rate >= 70 ? 'よくできました' : '復習して再挑戦しましょう'}</h1><div class="sscp-score">${rate}<small>%</small></div><p>${correct} / ${total} 問正解</p><div class="sscp-result-grid">${domainHtml}</div><div class="sscp-result-actions"><button class="sscp-btn sscp-btn-primary" data-result="retry">もう一度挑戦</button><button class="sscp-btn sscp-btn-secondary" data-result="home">セット選択</button></div><div class="sscp-review-list"><h2>問題別レビュー</h2>${rows}</div></section>`);
    root.querySelector('[data-result="retry"]').addEventListener('click', () => loadSet(state.setKey));
    root.querySelector('[data-result="home"]').addEventListener('click', () => { state.setKey = null; state.mode = 'home'; renderHome(); });
    root.querySelectorAll('[data-review]').forEach(el => el.addEventListener('click', () => { state.index = Number(el.dataset.review); state.mode = 'quiz'; renderQuiz(); }));
  }

  function updateTimer() {
    if (!state.deadline) return;
    const remaining = Math.max(0, state.deadline - Date.now());
    const el = document.getElementById('sscp-timer');
    if (el) {
      const minutes = Math.floor(remaining / 60_000); const seconds = Math.floor((remaining % 60_000) / 1000);
      el.textContent = `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;
      el.classList.toggle('warn', remaining <= 10 * 60_000);
    }
    if (remaining === 0 && state.mode === 'quiz') finishExam(true);
  }

  function clearTimer() { if (state.timerId) window.clearInterval(state.timerId); state.timerId = null; }

  injectFallbackStyles();
  renderHome();
})();
