import evaluate from "./evaluate.js";

export default function negamax(chess, depth = 3) {
    if (depth === 0) return evaluate(chess.board().flat(), chess.turn());

    let best = -Infinity;
    for (const move of chess.moves()) {
        chess.move(move);
        const score = -negamax(chess, depth - 1);
        best = Math.max(best, score);
        chess.undo();
    }

    return best;
}
