// グローバル変数
let ALL_QUESTIONS = [];
const CATEGORIES = [
    "すべて",
    "D1: セキュリティの運用と管理",
    "D2: アクセス制御",
    "D3: リスクの識別、監視、分析",
    "D4: インシデント対応と復旧",
    "D5: 暗号化",
    "D6: ネットワークと通信のセキュリティ",
    "D7: システムとアプリケーションのセキュリティ",
    "ドメイン統合問題",
    "本番レベル（難易度：高）"
];

let currentCategory = "すべて";
let filteredQuestions = [];
let currentIndex = 0;
let score = 0;
let selectedOption = null;
let isAnswered = false;
let showHint = false;

// DOM要素
const categoryListEl = document.getElementById("category-list");
const contentAreaEl = document.getElementById("content-area");

// 1. アプリの初期化 (JSONのフェッチ)
async function initApp() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        ALL_QUESTIONS = await response.json();
        
        // 読み込み成功したら描画開始
        renderSidebar();
        filterQuestions();
        renderQuestion();
    } catch (error) {
        console.error('問題データの読み込みに失敗しました:', error);
        contentAreaEl.innerHTML = `
            <div class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center shadow-sm">
                <i data-lucide="alert-circle" class="w-12 h-12 mx-auto mb-4 text-red-500"></i>
                <h3 class="text-lg font-bold mb-2">データの読み込みに失敗しました</h3>
                <p>questions.json が正しく配置されているか確認してください。</p>
            </div>
        `;
        lucide.createIcons();
    }
}

// 2. サイドバー描画
function renderSidebar() {
    categoryListEl.innerHTML = CATEGORIES.map(cat => `
        <button 
            onclick="selectCategory('${cat}')"
            class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                currentCategory === cat 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'hover:bg-slate-800 text-slate-300'
            }"
        >
            <span class="truncate">${cat}</span>
        </button>
    `).join('');
}

// カテゴリ選択処理
window.selectCategory = function(cat) {
    currentCategory = cat;
    renderSidebar();
    filterQuestions();
    resetQuiz();
}

// フィルタリング処理
function filterQuestions() {
    if (currentCategory === "すべて") {
        filteredQuestions = [...ALL_QUESTIONS];
    } else {
        filteredQuestions = ALL_QUESTIONS.filter(q => q.domain === currentCategory);
    }
}

// クイズのリセット
window.resetQuiz = function() {
    currentIndex = 0;
    score = 0;
    selectedOption = null;
    isAnswered = false;
    showHint = false;
    renderQuestion();
}

// 3. 回答処理
window.handleAnswer = function(index) {
    if (isAnswered) return;
    selectedOption = index;
    isAnswered = true;
    if (index === filteredQuestions[currentIndex].correctIndex) {
        score++;
    }
    renderQuestion();
}

// 4. 次の問題へ
window.nextQuestion = function() {
    if (currentIndex < filteredQuestions.length - 1) {
        currentIndex++;
        selectedOption = null;
        isAnswered = false;
        showHint = false;
        renderQuestion();
    } else {
        renderResult();
    }
}

// 5. ヒント切り替え
window.toggleHint = function() {
    showHint = !showHint;
    renderQuestion();
}

// 6. 問題画面描画ロジック
function renderQuestion() {
    if (filteredQuestions.length === 0) {
        contentAreaEl.innerHTML = `
            <div class="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center fade-in">
                <p class="text-slate-600 font-medium">このカテゴリにはまだ問題が登録されていません。</p>
            </div>
        `;
        return;
    }

    const q = filteredQuestions[currentIndex];

    contentAreaEl.innerHTML = `
        <div class="space-y-6 fade-in">
            <div class="flex justify-between items-end">
                <div>
                    <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        ${q.domain}
                    </span>
                    <h2 class="text-2xl font-bold mt-2">問題 ${currentIndex + 1} <span class="text-slate-400 text-lg font-normal">/ ${filteredQuestions.length}</span></h2>
                </div>
                <div class="text-right">
                    <p class="text-xs text-slate-500 font-medium uppercase">現在の正解数</p>
                    <p class="text-xl font-bold text-blue-600">${score}</p>
                </div>
            </div>

            <div class="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
                <p class="text-lg md:text-xl font-medium leading-relaxed text-slate-800 mb-8">
                    ${q.question}
                </p>

                <div class="grid gap-4">
                    ${q.options.map((opt, idx) => {
                        let styleClass = "border-slate-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer";
                        if (isAnswered) {
                            styleClass = styleClass.replace("cursor-pointer", "cursor-default");
                            if (idx === q.correctIndex) {
                                styleClass = "border-emerald-500 bg-emerald-50 text-emerald-900";
                            } else if (selectedOption === idx) {
                                styleClass = "border-rose-500 bg-rose-50 text-rose-900";
                            } else {
                                styleClass = "border-slate-100 opacity-50";
                            }
                        }
                        return `
                            <button
                                onclick="handleAnswer(${idx})"
                                ${isAnswered ? 'disabled' : ''}
                                class="w-full text-left p-5 rounded-xl border-2 transition-all flex items-start space-x-4 ${styleClass}"
                            >
                                <div class="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 font-bold text-xs ${
                                    isAnswered && idx === q.correctIndex ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300'
                                }">
                                    ${String.fromCharCode(65 + idx)}
                                </div>
                                <span class="font-medium">${opt}</span>
                            </button>
                        `;
                    }).join('')}
                </div>

                ${isAnswered ? `
                    <div class="mt-8 p-6 bg-slate-900 text-slate-200 rounded-xl space-y-3 fade-in">
                        <div class="flex items-center space-x-2 text-blue-400 font-bold text-sm">
                            <i data-lucide="info" class="w-5 h-5"></i>
                            <span>解説 (Rationale)</span>
                        </div>
                        <p class="leading-relaxed text-slate-300">${q.rationale}</p>
                        <button 
                            onclick="nextQuestion()"
                            class="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors flex items-center justify-center space-x-2"
                        >
                            <span>${currentIndex < filteredQuestions.length - 1 ? '次の問題へ' : '結果を見る'}</span>
                        </button>
                    </div>
                ` : ''}

                ${!isAnswered ? `
                    <div class="mt-6 flex justify-center">
                        <button 
                            onclick="toggleHint()"
                            class="text-sm text-slate-500 hover:text-blue-600 font-medium flex items-center space-x-1"
                        >
                            <span>${showHint ? 'ヒントを隠す' : 'ヒントを表示'}</span>
                        </button>
                    </div>
                ` : ''}

                ${showHint && !isAnswered ? `
                    <div class="mt-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm italic fade-in">
                        💡 ${q.hint}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    lucide.createIcons();
}

// 7. 結果画面描画
function renderResult() {
    const percentage = Math.round((score / filteredQuestions.length) * 100);
    contentAreaEl.innerHTML = `
        <div class="bg-white border border-slate-200 rounded-3xl p-10 shadow-xl text-center space-y-8 fade-in">
            <div class="inline-flex p-5 bg-blue-100 rounded-full text-blue-600 mb-2">
                <i data-lucide="trophy" class="w-16 h-16"></i>
            </div>
            <h2 class="text-3xl font-extrabold text-slate-900">お疲れ様でした！</h2>
            <div class="flex justify-center space-x-10">
                <div class="text-center">
                    <p class="text-slate-500 text-sm uppercase font-bold tracking-widest mb-1">正解率</p>
                    <p class="text-5xl font-black text-blue-600">${percentage}%</p>
                </div>
                <div class="text-center">
                    <p class="text-slate-500 text-sm uppercase font-bold tracking-widest mb-1">正解数</p>
                    <p class="text-5xl font-black text-slate-800">${score} / ${filteredQuestions.length}</p>
                </div>
            </div>
            <p class="text-slate-600 max-w-md mx-auto leading-relaxed">
                ${percentage >= 70 
                    ? "素晴らしい成績です！合格基準（70%）を達成しています。" 
                    : "復習が必要です。解説をしっかりと確認して再挑戦しましょう！"}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button 
                    onclick="resetQuiz()"
                    class="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all"
                >
                    もう一度挑戦する
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
}

// 起動
document.addEventListener('DOMContentLoaded', initApp);
