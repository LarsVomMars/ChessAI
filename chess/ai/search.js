import Evaluator from "./evaluator.js";
import orderMoves from "./moveordering.js";
import TranspositionTable, {
    TYPE_EXACT,
    TYPE_LOWER,
    TYPE_UPPER,
} from "./transposition.js";

export default class Search {
    constructor(chess) {
        this.chess = chess;
        this.evaluator = new Evaluator(chess);
        this.table = new TranspositionTable(chess, 64e3);
        this.bestMove = undefined;
        this.bestEval = 0;
    }

    get data() {
        return [this.bestEval, this.bestMove];
    }

    search(depth = 4, plys = 0, alpha = -Infinity, beta = Infinity) {
        if (depth > MAX_DEPTH) throw "TO DEEP!";
        if (plys > 0) {
            // Return if better mate was already found
            alpha = Math.max(alpha, -MATE_SCORE + plys);
            beta = Math.min(beta, MATE_SCORE - plys);
            if (alpha >= beta) return alpha;
        }

        const ttScore = this.table.lookup(depth, plys, alpha, beta);
        if (ttScore !== null) return ttScore;

        if (depth === 0) return this.quiescentSearch(alpha, beta);

        if (this.chess.game_over())
            return this.chess.in_checkmate() ? -MATE_SCORE + plys : 0;

        let type = TYPE_UPPER;
        let best;

        const moves = orderMoves(this.chess, false);
        for (const move of moves) {
            this.chess.move(move);
            const score = -this.search(depth - 1, plys + 1, -beta, -alpha);
            this.chess.undo();

            if (score >= beta) {
                this.table.store(depth, plys, beta, move, TYPE_LOWER);
                return beta;
            }

            if (score > alpha) {
                alpha = score;
                type = TYPE_EXACT;
                best = move;
                if (plys === 0) {
                    this.bestMove = move;
                    this.bestEval = score;
                }
            }
        }

        this.table.store(depth, plys, alpha, best, type);

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

export const MATE_SCORE = 10e10;
export const MAX_DEPTH = 10e3;

export const isMateScore = (score) => Math.abs(score) > MATE_SCORE - MAX_DEPTH;
export const plysToMate = (score) => MATE_SCORE - Math.abs(score);
