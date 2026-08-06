import { Game } from "./core/Game.js";

const canvas =
    document.querySelector("#game-canvas");

if (!(canvas instanceof HTMLCanvasElement)) {
    throw new Error(
        "O elemento Canvas do jogo não foi encontrado."
    );
}

const game = new Game(canvas);

game.start();