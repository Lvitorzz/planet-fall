export class Enemy {
    constructor({
        id,
        type,
        name,
        x,
        y,
        radius,
        speed,
        maxHealth,
        damage,
        attackRange,
        attackCooldown,
        targetType
    }) {
        this.id = id;

        this.type = type;
        this.name = name;

        this.x = x;
        this.y = y;

        this.radius = radius;
        this.speed = speed;

        this.maxHealth = maxHealth;
        this.health = maxHealth;

        this.damage = damage;

        this.attackRange = attackRange;
        this.attackCooldown = attackCooldown;

        this.attackTimer = 0;

        this.targetType = targetType;

        this.isDead = false;
    }

    update(
        deltaTime,
        target
    ) {
        if (
            this.isDead ||
            !target
        ) {
            return false;
        }

        this.attackTimer =
            Math.max(
                0,
                this.attackTimer -
                    deltaTime
            );

        const distanceX =
            target.x - this.x;

        const distanceY =
            target.y - this.y;

        const distance =
            Math.hypot(
                distanceX,
                distanceY
            );

        const targetRadius =
            target.radius ?? 0;

        const attackDistance =
            this.attackRange +
            targetRadius;

        if (
            distance >
            attackDistance
        ) {
            if (distance > 0) {
                const directionX =
                    distanceX /
                    distance;

                const directionY =
                    distanceY /
                    distance;

                this.x +=
                    directionX *
                    this.speed *
                    deltaTime;

                this.y +=
                    directionY *
                    this.speed *
                    deltaTime;
            }

            return false;
        }

        if (
            this.attackTimer > 0
        ) {
            return false;
        }

        this.attackTimer =
            this.attackCooldown;

        return true;
    }

    takeDamage(amount) {
        if (this.isDead) {
            return;
        }

        this.health =
            Math.max(
                0,
                this.health -
                    amount
            );

        if (
            this.health <= 0
        ) {
            this.isDead = true;
        }
    }
}