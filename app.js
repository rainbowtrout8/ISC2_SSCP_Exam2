(() => {
  "use strict";

  const QUESTION_FILES = {
    D1: "questions/d1.json",
    D2: "questions/d2.json",
    D3: "questions/d3.json",
    D4: "questions/d4.json"
  };

  const DOMAINS = {
    D1: "セキュリティの概念と実践",
    D2: "アクセス制御",
    D3: "リスクの識別・監視・分析",
    D4: "インシデント対応と復旧",
    D5: "暗号化",
    D6: "ネットワークと通信のセキュリティ",
    D7: "システムとアプリケーションのセキュリティ"
  };

  const state = {
    domain: "D1",
    cache: {},
    source: [],
    questions: [],
    answers: [],
    index: 0,
    finished: false
  };

  let categories;
  let content;

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    categories = document.querySelector("#category-list");
    content = document.querySelector("#content-area");

    if (!categories || !content) {
      console.error("#category-list または #content-area が見つかりません。");
      return;
    }

    renderCategories();
    await loadDomain("D1");
  }

  function renderCategories() {
    categories.replaceChildren();

    Object.entries(DOMAINS).forEach(([code, name]) => {
      const available = Boolean(QUESTION_FILES[code]);
      const button = node("button", {
        className: `category-button ${code === state.domain ? "active" : ""}`,
        disabled: !available,
        type: "button",
        "aria-current": code === state.domain ? "page" : "false"
      }, [
        node("span", { className: "category-code", textContent: code }),
        node("span", { textContent: name }),
        !available ? node("span", { className: "soon", textContent: "Soon" }) : null
      ]);

      if (available) {
        button.addEventListener("click", () => loadDomain(code));
      }

      categories.append(button);
    });
  }

  async function loadDomain(domain) {
    if (!QUESTION_FILES[domain]) return;

    state.domain = domain;
    renderCategories();
    renderStatus(`${domain}の問題を読み込んでいます`, "しばらくお待ちください。");

    try {
      if (!state.cache[domain]) {
        const response = await fetch(QUESTION_FILES[domain], { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("問題データの形式が正しくありません。");

        const valid = data.filter(isValidQuestion).slice(0, 50);
        if (!valid.length) throw new Error("有効な問題がありません。");
        state.cache[domain] = clone(valid);
      }

      state.source = clone(state.cache[domain]);
      start(state.source);
    } catch (error) {
      renderError(error, domain);
    }
  }

  function isValidQuestion(question) {
    return question
      && typeof question.question === "string"
      && Array.isArray(question.options)
      && question.options.length === 4
      && Number.isInteger(question.correctIndex)
      && question.correctIndex >= 0
      && question.correctIndex < 4;
  }

  function start(questions) {
    state.questions = clone(questions);
    state.answers = new Array(questions.length).fill(null);
    state.index = 0;
    state.finished = false;
    render();
  }

  function render() {
    if (state.finished) {
      renderResults();
      return;
    }

    const question = state.questions[state.index];
    const selected = state.answers[state.index];
    const answered = selected !== null;
    const score = getStats();
    const shell = node("div", { className: "quiz-shell" });

    shell.append(node("div", { className: "session-bar" }, [
      node("div", { className: "counter" }, [
        document.createTextNode("QUESTION "),
        node("b", { textContent: String(state.index + 1) }),
        document.createTextNode(` / ${state.questions.length}`)
      ]),
      node("div", { className: "progress" }, [
        node("div", {
          className: "progress-fill",
          style: `width:${state.questions.length ? (score.answered / state.questions.length) * 100 : 0}%`
        })
      ]),
      node("div", {
        className: "score-mini",
        textContent: `回答 ${score.answered}　正解 ${score.correct}`
      })
    ]));

    const card = node("article", { className: "question-card" });
    const metadata = [
      question.id || `${state.domain}-${String(state.index + 1).padStart(3, "0")}`,
      question.objective || `Domain ${state.domain.slice(1)}`
    ].filter(Boolean);

    card.append(node("header", { className: "question-head" }, [
      node("div", { className: "meta-row" }, metadata.map(text =>
        node("span", { className: "meta-chip", textContent: text })
      )),
      node("h2", { className: "question-text", textContent: question.question })
    ]));

    const answerArea = node("div", { className: "answer-area" }, [
      node("p", {
        className: "answer-label",
        textContent: "最も適切な回答を1つ選択してください"
      })
    ]);

    const optionList = node("div", {
      className: "options-list",
      role: "group",
      "aria-label": "選択肢"
    });

    question.options.forEach((text, index) => {
      const icon = answered && index === question.correctIndex
        ? "✓"
        : answered && index === selected ? "×" : "";

      const button = node("button", {
        className: optionClass(index, selected, question.correctIndex),
        type: "button",
        disabled: answered
      }, [
        node("span", { className: "option-letter", textContent: String.fromCharCode(65 + index) }),
        node("span", { textContent: text }),
        node("span", { className: "state-icon", textContent: icon })
      ]);

      button.addEventListener("click", () => {
        if (state.answers[state.index] === null) {
          state.answers[state.index] = index;
          render();
        }
      });
      optionList.append(button);
    });

    answerArea.append(optionList);
    if (answered) answerArea.append(buildFeedback(question, selected));
    answerArea.append(buildNavigation());
    card.append(answerArea);
    shell.append(card);
    content.replaceChildren(shell);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function optionClass(index, selected, correct) {
    if (selected === null) return "option-button";
    if (index === correct) return "option-button correct";
    if (index === selected) return "option-button incorrect";
    return "option-button muted";
  }

  function buildFeedback(question, selected) {
    const isCorrect = selected === question.correctIndex;
    const feedback = node("section", {
      className: `feedback ${isCorrect ? "is-correct" : "is-incorrect"}`
    });

    feedback.append(node("div", { className: "feedback-title" }, [
      node("strong", { textContent: isCorrect ? "✓ 正解" : "× 不正解" }),
      !isCorrect ? node("span", {
        textContent: `正解は ${String.fromCharCode(65 + question.correctIndex)} です`
      }) : null
    ]));

    const body = node("div", { className: "feedback-body" });
    const explanation = typeof question.rationale === "string"
      ? question.rationale
      : typeof question.explanation === "string"
        ? question.explanation
        : question.explanation?.correct || "";

    if (explanation) body.append(node("p", { textContent: explanation }));
    if (question.hint) {
      body.append(node("div", { className: "hint-box" }, [
        node("strong", { textContent: "EXAM TIP　" }),
        document.createTextNode(question.hint)
      ]));
    }
    feedback.append(body);
    return feedback;
  }

  function buildNavigation() {
    const previous = node("button", {
      className: "btn btn-secondary",
      type: "button",
      disabled: state.index === 0,
      textContent: "← 前の問題"
    });
    previous.addEventListener("click", () => {
      state.index -= 1;
      render();
    });

    const isLast = state.index === state.questions.length - 1;
    const next = node("button", {
      className: "btn btn-primary",
      type: "button",
      textContent: isLast ? "結果を見る" : "次の問題 →"
    });
    next.addEventListener("click", () => {
      if (isLast) state.finished = true;
      else state.index += 1;
      render();
    });

    return node("div", { className: "navigation" }, [previous, next]);
  }

  function renderResults() {
    const score = getStats();
    const percentage = state.questions.length
      ? Math.round((score.correct / state.questions.length) * 100)
      : 0;

    const review = makeButton("回答を見直す", "btn btn-secondary", () => {
      state.finished = false;
      state.index = 0;
      render();
    });
    const retry = makeButton("もう一度挑戦", "btn btn-secondary", () => start(state.source));
    const shuffle = makeButton("シャッフルして挑戦", "btn btn-primary", () =>
      start(shuffled(clone(state.source)))
    );

    content.replaceChildren(node("section", { className: "result-card" }, [
      node("p", { className: "result-kicker", textContent: `${state.domain} RESULT` }),
      node("div", { className: "result-score", textContent: `${percentage}%` }),
      node("h2", { textContent: `${state.questions.length}問中 ${score.correct}問正解` }),
      node("p", { textContent: resultMessage(percentage) }),
      node("div", { className: "result-actions" }, [review, retry, shuffle])
    ]));
  }

  function resultMessage(percentage) {
    if (percentage >= 85) return "十分な理解度です。迷った問題の判断根拠を確認しましょう。";
    if (percentage >= 70) return "合格圏を意識できる水準です。誤答を中心に復習しましょう。";
    return "解説を確認し、同じセットへ再挑戦しましょう。";
  }

  function getStats() {
    let answered = 0;
    let correct = 0;
    state.answers.forEach((answer, index) => {
      if (answer !== null) {
        answered += 1;
        if (answer === state.questions[index].correctIndex) correct += 1;
      }
    });
    return { answered, correct };
  }

  function renderStatus(title, message) {
    content.replaceChildren(node("div", { className: "loading-panel" }, [
      node("span", { className: "spinner" }),
      node("div", {}, [
        node("strong", { textContent: title }),
        node("p", { textContent: message })
      ])
    ]));
  }

  function renderError(error, domain) {
    content.replaceChildren(node("section", { className: "status-panel error-panel" }, [
      node("h2", { textContent: `${domain}の問題を読み込めませんでした` }),
      node("p", { textContent: `${QUESTION_FILES[domain]} の配置と内容を確認してください。` }),
      node("p", { className: "error-detail", textContent: error.message }),
      makeButton("再読み込み", "btn btn-primary", () => loadDomain(domain))
    ]));
  }

  function makeButton(text, className, handler) {
    const button = node("button", { className, type: "button", textContent: text });
    button.addEventListener("click", handler);
    return button;
  }

  function shuffled(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [items[index], items[target]] = [items[target], items[index]];
    }
    return items;
  }

  function clone(value) {
    return typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));
  }

  function node(tag, properties = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(properties).forEach(([key, value]) => {
      if (key === "className") element.className = value;
      else if (key === "textContent") element.textContent = value;
      else if (key === "style") element.setAttribute("style", value);
      else if (key in element && !key.startsWith("aria-")) element[key] = value;
      else element.setAttribute(key, value);
    });
    (Array.isArray(children) ? children : [children])
      .filter(Boolean)
      .forEach(child => element.append(child));
    return element;
  }
})();
