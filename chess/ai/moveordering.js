import { PieceValues } from "./piece.js";

export default function orderMoves(chess, onlyCaptures) {
    let moves = chess
        .moves({ verbose: true })
        .filter((m) => !onlyCaptures || (m.flag && m.flag.includes("c")));

    for (const move of moves) {
        let score = 0;
        const movePiece = move.piece;
        const capturePiece = chess.get(move.to);

        if (capturePiece)
            score += 10 * PieceValues[capturePiece] - PieceValues[movePiece];

        if (move.flag && move.flag.includes("p"))
            score += PieceValues[move.promotion];

        move.score = score;
    }

    return moves.sort((a, b) => b.score - a.score);
}
