import { Colors, evaluatePieceSquareTable, PieceValues } from "./piece.js";

export default class Evaluator {
    constructor(chess) {
        this.chess = chess;
    }

    evaluate() {
        const board = this.chess.board().flat();
        const perspective = this.chess.turn() === Colors.WHITE ? 1 : -1;

        let white = 0;
        let whiteTables = 0;

        let black = 0;
        let blackTables = 0;

        const positions = [];

        for (let i = 0; i < board.length; i++) {
            const field = board[i];
            if (!field) continue;

            positions.push([field, i]);

            const { type, color } = field;
            const val = PieceValues[type];

            if (color === Colors.WHITE) white += val;
            else black += val;
        }

        for (const [piece, pos] of positions) {
            if (piece.color === Colors.WHITE)
                whiteTables += evaluatePieceSquareTable(piece, pos, white);
            else blackTables += evaluatePieceSquareTable(piece, pos, black);
        }

        return (white + whiteTables - (black + blackTables)) * perspective;
    }
}
