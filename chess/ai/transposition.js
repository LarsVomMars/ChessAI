import { isMateScore } from "./search.js";

// https://github.com/SebLague/Chess-AI/blob/main/Assets/Scripts/Core/TranspositionTable.cs
export default class TranspositionTable {
    constructor(chess, size) {
        this.chess = chess;
        // this.size = size;
        // this.entries = Array(this.size);
        this.entries = {};
    }

    clear() {
        this.entries = {};
    }

    get index() {
        // TODO: Zobrist hashing chess.js
        // Currently using fen strings;
        return this.chess.fen();
    }

    set entry(entry) {
        this.entries[this.index] = entry;
    }

    get entry() {
        return this.entries[this.index];
    }

    store(depth, plys, evaluation, move, type) {
        this.entries[this.index] = {
            key: this.chess.fen(),
            evaluation: this.mateScore(evaluation),
            depth,
            move,
            type
        }
    }

    lookup(depth, plys, alpha, beta) {
        const entry = this.entry;
        if (!entry) return null;
        if (entry.key === this.chess.fen()) {
            if (entry.depth >= depth) {
                const score = this.mateScore(entry.evaluation, plys);
                switch (entry.type) {
                    case TYPE_EXACT:
                        return score;
                    case TYPE_UPPER:
                        return score <= alpha ? score : null;
                    case TYPE_LOWER:
                        return score >= beta ? score : null
                }
            }
        }
        return null;
    }

    mateScore(evaluation, plys, store = true) {
        if (isMateScore(evaluation)) {
            const sign = Math.sign(evaluation);
            return (evaluation * sign + (plys * (store ? 1 : -1))) * sign;
        }
        return evaluation;
    }
}

export const TYPE_EXACT = 0;
export const TYPE_UPPER = 1;
export const TYPE_LOWER = 2;
