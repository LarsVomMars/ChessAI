import {
    INPUT_EVENT_TYPE,
    COLOR,
    Chessboard,
    MARKER_TYPE,
} from "cm-chessboard/src/cm-chessboard/Chessboard";

const chess = new Chess(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
);

function inputHandler(event) {
    console.log("event", event);
    // event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
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
        console.log(evaluate(chess.board().flat()));
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

function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
