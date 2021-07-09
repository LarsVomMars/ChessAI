import {
    Colors,
    countMaterial,
    countMaterialOfType,
    endgameWeight,
    evaluateSquareTables,
    Pieces,
} from "./piece.js";

export default class Evaluator {
    constructor(chess) {
        this.chess = chess;
    }

    evaluate() {
        // TODO: Reduce to one loop for efficiency
        const board = this.chess.board().flat();

        const perspective = this.chess.turn() === Colors.WHITE ? 1 : -1;

        const white = countMaterial(board, Colors.WHITE);
        const whiteWOPawns =
            white - countMaterialOfType(board, Colors.WHITE, Pieces.PAWN);
        const whiteEndgame = endgameWeight(whiteWOPawns);

        const black = countMaterial(board, Colors.BLACK);
        const blackWOPawns =
            black - countMaterialOfType(board, Colors.BLACK, Pieces.PAWN);
        const blackEndgame = endgameWeight(blackWOPawns);

        const whiteEval =
            white + evaluateSquareTables(board, Colors.WHITE, whiteEndgame);
        const blackEval =
            black + evaluateSquareTables(board, Colors.BLACK, blackEndgame);

        return (whiteEval - blackEval) * perspective;
    }
}
