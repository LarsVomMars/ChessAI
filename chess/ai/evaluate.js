import { countMaterial } from "./pieces.js";

export default function evaluate(board) {
    const whiteCount = countMaterial(board, "w");
    const blackCount = countMaterial(board, "b");
    return whiteCount - blackCount;
}