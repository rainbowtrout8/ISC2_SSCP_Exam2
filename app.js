/**
 * ISC2 SSCP Practice App
 * Single-file application controller
 *
 * Required elements:
 *   #category-list
 *   #content-area
 *
 * Question source:
 *   questions/d1.json
 */

(() => {
  "use strict";

  const QUESTION_URL = "questions/d1.json";
  const DOMAIN_LABELS = {
    D1: "D1 セキュリティの概念と実践",
    D2: "D2 アクセス制御",
    D3: "D3 リスクの識別・監視・分析",
    D4: "D4 インシデント対応と復旧",
    D5: "D5 暗号化",
    D6: "D6 ネットワークと通信のセキュリティ",
    D7: "D7 システムとアプリケーションのセキュリティ"
  };

  const state = {
    sourceQuestions: [],
    questions: [],
    answers: [],
    currentIndex: 0,
    finished: false,
    loading: false,
    loadError: null
  };

  let categoryList;
  let contentArea;

  document.addEventListener("DOMContentLoaded", init);

  async function init() {
    categoryList = document.getElementById("category-list");
    contentArea = document.getElementById("content-area");

    if (!categoryList || !contentArea) {
      console.error("Required elements #category-list and #content-area were not found.");
      return;
    }

    renderCategories();
    await loadD1();
  }

  function renderCategories() {
    categoryList.replaceChildren();

    Object.entries(DOMAIN_LABELS).forEach(([domain, label]) => {
      const button = el("button", {
        type: "button",
        className: `category-button${domain === "D1" ? " active" : " disabled"}`,
        disabled: domain !== "D1",
        "aria-disabled": String(domain !== "D1")
      });

      button.append(document.createTextNode(label));

      if (domain !== "D1") {
        button.append(el("span", { className: "soon-badge", textContent: "Soon" }));
      } else {
        button.addEventListener("click", () => {
          if (state.sourceQuestions.length > 0) restart(false);
        });
      }

      categoryList.append(button);
    });
  }

  async function loadD1() {
    state.loading = true;
    state.loadError = null;
    renderLoading();

    try {
      const response = await fetch(QUESTION_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error("JSONのルート要素が配列ではありません。");
      }

      const validQuestions = data.filter(isValidQuestion).slice(0, 50);
      if (validQuestions.length === 0) {
        throw new Error("有効な問題が見つかりませんでした。");
      }

      state.sourceQuestions = clone(validQuestions);
      startSession(clone(validQuestions));
    } catch (error) {
      state.loadError = error;
      renderLoadError(error);
    } finally {
      state.loading = false;
    }
  }

  function isValidQuestion(question, index) {
    const valid = question
      && typeof question.question === "string"
      && Array.isArray(question.options)
      && question.options.length === 4
      && Number.isInteger(question.correctIndex)
      && question.correctIndex >= 0
      && question.correctIndex < 4;

    if (!valid) console.warn(`Invalid question skipped at index ${index}`, question);
    return valid;
  }

  function startSession(questions) {
    state.questions = questions;
    state.answers = new Array(questions.length).fill(null);
    state.currentIndex = 0;
    state.finished = false;
    renderQuestion();
  }

  function restart(shuffle) {
    const questions = clone(state.sourceQuestions);
    startSession(shuffle ? fisherYates(questions) : questions);
  }

  function renderLoading() {
    contentArea.replaceChildren(
      el("section", { className: "status-panel" }, [
        el("h2", { textContent: "D1問題を読み込んでいます" }),
        el("p", { textContent: "しばらくお待ちください。" })
      ])
    );
  }

  function renderLoadError(error) {
    const retry = el("button", {
      type: "button",
      className: "primary-button",
      textContent: "再読み込み"
    });
    retry.addEventListener("click", loadD1);

    contentArea.replaceChildren(
      el("section", { className: "status-panel error-panel" }, [
        el("h2", { textContent: "問題を読み込めませんでした" }),
        el("p", { textContent: `${QUESTION_URL} を確認してください。` }),
        el("p", { className: "error-detail", textContent: error.message }),
        retry
      ])
    );
  }

  function renderQuestion() {
    if (state.finished) {
      renderResults();
      return;
    }

    const question = state.questions[state.currentIndex];
    const selectedIndex = state.answers[state.currentIndex];
    const answered = selectedIndex !== null;
    const stats = getStats();

    const header = el("div", { className: "quiz-header" }, [
      el("div", { className: "question-position", textContent: `問題 ${state.currentIndex + 1} / ${state.questions.length}` }),
      el("div", { className: "score-status", textContent: `回答済み ${stats.answered} / 正解 ${stats.correct}` })
    ]);

    const progress = el("div", {
      className: "progress-track",
      role: "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": String(state.questions.length),
      "aria-valuenow": String(stats.answered)
    }, [
      el("div", {
        className: "progress-fill",
        style: `width:${(stats.answered / state.questions.length) * 100}%`
      })
    ]);

    const metaParts = [question.id, question.objective].filter(Boolean);
    const meta = el("div", { className: "question-meta", textContent: metaParts.join(" · ") });
    const title = el("h2", { className: "question-text", textContent: question.question });
    const options = el("div", { className: "options-list", role: "group", "aria-label": "選択肢" });

    question.options.forEach((option, index) => {
      const optionButton = el("button", {
        type: "button",
        className: optionClass(index, selectedIndex, question.correctIndex),
        disabled: answered
      }, [
        el("span", { className: "option-letter", textContent: String.fromCharCode(65 + index) }),
        el("span", { className: "option-text", textContent: option })
      ]);
      optionButton.addEventListener("click", () => selectAnswer(index));
      options.append(optionButton);
    });

    const cardChildren = [header, progress, meta, title, options];
    if (answered) cardChildren.push(buildFeedback(question, selectedIndex));
    cardChildren.push(buildNavigation());

    contentArea.replaceChildren(el("section", { className: "quiz-card" }, cardChildren));
  }

  function optionClass(index, selectedIndex, correctIndex) {
    let className = "option-button";
    if (selectedIndex === null) return className;
    if (index === correctIndex) return `${className} correct`;
    if (index === selectedIndex) return `${className} incorrect`;
    return `${className} muted`;
  }

  function selectAnswer(index) {
    if (state.answers[state.currentIndex] !== null) return;
    state.answers[state.currentIndex] = index;
    renderQuestion();
  }

  function buildFeedback(question, selectedIndex) {
    const isCorrect = selectedIndex === question.correctIndex;
    const explanation = getExplanation(question);
    const feedback = el("div", {
      className: `answer-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`
    });

    feedback.append(
      el("h3", { textContent: isCorrect ? "正解です" : `不正解です（正解: ${String.fromCharCode(65 + question.correctIndex)}）` })
    );

    if (explanation) {
      feedback.append(el("p", { className: "rationale", textContent: explanation }));
    }

    if (question.hint) {
      feedback.append(
        el("div", { className: "hint-box" }, [
          el("strong", { textContent: "Exam Hint: " }),
          document.createTextNode(question.hint)
        ])
      );
    }

    return feedback;
  }

  function getExplanation(question) {
    if (typeof question.rationale === "string") return question.rationale;
    if (typeof question.explanation === "string") return question.explanation;
    if (question.explanation && typeof question.explanation.correct === "string") {
      return question.explanation.correct;
    }
    return "";
  }

  function buildNavigation() {
    const previous = el("button", {
      type: "button",
      className: "secondary-button",
      textContent: "前へ",
      disabled: state.currentIndex === 0
    });
    previous.addEventListener("click", () => {
      state.currentIndex -= 1;
      renderQuestion();
    });

    const isLast = state.currentIndex === state.questions.length - 1;
    const next = el("button", {
      type: "button",
      className: "primary-button",
      textContent: isLast ? "結果を見る" : "次へ"
    });
    next.addEventListener("click", () => {
      if (isLast) {
        state.finished = true;
      } else {
        state.currentIndex += 1;
      }
      renderQuestion();
    });

    return el("div", { className: "quiz-navigation" }, [previous, next]);
  }

  function renderResults() {
    const stats = getStats();
    const percentage = state.questions.length
      ? Math.round((stats.correct / state.questions.length) * 100)
      : 0;

    const retry = el("button", {
      type: "button",
      className: "secondary-button",
      textContent: "再挑戦"
    });
    retry.addEventListener("click", () => restart(false));

    const shuffledRetry = el("button", {
      type: "button",
      className: "primary-button",
      textContent: "シャッフル再挑戦"
    });
    shuffledRetry.addEventListener("click", () => restart(true));

    const review = el("button", {
      type: "button",
      className: "secondary-button",
      textContent: "問題を見直す"
    });
    review.addEventListener("click", () => {
      state.finished = false;
      state.currentIndex = 0;
      renderQuestion();
    });

    contentArea.replaceChildren(
      el("section", { className: "result-card" }, [
        el("p", { className: "result-eyebrow", textContent: "D1 演習結果" }),
        el("h2", { textContent: `${percentage}%` }),
        el("p", { className: "result-score", textContent: `${state.questions.length}問中 ${stats.correct}問正解` }),
        el("p", {
          className: "result-message",
          textContent: resultMessage(percentage, stats.answered)
        }),
        el("div", { className: "result-actions" }, [review, retry, shuffledRetry])
      ])
    );
  }

  function resultMessage(percentage, answered) {
    if (answered < state.questions.length) {
      return `未回答が${state.questions.length - answered}問あります。見直しで回答できます。`;
    }
    if (percentage >= 85) return "良い仕上がりです。誤答の判断根拠を確認しましょう。";
    if (percentage >= 70) return "合格圏を意識できる水準です。迷った問題を重点的に復習しましょう。";
    return "解説を確認し、同じセットへ再挑戦しましょう。";
  }

  function getStats() {
    let answered = 0;
    let correct = 0;

    state.answers.forEach((answer, index) => {
      if (answer === null) return;
      answered += 1;
      if (answer === state.questions[index].correctIndex) correct += 1;
    });

    return { answered, correct };
  }

  function fisherYates(items) {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function clone(value) {
    if (typeof structuredClone === "function") return structuredClone(value);
    return JSON.parse(JSON.stringify(value));
  }

  function el(tagName, properties = {}, children = []) {
    const element = document.createElement(tagName);

    Object.entries(properties).forEach(([key, value]) => {
      if (key === "className") {
        element.className = value;
      } else if (key === "textContent") {
        element.textContent = value;
      } else if (key === "style") {
        element.setAttribute("style", value);
      } else if (key in element && !key.startsWith("aria-")) {
        element[key] = value;
      } else {
        element.setAttribute(key, value);
      }
    });

    const childList = Array.isArray(children) ? children : [children];
    childList.filter(Boolean).forEach(child => element.append(child));
    return element;
  }
})();
