/**
 * loader.js
 *
 * Question Loader
 *
 * Responsibilities
 * ----------------
 * - Load question JSON files
 * - Validate question objects
 * - Shuffle questions
 * - Shuffle answer options
 * * No UI logic.
 */

import { APP_CONFIG } from "./config.js";

export default class QuestionLoader {

    /**
     * 指定ドメインを読み込む
     * @param {string} domain D1〜D7
     * @returns {Promise<Array>}
     */
    static async loadDomain(domain) {

        const filename = APP_CONFIG.questions.files[domain];

        if (!filename) {
            throw new Error(`Unknown domain : ${domain}`);
        }

        return await this.loadFile(filename);

    }

    /**
     * Mock試験読込
     * @param {"A"|"B"} type
     */
    static async loadMock(type = "A") {

        const filename =
            type === "B"
                ? APP_CONFIG.questions.files.MOCK_B
                : APP_CONFIG.questions.files.MOCK_A;

        return await this.loadFile(filename);

    }

    /**
     * JSONファイル読込
     */
    static async loadFile(filename) {

        const url = APP_CONFIG.questions.basePath + filename;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to load ${url}`);
        }

        const questions = await response.json();

        this.validate(questions);

        return questions;

    }

    /**
     * JSON Validation
     */
    static validate(questions) {

        if (!Array.isArray(questions)) {
            throw new Error("Question file must be Array.");
        }

        questions.forEach((q, index) => {

            if (!q.id)
                throw new Error(`Question ${index}: id missing`);

            if (!q.question)
                throw new Error(`${q.id}: question missing`);

            if (!Array.isArray(q.options))
                throw new Error(`${q.id}: options missing`);

            if (q.options.length !== 4)
                throw new Error(`${q.id}: options must be 4`);

            if (q.correctIndex === undefined)
                throw new Error(`${q.id}: correctIndex missing`);

            if (q.correctIndex < 0 || q.correctIndex > 3)
                throw new Error(`${q.id}: invalid correctIndex`);

        });

    }

    /**
     * Fisher-Yates Shuffle
     */
    static shuffleQuestions(questions) {

        const array = [...questions];

        for (let i = array.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [array[i], array[j]] = [array[j], array[i]];

        }

        return array;

    }

    /**
     * 選択肢をシャッフル
     */
    static shuffleOptions(question) {

        const options = question.options.map((option, index) => ({
            option,
            original: index
        }));

        for (let i = options.length - 1; i > 0; i--) {

            const j = Math.floor(Math.random() * (i + 1));

            [options[i], options[j]] = [options[j], options[i]];

        }

        return {

            ...question,

            options: options.map(o => o.option),

            correctIndex: options.findIndex(
                o => o.original === question.correctIndex
            )

        };

    }

    /**
     * 問題数制限
     */
    static take(questions, count) {

        return questions.slice(0, count);

    }

    /**
     * ドメイン学習
     */
    static async createDomainExam(domain) {

        let questions = await this.loadDomain(domain);

        if (APP_CONFIG.exam.shuffleQuestions) {
            questions = this.shuffleQuestions(questions);
        }

        if (APP_CONFIG.exam.shuffleOptions) {
            questions = questions.map(q => this.shuffleOptions(q));
        }

        return this.take(
            questions,
            APP_CONFIG.exam.defaultQuestionCount
        );

    }

    /**
     * Mock Exam
     */
    static async createMockExam(type = "A") {

        let questions = await this.loadMock(type);

        if (APP_CONFIG.exam.shuffleQuestions) {
            questions = this.shuffleQuestions(questions);
        }

        if (APP_CONFIG.exam.shuffleOptions) {
            questions = questions.map(q => this.shuffleOptions(q));
        }

        return this.take(
            questions,
            APP_CONFIG.exam.mockQuestionCount
        );

    }

    /**
     * 将来用
     * 全ドメイン読込
     */
    static async loadAllDomains() {

        const domains = Object.keys(APP_CONFIG.questions.files)
            .filter(d => d.startsWith("D"));

        const result = [];

        for (const domain of domains) {

            const q = await this.loadDomain(domain);

            result.push(...q);

        }

        return result;

    }

}