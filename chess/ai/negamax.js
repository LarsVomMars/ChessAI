import evaluate from "./evaluate.js";

export default function negamax(chess, depth = 4) {
    if (depth === 0)
        return [evaluate(chess.board().flat(), chess.turn()), undefined];

    let best = -Infinity;
    let bestMove;
    for (const move of chess.moves()) {
        chess.move(move);

        if (chess.game_over())
            return [chess.in_checkmate() ? Infinity : 0, chess.undo().san];

        const score = -negamax(chess, depth - 1)[0];
        chess.undo();
        if (score > best) {
            best = score;
            bestMove = move;
        }
    }

    return [best, bestMove];
}
