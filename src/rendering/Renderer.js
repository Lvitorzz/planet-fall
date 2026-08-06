export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");

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
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    render({
        world,
        player,
        camera,
        resources,
        selectedResource,
        currentTask
    }) {
        this.clear();

        this.context.save();

        this.context.translate(
            -camera.x,
            -camera.y
        );

        this.drawWorld(world);
        this.drawGrid(world);
        this.drawSpaceship(world);

        this.drawResources(
            resources,
            selectedResource
        );

        this.drawTarget(player);
        this.drawPlayer(player);
        this.drawCollectionProgress(currentTask);

        this.context.restore();
    }

    clear() {
        this.context.fillStyle = "#101713";

        this.context.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }

    drawWorld(world) {
        this.context.fillStyle = "#314c36";

        this.context.fillRect(
            0,
            0,
            world.width,
            world.height
        );

        this.context.strokeStyle = "#83a786";
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
            "rgba(255, 255, 255, 0.045)";

        this.context.lineWidth = 1;

        for (
            let x = 0;
            x <= world.width;
            x += gridSize
        ) {
            this.context.beginPath();
            this.context.moveTo(x, 0);
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
            this.context.moveTo(0, y);
            this.context.lineTo(
                world.width,
                y
            );
            this.context.stroke();
        }
    }

    drawSpaceship(world) {
        const spaceshipX = world.width / 2;
        const spaceshipY = world.height / 2;

        this.context.save();

        this.context.translate(
            spaceshipX,
            spaceshipY
        );

        this.context.fillStyle = "#69757d";

        this.context.beginPath();
        this.context.moveTo(0, -70);
        this.context.lineTo(52, 60);
        this.context.lineTo(0, 40);
        this.context.lineTo(-52, 60);
        this.context.closePath();
        this.context.fill();

        this.context.fillStyle = "#9fd9e6";

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
        for (const resource of resources) {
            if (resource.isDepleted) {
                continue;
            }

            if (
                selectedResource?.id ===
                resource.id
            ) {
                this.drawSelection(resource);
            }

            if (resource.type === "tree") {
                this.drawTree(resource);
            }

            if (resource.type === "rock") {
                this.drawRock(resource);
            }

            if (resource.type === "bush") {
                this.drawBush(resource);
            }
        }
    }

    drawSelection(resource) {
        this.context.strokeStyle = "#f5d547";
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
        this.context.fillStyle = "#69482c";

        this.context.fillRect(
            resource.x - 8,
            resource.y,
            16,
            36
        );

        this.context.fillStyle = "#287340";

        this.context.beginPath();

        this.context.arc(
            resource.x,
            resource.y - 5,
            resource.radius,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.fillStyle = "#3d9153";

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
        this.context.fillStyle = "#7e8586";

        this.context.beginPath();

        this.context.moveTo(
            resource.x - resource.radius,
            resource.y + 10
        );

        this.context.lineTo(
            resource.x - 18,
            resource.y - 22
        );

        this.context.lineTo(
            resource.x + 12,
            resource.y - resource.radius
        );

        this.context.lineTo(
            resource.x + resource.radius,
            resource.y + 8
        );

        this.context.lineTo(
            resource.x + 12,
            resource.y + resource.radius
        );

        this.context.closePath();
        this.context.fill();

        this.context.strokeStyle = "#aeb5b5";
        this.context.lineWidth = 3;
        this.context.stroke();
    }

    drawBush(resource) {
        this.context.fillStyle = "#2d7f42";

        const positions = [
            [-12, 2],
            [10, 0],
            [0, -12],
            [0, 12]
        ];

        for (const [offsetX, offsetY] of positions) {
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

        this.context.fillStyle = "#d95055";

        const berries = [
            [-12, -8],
            [8, -10],
            [13, 9],
            [-5, 12]
        ];

        for (const [offsetX, offsetY] of berries) {
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

    drawTarget(player) {
        if (!player.target) {
            return;
        }

        this.context.strokeStyle = "#f5d547";
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
            "rgba(0, 0, 0, 0.25)";

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

        this.context.fillStyle = "#53b7e8";

        this.context.beginPath();

        this.context.arc(
            0,
            0,
            player.radius,
            0,
            Math.PI * 2
        );

        this.context.fill();

        this.context.strokeStyle = "#dff5ff";
        this.context.lineWidth = 3;
        this.context.stroke();

        this.context.restore();
    }

    drawCollectionProgress(currentTask) {
        if (
            !currentTask ||
            currentTask.state !== "collecting"
        ) {
            return;
        }

        const resource = currentTask.resource;
        const progress = currentTask.progress;

        const width = 70;
        const height = 8;

        const x = resource.x - width / 2;
        const y =
            resource.y -
            resource.radius -
            28;

        this.context.fillStyle =
            "rgba(0, 0, 0, 0.65)";

        this.context.fillRect(
            x,
            y,
            width,
            height
        );

        this.context.fillStyle = "#e5c952";

        this.context.fillRect(
            x,
            y,
            width * progress,
            height
        );

        this.context.strokeStyle =
            "rgba(255, 255, 255, 0.65)";

        this.context.lineWidth = 1;

        this.context.strokeRect(
            x,
            y,
            width,
            height
        );
    }
}