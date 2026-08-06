export class Camera {
    constructor({
        viewportWidth,
        viewportHeight,
        worldWidth,
        worldHeight
    }) {
        this.x = 0;
        this.y = 0;

        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;

        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
    }

    resize(viewportWidth, viewportHeight) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
    }

    follow(target) {
        const desiredX = target.x - this.viewportWidth / 2;
        const desiredY = target.y - this.viewportHeight / 2;

        const maximumX = Math.max(
            0,
            this.worldWidth - this.viewportWidth
        );

        const maximumY = Math.max(
            0,
            this.worldHeight - this.viewportHeight
        );

        this.x = this.clamp(desiredX, 0, maximumX);
        this.y = this.clamp(desiredY, 0, maximumY);
    }

    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    clamp(value, minimum, maximum) {
        return Math.min(
            Math.max(value, minimum),
            maximum
        );
    }
}