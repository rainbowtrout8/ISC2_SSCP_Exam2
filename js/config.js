/**
 * ISC2 SSCP Exam Simulator
 * config.js
 * Version: 2.0.0
 *
 * アプリケーション全体で使用する設定を管理する。
 * ビジネスロジックは持たず、設定値のみ定義する。
 */

export const APP_CONFIG = Object.freeze({

    app: {
        name: "ISC² SSCP Practice Exam",
        shortName: "SSCP Exam",
        version: "2.0.0",
        language: "ja",
        cbkVersion: "2024"
    },

    exam: {

        // ドメイン学習時の問題数
        defaultQuestionCount: 50,

        // 模試問題数
        mockQuestionCount: 100,

        // 制限時間（分）
        timeLimitMinutes: 240,

        // 合格ライン（表示用）
        passingScore: 700,

        // 問題シャッフル
        shuffleQuestions: true,

        // 選択肢シャッフル
        shuffleOptions: true,

        // 問題終了後に答えを表示
        showAnswerImmediately: false,

        // レビューを許可
        enableReview: true
    },

    ui: {

        theme: "auto",

        showProgressBar: true,

        showQuestionNumber: true,

        showTimer: true,

        showDomainName: true,

        showDifficulty: false,

        showExamTip: true,

        animation: true
    },

    storage: {

        bookmarkKey: "sscp-bookmarks",

        historyKey: "sscp-history",

        settingsKey: "sscp-settings",

        statisticsKey: "sscp-statistics"
    },

    questions: {

        // 開発時はドメイン毎にロード
        basePath: "./questions/",

        // ドメインファイル
        files: {

            D1: "d1.json",
            D2: "d2.json",
            D3: "d3.json",
            D4: "d4.json",
            D5: "d5.json",
            D6: "d6.json",
            D7: "d7.json",

            MOCK_A: "mockA.json",
            MOCK_B: "mockB.json"

        }

    },

    domains: {

        D1: "Security Concepts and Organizational Operations",

        D2: "Access Controls",

        D3: "Risk Identification, Monitoring and Analysis",

        D4: "Incident Response and Recovery",

        D5: "Cryptography",

        D6: "Network and Communications Security",

        D7: "Systems and Application Security"

    },

    difficulty: {

        EASY: 150,

        MEDIUM: 240,

        HARD: 320,

        EXPERT: 380

    },

    translationStyle: {

        A: "Natural Japanese",

        B: "Official Guide Style",

        C: "Machine Translation Style"

    },

    questionType: {

        KNOWLEDGE: "knowledge",

        SCENARIO: "scenario"

    },

    status: {

        DRAFT: "Draft",

        REVIEWED: "Reviewed",

        APPROVED: "Approved",

        RELEASED: "Released"

    },

    statistics: {

        keepHistoryCount: 100,

        enableLearningAnalytics: true

    },

    debug: {

        enabled: false,

        showQuestionJSON: false,

        skipTimer: false

    }

});