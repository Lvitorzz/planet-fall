export class InputManager {
    constructor(canvas, callbacks = {}) {
        this.canvas = canvas;
        this.callbacks = callbacks;

        this.handlePointerDown =
            this.handlePointerDown.bind(this);

        this.handleDoubleClick =
            this.handleDoubleClick.bind(this);

        this.canvas.addEventListener(
            "pointerdown",
            this.handlePointerDown
        );

        this.canvas.addEventListener(
            "dblclick",
            this.handleDoubleClick
        );
    }

    handlePointerDown(event) {
        if (event.button !== 0) {
            return;
        }

        const position =
            this.getScreenPosition(event);

        this.callbacks.onPrimaryClick?.(
            position
        );
    }

    handleDoubleClick(event) {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();

        const position =
            this.getScreenPosition(event);

        this.callbacks
            .onPrimaryDoubleClick?.(
                position
            );
    }

    getScreenPosition(event) {
        const canvasRect =
            this.canvas.getBoundingClientRect();

        const scaleX =
            this.canvas.width /
            canvasRect.width;

        const scaleY =
            this.canvas.height /
            canvasRect.height;

        return {
            screenX:
                (
                    event.clientX -
                    canvasRect.left
                ) * scaleX,

            screenY:
                (
                    event.clientY -
                    canvasRect.top
                ) * scaleY
        };
    }

    destroy() {
        this.canvas.removeEventListener(
            "pointerdown",
            this.handlePointerDown
        );

        this.canvas.removeEventListener(
            "dblclick",
            this.handleDoubleClick
        );
    }
}