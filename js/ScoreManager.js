/**
 * ============================================================================
 * ISC² SSCP Practice Exam
 * ScoreManager.js
 * ----------------------------------------------------------------------------
 * Responsibilities
 *   - Score Calculation
 *   - Domain Statistics
 *   - Difficulty Statistics
 *   - Review Target Extraction
 *   - Exam Summary
 * ============================================================================
 */

export default class ScoreManager {

    constructor(session) {

        this.session = session;

    }

    /**
     * 正答数
     */
    getCorrectCount() {

        let count = 0;

        this.session.questions.forEach((q, index) => {

            if (this.session.state.answers[index] === q.correctIndex) {

                count++;

            }

        });

        return count;

    }

    /**
     * 誤答数
     */
    getIncorrectCount() {

        return this.session.questions.length - this.getCorrectCount();

    }

    /**
     * 正答率(%)
     */
    getPercentage() {

        if (this.session.questions.length === 0) {

            return 0;

        }

        return Math.round(

            this.getCorrectCount() /

            this.session.questions.length *

            100

        );

    }

    /**
     * SSCP風スコア（表示用）
     *
     * ※実際のISC²採点方式ではありません
     */
    getScaledScore() {

        const percent = this.getPercentage();

        return Math.round(

            100 +

            (percent / 100) * 900

        );

    }

    /**
     * 合格判定
     */
    isPassed() {

        return this.getScaledScore() >= 700;

    }

    /**
     * ドメイン別集計
     */
    getDomainStatistics() {

        const result = {};

        this.session.questions.forEach((question, index) => {

            const domain = question.domain;

            if (!result[domain]) {

                result[domain] = {

                    total: 0,

                    correct: 0

                };

            }

            result[domain].total++;

            if (this.session.state.answers[index] === question.correctIndex) {

                result[domain].correct++;

            }

        });

        Object.values(result).forEach(domain => {

            domain.rate = Math.round(

                domain.correct /

                domain.total *

                100

            );

        });

        return result;

    }

    /**
     * 難易度別集計
     */
    getDifficultyStatistics() {

        const stats = {

            easy: { total:0, correct:0 },

            medium:{ total:0, correct:0 },

            hard:{ total:0, correct:0 }

        };

        this.session.questions.forEach((q,index)=>{

            let key="medium";

            if(q.difficulty<200){

                key="easy";

            }else if(q.difficulty>=300){

                key="hard";

            }

            stats[key].total++;

            if(this.session.state.answers[index]===q.correctIndex){

                stats[key].correct++;

            }

        });

        Object.values(stats).forEach(item=>{

            item.rate=item.total===0
                ?0
                :Math.round(item.correct/item.total*100);

        });

        return stats;

    }

    /**
     * 復習対象
     */
    getReviewQuestions() {

        return this.session.questions.filter((question,index)=>{

            return this.session.state.answers[index]!==question.correctIndex;

        });

    }

    /**
     * ブックマーク一覧
     */
    getBookmarkedQuestions(){

        return this.session.questions.filter((q,index)=>{

            return this.session.state.bookmarks[index];

        });

    }

    /**
     * フラグ一覧
     */
    getFlaggedQuestions(){

        return this.session.questions.filter((q,index)=>{

            return this.session.state.flags[index];

        });

    }

    /**
     * 問題毎結果
     */
    getQuestionResults(){

        return this.session.questions.map((question,index)=>{

            return{

                id:question.id,

                domain:question.domain,

                selected:this.session.state.answers[index],

                correct:question.correctIndex,

                isCorrect:

                    this.session.state.answers[index]===question.correctIndex,

                bookmarked:this.session.state.bookmarks[index],

                flagged:this.session.state.flags[index],

                confidence:this.session.state.confidence[index],

                elapsed:this.session.state.elapsed[index]

            };

        });

    }

    /**
     * 試験サマリー
     */
    getSummary(){

        return{

            totalQuestions:this.session.questions.length,

            correct:this.getCorrectCount(),

            incorrect:this.getIncorrectCount(),

            percentage:this.getPercentage(),

            scaledScore:this.getScaledScore(),

            passed:this.isPassed(),

            elapsed:this.session.totalElapsed(),

            domainStatistics:this.getDomainStatistics(),

            difficultyStatistics:this.getDifficultyStatistics()

        };

    }

}