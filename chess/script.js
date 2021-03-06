import Search, { isMateScore, plysToMate } from "./ai/search.js";
import {
    INPUT_EVENT_TYPE,
    COLOR,
    Chessboard,
    MARKER_TYPE,
} from "./node_modules/cm-chessboard/src/cm-chessboard/Chessboard.js";
import { Colors } from "./ai/piece.js";

const chess = new Chess(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
    // "7k/3PP3/8/8/8/8/1pp3K1/8 w - - 0 1"
    // "8/3PP2k/4K3/5r2/8/8/2p5/8 w - - 8 6"
    // "3Q4/4P1k1/8/8/8/8/1pp3K1/8 w - - 1 2"
    // "3QQ3/6k1/8/8/8/8/1p4K1/2n5 w - - 0 3"
    // "3Q2Q1/6k1/8/8/8/8/1p4K1/2n5 b - - 1 3"
    // "8/6k1/8/8/6K1/8/8/1qq5 b - - 1 5"
    // "r4rk1/ppp2ppp/1qn5/4p3/1P2P1B1/P2P3P/5PP1/R2Q1RK1 w - - 2 17"
    // "r5k1/p5P1/2p5/1p5p/6b1/8/2q5/5K2 b - - 9 36"
    // "4QK2/3P2qk/8/8/8/8/8/8 w - - 11 13"
);

const search = new Search(chess);

window.ai = search;
window.chess = chess;

const btn = document.getElementById("analyze");
const slider = document.getElementById("analyze-depth");
const show = document.getElementById("analyze-result");
const label = document.getElementById("analyze-depth-label");

const fenBtn = document.getElementById("fen-load-btn");
const fenInput = document.getElementById("fen-input");

btn.addEventListener("click", () => {
    const res =
        search.search(+slider.value) * (chess.turn() === Colors.WHITE ? 1 : -1);
    let resp;
    if (isMateScore(res))
        resp = `#${res >= 0 ? "" : "-"}${Math.ceil(plysToMate(res) / 2)}`;
    else resp = `${res / 100}`;
    show.textContent = resp;
});
slider.addEventListener(
    "input",
    () => (label.textContent = `Depth: ${slider.value}`)
);
fenBtn.addEventListener("click", () => {
    chess.load(fenInput.value);
    board.setPosition(fenInput.value, true);
    board.enableMoveInput(COLOR.white);
});

function inputHandler(event) {
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
        const moves = chess.moves({ square: event.square, verbose: true });
        for (const move of moves)
            event.chessboard.addMarker(move.to, MARKER_TYPE.dot);
        return moves.length > 0;
    } else if (event.type === INPUT_EVENT_TYPE.moveDone) {
        const move = { from: event.squareFrom, to: event.squareTo };
        // Auto promote queen
        if (/\w7/.test(event.squareFrom) && /\w8/.test(event.squareTo))
            move.promotion = "q";
        const result = chess.move(move);
        // console.log(chess.game_over() ? (chess.in_checkmate() ? (chess.turn() === Colors.WHITE ? "Win" : "Lose") : "Draw") : "It's a game!");
        if (result) {
            event.chessboard.setPosition(chess.fen());
            event.chessboard.disableMoveInput();

            const moves = chess.moves({ verbose: true });
            console.log(moves);
            search.search(4);
            console.log(search.data);
            // Random moves
            if (moves.length > 0) {
                chess.move(search.data[1]);
                event.chessboard.enableMoveInput(inputHandler, COLOR.white);
                event.chessboard.setPosition(chess.fen());
                // console.log(chess.fen());
            }
        }
        console.log(chess.game_over() ? (chess.in_checkmate() ? (chess.turn() === Colors.BLACK ? "Win" : "Lose") : "Draw") : "It's a game!");
        event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot);
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
