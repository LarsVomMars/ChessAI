import Evaluator from "./evaluator.js";
import orderMoves from "./moveordering.js";

export default class Search {
    constructor(chess) {
        this.bestEval = -Infinity;
        this.chess = chess;
        this.evaluator = new Evaluator(chess);
    }

    search(depth = 4, alpha = -Infinity, beta = Infinity) {
        if (depth === 0) {
            const s = this.quiescentSearch(alpha, beta);
            return s;
        }
        if (this.chess.game_over())
            return this.chess.in_checkmate() ? -Infinity : 0;

        const moves = orderMoves(this.chess, false);
        for (const move of moves) {
            this.chess.move(move);
            const score = -this.search(depth - 1, -beta, -alpha);
            this.chess.undo();

            if (score >= beta) return beta;

            alpha = Math.max(alpha, score);
        }

        return alpha;
    }

    quiescentSearch(alpha, beta) {
        const initScore = this.evaluator.evaluate();
        if (initScore >= beta) return beta;
        alpha = Math.max(alpha, initScore);

        const moves = orderMoves(this.chess, true);
        for (const move of moves) {
            this.chess.move(move);
            const score = -this.quiescentSearch(-beta, -alpha);
            this.chess.undo();
            if (score >= beta) return beta;
            alpha = Math.max(alpha, score);
        }
        return alpha;
    }
}
