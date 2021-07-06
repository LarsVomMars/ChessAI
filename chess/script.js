import { endgameWeight } from "./ai/evaluate.js";
import { random } from "./ai/util.js";
import negamax from "./ai/negamax.js";
import evaluateSquareTable, { countCentipawnMaterial as countMaterial, countMaterialType } from "./ai/pieces.js";
import {
    INPUT_EVENT_TYPE,
    COLOR,
    Chessboard,
    MARKER_TYPE,
} from "./node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js";

const chess = new Chess(
    // "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    "7k/3PP3/8/8/8/8/1pp3K1/8 w - - 0 1"
    // "8/3PP2k/4K3/5r2/8/8/2p5/8 w - - 8 6"
);

function inputHandler(event) {
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
        console.log(negamax(chess, 3));
        const moves = chess.moves({ square: event.square, verbose: true });
        console.log(moves);
        for (const move of moves) {
            event.chessboard.addMarker(move.to, MARKER_TYPE.dot);
        }
        return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.moveDone) {
        const move = { from: event.squareFrom, to: event.squareTo };
        // Auto promote queen
        if (/\w7/.test(event.squareFrom) && /\w8/.test(event.squareTo))
            move.promotion = "q";
        const result = chess.move(move);
        if (result) {
            event.chessboard.setPosition(chess.fen());
            event.chessboard.disableMoveInput();
            const moves = chess.moves({ verbose: true });
            console.log(moves);
            // Random moves
            if (moves.length > 0) {
                const move = random(moves);
                console.log(move);
                chess.move(move);
                event.chessboard.enableMoveInput(inputHandler, COLOR.white);
                event.chessboard.setPosition(chess.fen());
                console.log(chess.fen());
            }
        }
        event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
        // console.log(evaluate(chess.board().flat()));
        return result;
    } else if (event.type === INPUT_EVENT_TYPE.moveCanceled) {
        event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
        return false;
    }
}

const board = new Chessboard(document.getElementById("board"), {
    position: chess.fen(),
    sprite: {
        url: "./node_modules/cm-chessboard/assets/images/chessboard-sprite.svg",
    },
    style: { moveMarker: MARKER_TYPE.square, hoverMarker: undefined },
    orientation: COLOR.white,
});
board.enableMoveInput(inputHandler, COLOR.white);