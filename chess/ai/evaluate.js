import evaluateSquareTable, {
    countCentipawnMaterial as countMaterial,
    countMaterialType,
    ENDGAME_THRESHHOLD,
} from "./pieces.js";

// https://github.com/SebLague/Chess-AI/blob/main/Assets/Scripts/Core/AI/Evaluation.cs
export default function evaluate(board, color) {
    const whiteCount = countMaterial(board, "w");
    const whiteWOPawns = countMaterialType(board, "w", "p");
    const whiteWeight = endgameWeight(whiteWOPawns);

    const blackCount = countMaterial(board, "b");
    const blackWOPawns = countMaterialType(board, "b", "p");
    const blackWeight = endgameWeight(blackWOPawns);

    const whiteEval = whiteCount + evaluateSquareTable(board, "w", whiteWeight);
    const blackEval = blackCount + evaluateSquareTable(board, "b", blackWeight);

    return (whiteEval - blackEval) * (color === "w" ? 1 : -1);
}

export const endgameWeight = (materialWOPawns) =>
    1 - Math.min(1, materialWOPawns * ENDGAME_WEIGHT_MUL);

export const ENDGAME_WEIGHT_MUL = 1 / ENDGAME_THRESHHOLD;
