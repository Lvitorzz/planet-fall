// src/rendering/Renderer.js

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;

        this.context =
            canvas.getContext("2d");

        if (!this.context) {
            throw new Error(
                "Não foi possível inicializar o Canvas 2D."
            );
        }

        this.width = 0;
        this.height = 0;

        this.resize();
    }

    resize() {
        this.width =
            window.innerWidth;

        this.height =
            window.innerHeight;

        this.canvas.width =
            this.width;

        this.canvas.height =
            this.height;
    }

  render({
    world,
    player,
    camera,
    spaceship,
    selectedSpaceship,
    resources,
    selectedResource,
    currentTask,
    timeSystem,
    enemies
}) {
    this.clear();

    this.context.save();

    this.context.translate(
        -camera.x,
        -camera.y
    );

    this.drawWorld(world);
    this.drawGrid(world);

    this.drawSpaceship(
        spaceship,
        selectedSpaceship
    );

    this.drawResources(
        resources,
        selectedResource
    );

    this.drawEnemies(
    enemies
);

    this.drawTarget(player);
    this.drawPlayer(player);

    this.drawTaskProgress(
        currentTask
    );

    this.context.restore();

    this.drawDayNightLighting(
        timeSystem
    );
}

drawDayNightLighting(
    timeSystem
) {
    if (!timeSystem) {
        return;
    }

    const darkness =
        timeSystem
            .getDarknessAlpha();

    if (darkness <= 0) {
        return;
    }

    this.context.save();

    this.context.fillStyle =
        `rgba(
            9,
            16,
            35,
            ${darkness}
        )`;

    this.context.fillRect(
        0,
        0,
        this.width,
        this.height
    );

    this.context.restore();
}

    clear() {
        this.context.fillStyle =
            "#101713";

        this.context.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }

    drawWorld(world) {
        this.context.fillStyle =
            "#314c36";

        this.context.fillRect(
            0,
            0,
            world.width,
            world.height
        );

        this.context.strokeStyle =
            "#83a786";

        this.context.lineWidth = 6;

        this.context.strokeRect(
            0,
            0,
            world.width,
            world.height
        );
    }

    drawGrid(world) {
        const gridSize = 64;

        this.context.strokeStyle =
            "rgba(255,255,255,0.045)";

        this.context.lineWidth = 1;

        for (
            let x = 0;
            x <= world.width;
            x += gridSize
        ) {
            this.context.beginPath();

            this.context.moveTo(
                x,
                0
            );

            this.context.lineTo(
                x,
                world.height
            );

            this.context.stroke();
        }

        for (
            let y = 0;
            y <= world.height;
            y += gridSize
        ) {
            this.context.beginPath();

            this.context.moveTo(
                0,
                y
            );

            this.context.lineTo(
                world.width,
                y
            );

            this.context.stroke();
        }
    }

    drawSpaceship(
        spaceship,
        selectedSpaceship
    ) {
        if (selectedSpaceship) {
            this.context.strokeStyle =
                "#f5d547";

            this.context.lineWidth = 3;

            this.context.beginPath();

            this.context.arc(
                spaceship.x,
                spaceship.y,
                spaceship.radius + 12,
                0,
                Math.PI * 2
            );

            this.context.stroke();
        }

        this.context.save();

        this.context.translate(
            spaceship.x,
            spaceship.y
        );

        this.context.fillStyle =
            "rgba(0,0,0,0.25)";

        this.context.beginPath();

        this.context.ellipse(
            0,
            48,
            65,
            24,
            0,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.fillStyle =
            "#69757d";

        this.context.beginPath();

        this.context.moveTo(
            0,
            -70
        );

        this.context.lineTo(
            52,
            60
        );

        this.context.lineTo(
            0,
            40
        );

        this.context.lineTo(
            -52,
            60
        );

        this.context.closePath();
        this.context.fill();

        this.context.fillStyle =
            "#9fd9e6";

        this.context.beginPath();

        this.context.ellipse(
            0,
            -12,
            18,
            28,
            0,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.restore();
    }

    drawResources(
        resources,
        selectedResource
    ) {
        for (
            const resource
            of resources
        ) {
            if (resource.isDepleted) {
                continue;
            }

            if (
                selectedResource?.id ===
                resource.id
            ) {
                this.drawSelection(
                    resource
                );
            }

            if (
                resource.type === "tree"
            ) {
                this.drawTree(resource);
            }

            if (
                resource.type === "rock"
            ) {
                this.drawRock(resource);
            }

            if (
                resource.type === "bush"
            ) {
                this.drawBush(resource);
            }

            if (
                resource.type === "scrap"
            ) {
                this.drawScrap(resource);
            }
        }
    }

    drawSelection(resource) {
        this.context.strokeStyle =
            "#f5d547";

        this.context.lineWidth = 3;

        this.context.beginPath();

        this.context.arc(
            resource.x,
            resource.y,
            resource.radius + 10,
            0,
            Math.PI * 2
        );

        this.context.stroke();
    }

    drawTree(resource) {
        this.context.fillStyle =
            "#69482c";

        this.context.fillRect(
            resource.x - 8,
            resource.y,
            16,
            36
        );

        this.context.fillStyle =
            "#287340";

        this.context.beginPath();

        this.context.arc(
            resource.x,
            resource.y - 5,
            resource.radius,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.fillStyle =
            "#3d9153";

        this.context.beginPath();

        this.context.arc(
            resource.x - 12,
            resource.y - 14,
            resource.radius * 0.55,
            0,
            Math.PI * 2
        );

        this.context.fill();
    }

    drawRock(resource) {
        this.context.fillStyle =
            "#7e8586";

        this.context.beginPath();

        this.context.moveTo(
            resource.x -
                resource.radius,
            resource.y + 10
        );

        this.context.lineTo(
            resource.x - 18,
            resource.y - 22
        );

        this.context.lineTo(
            resource.x + 12,
            resource.y -
                resource.radius
        );

        this.context.lineTo(
            resource.x +
                resource.radius,
            resource.y + 8
        );

        this.context.lineTo(
            resource.x + 12,
            resource.y +
                resource.radius
        );

        this.context.closePath();
        this.context.fill();

        this.context.strokeStyle =
            "#aeb5b5";

        this.context.lineWidth = 3;
        this.context.stroke();
    }

    drawBush(resource) {
        this.context.fillStyle =
            "#2d7f42";

        const positions = [
            [-12, 2],
            [10, 0],
            [0, -12],
            [0, 12]
        ];

        for (
            const [
                offsetX,
                offsetY
            ] of positions
        ) {
            this.context.beginPath();

            this.context.arc(
                resource.x + offsetX,
                resource.y + offsetY,
                resource.radius * 0.62,
                0,
                Math.PI * 2
            );

            this.context.fill();
        }

        this.context.fillStyle =
            "#d95055";

        const berries = [
            [-12, -8],
            [8, -10],
            [13, 9],
            [-5, 12]
        ];

        for (
            const [
                offsetX,
                offsetY
            ] of berries
        ) {
            this.context.beginPath();

            this.context.arc(
                resource.x + offsetX,
                resource.y + offsetY,
                4,
                0,
                Math.PI * 2
            );

            this.context.fill();
        }
    }

    drawScrap(resource) {
        this.context.save();

        this.context.translate(
            resource.x,
            resource.y
        );

        this.context.fillStyle =
            "rgba(0,0,0,0.22)";

        this.context.beginPath();

        this.context.ellipse(
            0,
            15,
            30,
            10,
            0,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.fillStyle =
            "#8c969b";

        this.context.fillRect(
            -25,
            -6,
            27,
            14
        );

        this.context.fillStyle =
            "#606b72";

        this.context.fillRect(
            2,
            -15,
            23,
            17
        );

        this.context.fillStyle =
            "#b6c1c6";

        this.context.fillRect(
            -10,
            7,
            25,
            8
        );

        this.context.fillStyle =
            "#6cc6df";

        this.context.fillRect(
            10,
            -11,
            6,
            5
        );

        this.context.restore();
    }

    drawEnemies(enemies) {
    if (!enemies) {
        return;
    }

    for (
        const enemy
        of enemies
    ) {
        if (enemy.isDead) {
            continue;
        }

        if (
            enemy.type ===
            "hunter"
        ) {
            this.drawHunter(
                enemy
            );
        }

        if (
            enemy.type ===
            "demolisher"
        ) {
            this.drawDemolisher(
                enemy
            );
        }

        this.drawEnemyHealth(
            enemy
        );
    }
}

drawHunter(enemy) {
    this.context.save();

    this.context.translate(
        enemy.x,
        enemy.y
    );

    this.context.fillStyle =
        "rgba(0,0,0,0.3)";

    this.context.beginPath();

    this.context.ellipse(
        0,
        enemy.radius + 7,
        enemy.radius,
        enemy.radius * 0.45,
        0,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.fillStyle =
        "#a63855";

    this.context.beginPath();

    this.context.arc(
        0,
        0,
        enemy.radius,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.fillStyle =
        "#e15b75";

    this.context.beginPath();

    this.context.moveTo(
        -enemy.radius,
        -5
    );

    this.context.lineTo(
        -enemy.radius - 11,
        -13
    );

    this.context.lineTo(
        -enemy.radius + 2,
        5
    );

    this.context.fill();

    this.context.beginPath();

    this.context.moveTo(
        enemy.radius,
        -5
    );

    this.context.lineTo(
        enemy.radius + 11,
        -13
    );

    this.context.lineTo(
        enemy.radius - 2,
        5
    );

    this.context.fill();

    this.context.fillStyle =
        "#f0d873";

    this.context.beginPath();

    this.context.arc(
        -6,
        -3,
        3,
        0,
        Math.PI * 2
    );

    this.context.arc(
        6,
        -3,
        3,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.restore();
}

drawDemolisher(enemy) {
    this.context.save();

    this.context.translate(
        enemy.x,
        enemy.y
    );

    this.context.fillStyle =
        "rgba(0,0,0,0.32)";

    this.context.beginPath();

    this.context.ellipse(
        0,
        enemy.radius + 9,
        enemy.radius * 1.1,
        enemy.radius * 0.48,
        0,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.fillStyle =
        "#76513d";

    this.context.beginPath();

    this.context.arc(
        0,
        0,
        enemy.radius,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.fillStyle =
        "#ad7250";

    this.context.beginPath();

    this.context.arc(
        -13,
        -6,
        11,
        0,
        Math.PI * 2
    );

    this.context.arc(
        13,
        -6,
        11,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.fillStyle =
        "#d7b35c";

    this.context.beginPath();

    this.context.arc(
        -7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    this.context.arc(
        7,
        -5,
        3,
        0,
        Math.PI * 2
    );

    this.context.fill();

    this.context.restore();
}

drawEnemyHealth(enemy) {
    const width = 42;
    const height = 5;

    const x =
        enemy.x -
        width / 2;

    const y =
        enemy.y -
        enemy.radius -
        15;

    const progress =
        enemy.health /
        enemy.maxHealth;

    this.context.fillStyle =
        "rgba(0,0,0,0.65)";

    this.context.fillRect(
        x,
        y,
        width,
        height
    );

    this.context.fillStyle =
        "#d45656";

    this.context.fillRect(
        x,
        y,
        width * progress,
        height
    );
}

    drawTarget(player) {
        if (!player.target) {
            return;
        }

        this.context.strokeStyle =
            "#f5d547";

        this.context.lineWidth = 3;

        this.context.beginPath();

        this.context.arc(
            player.target.x,
            player.target.y,
            12,
            0,
            Math.PI * 2
        );

        this.context.stroke();
    }

    drawPlayer(player) {
        this.context.save();

        this.context.translate(
            player.x,
            player.y
        );

        this.context.fillStyle =
            "rgba(0,0,0,0.25)";

        this.context.beginPath();

        this.context.ellipse(
            0,
            player.radius + 5,
            player.radius,
            player.radius / 2,
            0,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.fillStyle =
            "#53b7e8";

        this.context.beginPath();

        this.context.arc(
            0,
            0,
            player.radius,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.strokeStyle =
            "#dff5ff";

        this.context.lineWidth = 3;
        this.context.stroke();

        this.context.restore();
    }

    drawTaskProgress(currentTask) {
        if (
            !currentTask ||
            currentTask.state !==
                "performing"
        ) {
            return;
        }

        const target =
            currentTask.resource ??
            currentTask.spaceship;

        if (!target) {
            return;
        }

        const progress =
            currentTask.progress ?? 0;

        const width = 70;
        const height = 8;

        const x =
            target.x -
            width / 2;

        const y =
            target.y -
            target.radius -
            28;

        this.context.fillStyle =
            "rgba(0,0,0,0.65)";

        this.context.fillRect(
            x,
            y,
            width,
            height
        );

        this.context.fillStyle =
            "#e5c952";

        this.context.fillRect(
            x,
            y,
            width * progress,
            height
        );

        this.context.strokeStyle =
            "rgba(255,255,255,0.65)";

        this.context.lineWidth = 1;

        this.context.strokeRect(
            x,
            y,
            width,
            height
        );
    }
}