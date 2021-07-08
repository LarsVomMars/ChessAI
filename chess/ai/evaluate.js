import evaluateSquareTable, {
    Colors,
    countCentipawnMaterial as countMaterial,
    countMaterialType,
    ENDGAME_THRESHHOLD,
    Pieces,
} from "./pieces.js";

// https://github.com/SebLague/Chess-AI/blob/main/Assets/Scripts/Core/AI/Evaluation.cs
export default function evaluate(board, color) {
    const whiteCount = countMaterial(board, Colors.WHITE);
    const whiteWOPawns =
        whiteCount - countMaterialType(board, Colors.WHITE, Pieces.PAWN);
    const whiteWeight = endgameWeight(whiteWOPawns);

    const blackCount = countMaterial(board, Colors.BLACK);
    const blackWOPawns =
        blackCount - countMaterialType(board, Colors.BLACK, Pieces.PAWN);
    const blackWeight = endgameWeight(blackWOPawns);

    const whiteEval =
        whiteCount + evaluateSquareTable(board, Colors.WHITE, whiteWeight);
    const blackEval =
        blackCount + evaluateSquareTable(board, Colors.BLACK, blackWeight);

    return (whiteEval - blackEval) * (color === Colors.WHITE ? 1 : -1);
}

export const endgameWeight = (materialWOPawns) =>
    1 - Math.min(1, materialWOPawns * ENDGAME_WEIGHT_MUL);

export const ENDGAME_WEIGHT_MUL = 1 / ENDGAME_THRESHHOLD;
