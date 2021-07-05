import evaluate from "./evaluate.js";

export default function negamax(chess, depth = 3) {
    if (depth === 0) return [evaluate(chess.board().flat()), null];

    let best = 0;
    let bestMove;
    for (const move of chess.moves()) {
        chess.move(move);
        const [e, _] = negamax(chess, depth - 1);
        if (best <= e) {
            best = e;
            bestMove = move;
        }
        chess.undo();
    }

    return [best, bestMove];
}