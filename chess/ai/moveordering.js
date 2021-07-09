import { PieceValues } from "./piece.js";

export default function orderMoves(chess, captures) {
    let moves = chess
        .moves({ verbose: true })
        .filter((m) => !captures || (m.flag && m.flag.includes("c")));

    for (const move of moves) {
        let score = 0;
        const moveType = move.piece;
        const captureType = chess.get(move.to);

        if (captureType)
            score += 10 * PieceValues[captureType] - PieceValues[moveType];

        if (move.flag && move.flag.includes("p"))
            score += PieceValues[move.promotion];

        // TODO: Attacked squares

        move.score = score;
    }

    return moves.sort((a, b) => b.score - a.score);
}
