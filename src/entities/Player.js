export class Player {
    constructor({
        x,
        y,
        radius = 18,
        speed = 220
    }) {
        this.x = x;
        this.y = y;

        this.radius = radius;
        this.speed = speed;

        this.target = null;
    }

    setTarget(x, y) {
        this.target = { x, y };
    }

    clearTarget() {
        this.target = null;
    }

    update(
        deltaTime,
        speedMultiplier = 1
    ) {
        if (!this.target) {
            return false;
        }

        /*
         * Com multiplicador zero, o destino
         * é mantido, mas o personagem fica
         * completamente parado.
         */
        if (speedMultiplier <= 0) {
            return false;
        }

        const distanceX =
            this.target.x - this.x;

        const distanceY =
            this.target.y - this.y;

        const distance = Math.hypot(
            distanceX,
            distanceY
        );

        if (distance === 0) {
            this.target = null;
            return true;
        }

        const movementDistance =
            this.speed *
            speedMultiplier *
            deltaTime;

        if (distance <= movementDistance) {
            this.x = this.target.x;
            this.y = this.target.y;

            this.target = null;

            return true;
        }

        const directionX =
            distanceX / distance;

        const directionY =
            distanceY / distance;

        this.x +=
            directionX * movementDistance;

        this.y +=
            directionY * movementDistance;

        return false;
    }
}