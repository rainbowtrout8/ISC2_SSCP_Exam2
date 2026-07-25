/**
 * ============================================================================
 * ISC² SSCP Practice Exam
 * ExamSession.js
 * ----------------------------------------------------------------------------
 * 試験セッション管理クラス
 *
 * Responsibilities
 *   - 問題管理
 *   - 回答管理
 *   - ブックマーク
 *   - フラグ
 *   - 自信度
 *   - 経過時間
 *   - 採点要求
 *
 * UIは一切持たない。
 * ============================================================================
 */

export default class ExamSession {

    constructor(questions = []) {

        this.questions = questions;

        this.state = {

            currentIndex: 0,

            startedAt: null,

            finishedAt: null,

            answers: [],

            bookmarks: [],

            flags: [],

            confidence: [],

            elapsed: []

        };

        this.reset();

    }

    /**
     * セッション初期化
     */
    reset() {

        const length = this.questions.length;

        this.state.currentIndex = 0;

        this.state.startedAt = new Date();

        this.state.finishedAt = null;

        this.state.answers = new Array(length).fill(null);

        this.state.bookmarks = new Array(length).fill(false);

        this.state.flags = new Array(length).fill(false);

        this.state.confidence = new Array(length).fill(null);

        this.state.elapsed = new Array(length).fill(0);

    }

    /**
     * 現在問題
     */
    currentQuestion() {

        return this.questions[this.state.currentIndex];

    }

    /**
     * 現在番号
     */
    currentNumber() {

        return this.state.currentIndex + 1;

    }

    /**
     * 全問題数
     */
    totalQuestions() {

        return this.questions.length;

    }

    /**
     * 回答
     */
    answer(optionIndex) {

        this.state.answers[this.state.currentIndex] = optionIndex;

    }

    /**
     * 回答取得
     */
    getAnswer(index = this.state.currentIndex) {

        return this.state.answers[index];

    }

    /**
     * Bookmark切替
     */
    toggleBookmark(index = this.state.currentIndex) {

        this.state.bookmarks[index] =
            !this.state.bookmarks[index];

    }

    /**
     * Flag切替
     */
    toggleFlag(index = this.state.currentIndex) {

        this.state.flags[index] =
            !this.state.flags[index];

    }

    /**
     * 自信度
     * 1〜5
     */
    setConfidence(level) {

        if (level < 1 || level > 5) {

            throw new Error("Confidence must be 1-5");

        }

        this.state.confidence[this.state.currentIndex] = level;

    }

    /**
     * 経過時間追加
     */
    addElapsed(seconds) {

        this.state.elapsed[this.state.currentIndex] += seconds;

    }

    /**
     * 次へ
     */
    next() {

        if (this.state.currentIndex >= this.questions.length - 1) {

            return false;

        }

        this.state.currentIndex++;

        return true;

    }

    /**
     * 戻る
     */
    previous() {

        if (this.state.currentIndex <= 0) {

            return false;

        }

        this.state.currentIndex--;

        return true;

    }

    /**
     * 指定問題へ
     */
    goto(index) {

        if (index < 0) return;

        if (index >= this.questions.length) return;

        this.state.currentIndex = index;

    }

    /**
     * 最初
     */
    isFirst() {

        return this.state.currentIndex === 0;

    }

    /**
     * 最後
     */
    isLast() {

        return this.state.currentIndex ===
            this.questions.length - 1;

    }

    /**
     * 回答済数
     */
    answeredCount() {

        return this.state.answers.filter(
            a => a !== null
        ).length;

    }

    /**
     * 未回答数
     */
    unansweredCount() {

        return this.questions.length -
            this.answeredCount();

    }

    /**
     * 完了判定
     */
    isCompleted() {

        return this.unansweredCount() === 0;

    }

    /**
     * セッション終了
     */
    finish() {

        this.state.finishedAt = new Date();

    }

    /**
     * 総試験時間（秒）
     */
    totalElapsed() {

        if (!this.state.finishedAt) {

            return null;

        }

        return Math.floor(

            (this.state.finishedAt -
             this.state.startedAt) / 1000

        );

    }

    /**
     * JSON出力
     */
    export() {

        return {

            questions: this.questions,

            state: structuredClone(this.state)

        };

    }

}