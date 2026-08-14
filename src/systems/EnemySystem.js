import { Enemy } from "../entities/Enemy.js";

export class EnemySystem {
    constructor() {
        this.enemies = [];

        this.spawnQueue = [];

        this.active = false;

        this.spawnTimer = 0;
        this.spawnInterval = 4;

        this.enemyCounter = 0;

        this.currentNight = 0;
    }

    startNight(
        dayNumber,
        world
    ) {
        this.active = true;

        this.currentNight =
            dayNumber;

        this.spawnTimer = 1;

        const hunters =
            2 +
            Math.floor(
                (dayNumber - 1) *
                1.5
            );

        const demolishers =
            2 +
            Math.floor(
                (dayNumber - 1) *
                1.2
            );

        this.spawnQueue = [];

        for (
            let i = 0;
            i < hunters;
            i++
        ) {
            this.spawnQueue.push(
                "hunter"
            );
        }

        for (
            let i = 0;
            i < demolishers;
            i++
        ) {
            this.spawnQueue.push(
                "demolisher"
            );
        }

        this.shuffle(
            this.spawnQueue
        );

        return {
            hunters,
            demolishers,
            total:
                hunters +
                demolishers
        };
    }

    endNight() {
        const remaining =
            this.enemies.length;

        this.active = false;

        this.spawnQueue = [];

        this.enemies = [];

        return remaining;
    }

    freeze() {
        this.active = false;

        this.spawnQueue = [];
    }

    update(
        deltaTime,
        {
            world,
            player,
            spaceship
        }
    ) {
        if (!this.active) {
            return;
        }

        this.updateSpawning(
            deltaTime,
            world
        );

        for (
            const enemy
            of this.enemies
        ) {
            if (enemy.isDead) {
                continue;
            }

            const target =
                enemy.targetType ===
                "player"
                    ? player
                    : spaceship;

            const attacked =
                enemy.update(
                    deltaTime,
                    target
                );

            if (!attacked) {
                continue;
            }

            if (
                enemy.targetType ===
                "player"
            ) {
                player.takeDamage(
                    enemy.damage
                );
            }

            if (
                enemy.targetType ===
                "spaceship"
            ) {
                spaceship.takeDamage(
                    enemy.damage
                );
            }
        }

        this.enemies =
            this.enemies.filter(
                (enemy) =>
                    !enemy.isDead
            );
    }

    updateSpawning(
        deltaTime,
        world
    ) {
        if (
            this.spawnQueue.length ===
            0
        ) {
            return;
        }

        this.spawnTimer -=
            deltaTime;

        if (
            this.spawnTimer > 0
        ) {
            return;
        }

        const enemyType =
            this.spawnQueue.shift();

        this.spawnEnemy(
            enemyType,
            world
        );

        this.spawnTimer =
            this.spawnInterval;
    }

    spawnEnemy(
        type,
        world
    ) {
        const position =
            this.getSpawnPosition(
                world
            );

        this.enemyCounter += 1;

        if (
            type === "hunter"
        ) {
            this.enemies.push(
                new Enemy({
                    id:
                        `hunter-${this.enemyCounter}`,

                    type:
                        "hunter",

                    name:
                        "Caçador",

                    x:
                        position.x,

                    y:
                        position.y,

                    radius: 18,

                    speed: 115,

                    maxHealth: 40,

                    damage: 8,

                    attackRange: 10,

                    attackCooldown: 1,

                    targetType:
                        "player"
                })
            );

            return;
        }

        this.enemies.push(
            new Enemy({
                id:
                    `demolisher-${this.enemyCounter}`,

                type:
                    "demolisher",

                name:
                    "Demolidor",

                x:
                    position.x,

                y:
                    position.y,

                radius: 25,

                speed: 65,

                maxHealth: 100,

                damage: 15,

                attackRange: 12,

                attackCooldown: 1.5,

                targetType:
                    "spaceship"
            })
        );
    }

    getSpawnPosition(
        world
    ) {
        const margin = 55;

        const side =
            Math.floor(
                Math.random() * 4
            );

        if (side === 0) {
            return {
                x:
                    Math.random() *
                    world.width,

                y: margin
            };
        }

        if (side === 1) {
            return {
                x:
                    world.width -
                    margin,

                y:
                    Math.random() *
                    world.height
            };
        }

        if (side === 2) {
            return {
                x:
                    Math.random() *
                    world.width,

                y:
                    world.height -
                    margin
            };
        }

        return {
            x: margin,

            y:
                Math.random() *
                world.height
        };
    }

    getAliveCount() {
        return this.enemies.length;
    }

    getRemainingSpawnCount() {
        return this.spawnQueue.length;
    }

    shuffle(array) {
        for (
            let i =
                array.length - 1;
            i > 0;
            i--
        ) {
            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                );

            [
                array[i],
                array[j]
            ] = [
                array[j],
                array[i]
            ];
        }
    }
}