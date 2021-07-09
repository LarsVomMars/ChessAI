export const PieceValues = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000,
};

export const Pieces = {
    PAWN: "p",
    KNIGHT: "n",
    BISHOP: "b",
    ROOK: "r",
    QUEEN: "q",
    KING: "k",
};

export const Colors = {
    WHITE: "w",
    BLACK: "b",
};

export const ENDGAME_MATERIAL_THRESHOLD =
    2 * PieceValues.r + PieceValues.b + PieceValues.n;

export const ENDGAME_MULTIPLIER = 1 / ENDGAME_MATERIAL_THRESHOLD;

export function countMaterial(board, color) {
    const pieces = board.filter((p) => p && p.color === color);
    if (pieces.length === 0) return 0;
    return pieces.map((p) => PieceValues[p.type]).reduce((acc, val) => acc + val);
}

export function countMaterialOfType(board, color, type) {
    const pieces = board.filter(
        (p) => p && p.color === color && p.type === type
    );
    if (pieces.length === 0) return 0;
    return pieces.map((p) => PieceValues[p.type]).reduce((acc, val) => acc + val);
}

export const endgameWeight = (materialWOPawns) =>
    1 - Math.min(1, materialWOPawns * ENDGAME_MULTIPLIER);

export function evaluateSquareTables(board, color, endgameWeight) {
    const pieces = [];
    for (let i = 0; i < board.length; i++) {
        const field = board[i];
        if (field && field.color === color) pieces.push([field, i]);
    }
    let value = 0;
    for (const [piece, position] of pieces) {
        if (piece.type === Pieces.KING) {
            value += Math.floor(
                evaluatePieceSquareTable(piece, position) * (1 - endgameWeight)
            );
        } else value += evaluatePieceSquareTable(piece, position);
    }

    return value;
}

export function evaluatePieceSquareTable(piece, position) {
    if (piece.color === Colors.WHITE) position = 63 - position;
    return TableMap[piece.type][position];
}

// prettier-ignore
export const PAWN_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0,
];

// prettier-ignore
export const KNIGHT_TABLE = [
    -50,-40,-30,-30,-30,-30,-40,-50,
    -40,-20,  0,  0,  0,  0,-20,-40,
    -30,  0, 10, 15, 15, 10,  0,-30,
    -30,  5, 15, 20, 20, 15,  5,-30,
    -30,  0, 15, 20, 20, 15,  0,-30,
    -30,  5, 10, 15, 15, 10,  5,-30,
    -40,-20,  0,  5,  5,  0,-20,-40,
    -50,-40,-30,-30,-30,-30,-40,-50,
];

// prettier-ignore
export const BISHOP_TABLE = [
    -20,-10,-10,-10,-10,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5, 10, 10,  5,  0,-10,
    -10,  5,  5, 10, 10,  5,  5,-10,
    -10,  0, 10, 10, 10, 10,  0,-10,
    -10, 10, 10, 10, 10, 10, 10,-10,
    -10,  5,  0,  0,  0,  0,  5,-10,
    -20,-10,-10,-10,-10,-10,-10,-20,
];

// prettier-ignore
export const ROOK_TABLE = [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0,
];

// prettier-ignore
export const QUEEN_TABLE = [
    -20,-10,-10, -5, -5,-10,-10,-20,
    -10,  0,  0,  0,  0,  0,  0,-10,
    -10,  0,  5,  5,  5,  5,  0,-10,
     -5,  0,  5,  5,  5,  5,  0, -5,
      0,  0,  5,  5,  5,  5,  0, -5,
    -10,  5,  5,  5,  5,  5,  0,-10,
    -10,  0,  5,  0,  0,  0,  0,-10,
    -20,-10,-10, -5, -5,-10,-10,-20,    
];

// prettier-ignore
export const KING_TABLE = [
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -30,-40,-40,-50,-50,-40,-40,-30,
    -20,-30,-30,-40,-40,-30,-30,-20,
    -10,-20,-20,-20,-20,-20,-20,-10,
     20, 20,  0,  0,  0,  0, 20, 20,
     20, 30, 10,  0,  0, 10, 30, 20,
];

export const TableMap = {
    p: PAWN_TABLE,
    n: KNIGHT_TABLE,
    b: BISHOP_TABLE,
    r: ROOK_TABLE,
    q: QUEEN_TABLE,
    k: KING_TABLE,
};
