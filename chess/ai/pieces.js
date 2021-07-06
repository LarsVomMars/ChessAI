export default function evaluateSquareTable(board, color, endgame) {
    const pieces = [];
    for (let i = 0; i < board.length; i++) {
        const field = board[i];
        if (field && field.color === color) pieces.push([field, i]);
    }
    let value = 0;
    for (const piece of pieces) {
        // if (piece.type === Pieces.KING)
        // value += Math.floor(
        //     evaluateSquareTablePiece(piece[0], piece[1]) * (1 - endgame)
        // );
        value += evaluateSquareTablePiece(piece[0], piece[1]);
    }
    return value;
}

export function evaluateSquareTablePiece(piece, position) {
    if (isWhite(piece)) position = 64 - position;
    return TableMap[piece.type][position];
}

export const getColorPieces = (board, color) =>
    board.filter((p, i) => p !== null && p.color === color);

export const countMaterialType = (board, color, type) => {
    const filter = board
        .filter((p) => p !== null && p.color === color && p.type === type)
        .map((p) => PieceValues[p.type]);
    return filter.length === 0 ? 0 : filter.reduce((acc, val) => acc + val);
};

export const countCentipawnMaterial = (board, color) => {
    const filter = getColorPieces(board).map((p) => PieceValues[p.type]);
    return filter.length === 0 ? 0 : filter.reduce((acc, val) => acc + val);
};

export const isWhite = (type) => type === "w";

// Scuffed enum
export const Pieces = {
    PAWN: "p",
    KNIGHT: "n",
    BISHOP: "b",
    ROOK: "r",
    QUEEN: "q",
    KING: "k",
};

export const PieceValues = {
    p: 100,
    n: 320,
    b: 330,
    r: 500,
    q: 900,
    k: 20000,
};

// prettier-ignore
export const PAWN_TABLE = [
     0,  0,  0,  0,  0,  0,  0,  0,
    50, 50, 50, 50, 50, 50, 50, 50,
    10, 10, 20, 30, 30, 20, 10, 10,
     5,  5, 10, 25, 25, 10,  5,  5,
     0,  0,  0, 20, 20,  0,  0,  0,
     5, -5,-10,  0,  0,-10, -5,  5,
     5, 10, 10,-20,-20, 10, 10,  5,
     0,  0,  0,  0,  0,  0,  0,  0
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

// prettier-ignore
export const KING_ENDGAME_TABLE = [
    -50,-40,-30,-20,-20,-30,-40,-50,
    -30,-20,-10,  0,  0,-10,-20,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 30, 40, 40, 30,-10,-30,
    -30,-10, 20, 30, 30, 20,-10,-30,
    -30,-30,  0,  0,  0,  0,-30,-30,
    -50,-30,-30,-30,-30,-30,-30,-50,
];

export const TableMap = {
    p: PAWN_TABLE,
    n: KNIGHT_TABLE,
    b: KNIGHT_TABLE,
    r: ROOK_TABLE,
    q: QUEEN_TABLE,
    k: KING_TABLE,
    ke: KING_ENDGAME_TABLE,
};

export const ENDGAME_THRESHHOLD =
    PieceValues.r * 2 + PieceValues.b + PieceValues.n;
