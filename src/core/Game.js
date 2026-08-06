import { Player } from "../entities/Player.js";
import { Resource } from "../entities/Resource.js";
import { InputManager } from "../input/InputManager.js";
import { Camera } from "../rendering/Camera.js";
import { Renderer } from "../rendering/Renderer.js";
import { SurvivalSystem } from "../systems/SurvivalSystem.js";
import { UIManager } from "../ui/UIManager.js";

export class Game {
    constructor(canvas) {
        this.canvas = canvas;

        this.world = {
            width: 2400,
            height: 1600
        };

        this.renderer =
            new Renderer(canvas);

        this.player = new Player({
            x: this.world.width / 2 + 130,
            y: this.world.height / 2 + 80
        });

        this.camera = new Camera({
            viewportWidth:
                this.renderer.width,

            viewportHeight:
                this.renderer.height,

            worldWidth:
                this.world.width,

            worldHeight:
                this.world.height
        });

        this.inventory = {
            wood: 0,
            stone: 0,
            berries: 0,
            rations: 3
        };

        this.survival =
            new SurvivalSystem({
                initialStamina: 100,
                initialSatiety: 80
            });

        this.resources =
            this.createResources();

        this.selectedResource = null;
        this.currentTask = null;

        /*
         * Uma ação atual e até duas
         * aguardando.
         */
        this.maximumQueuedTasks = 2;
        this.taskQueue = [];

        this.ui = new UIManager({
            onResourceAction: () => {
                this.scheduleSelectedResource();
            },

            onEatBerry: () => {
                this.eatBerry();
            },

            onEatRation: () => {
                this.eatRation();
            },

            onRemoveQueuedTask:
                (queueIndex) => {
                    this.removeQueuedTask(
                        queueIndex
                    );
                }
        });

        this.ui.updateInventory(
            this.inventory
        );

        this.ui.updateSurvival(
            this.survival
        );

        this.updateTaskInterface();

        this.input = new InputManager(
            canvas,
            {
                onPrimaryClick:
                    ({
                        screenX,
                        screenY
                    }) => {
                        this.handlePrimaryClick(
                            screenX,
                            screenY
                        );
                    },

                onPrimaryDoubleClick:
                    ({
                        screenX,
                        screenY
                    }) => {
                        this.handlePrimaryDoubleClick(
                            screenX,
                            screenY
                        );
                    }
            }
        );

        this.lastTimestamp = 0;

        this.loop =
            this.loop.bind(this);

        this.handleResize =
            this.handleResize.bind(this);

        window.addEventListener(
            "resize",
            this.handleResize
        );
    }

    createResources() {
        return [
            new Resource({
                id: "tree-1",
                type: "tree",
                name: "Árvore",
                x: 1040,
                y: 680,
                radius: 34,
                inventoryKey: "wood",
                yieldLabel:
                    "unidades de madeira",
                yieldAmount: 4,
                collectionDuration: 2,
                staminaCost: 14,
                actionLabel:
                    "Coletar madeira"
            }),

            new Resource({
                id: "tree-2",
                type: "tree",
                name: "Árvore",
                x: 930,
                y: 910,
                radius: 34,
                inventoryKey: "wood",
                yieldLabel:
                    "unidades de madeira",
                yieldAmount: 4,
                collectionDuration: 2,
                staminaCost: 14,
                actionLabel:
                    "Coletar madeira"
            }),

            new Resource({
                id: "rock-1",
                type: "rock",
                name: "Rocha",
                x: 1430,
                y: 700,
                radius: 30,
                inventoryKey: "stone",
                yieldLabel:
                    "unidades de pedra",
                yieldAmount: 4,
                collectionDuration: 2.5,
                staminaCost: 20,
                actionLabel:
                    "Extrair pedra"
            }),

            new Resource({
                id: "rock-2",
                type: "rock",
                name: "Rocha",
                x: 1530,
                y: 950,
                radius: 30,
                inventoryKey: "stone",
                yieldLabel:
                    "unidades de pedra",
                yieldAmount: 4,
                collectionDuration: 2.5,
                staminaCost: 20,
                actionLabel:
                    "Extrair pedra"
            }),

            new Resource({
                id: "bush-1",
                type: "bush",
                name: "Arbusto com frutas",
                x: 1120,
                y: 1010,
                radius: 25,
                inventoryKey: "berries",
                yieldLabel: "frutas",
                yieldAmount: 3,
                collectionDuration: 1.4,
                staminaCost: 8,
                actionLabel:
                    "Coletar frutas"
            }),

            new Resource({
                id: "bush-2",
                type: "bush",
                name: "Arbusto com frutas",
                x: 1370,
                y: 1080,
                radius: 25,
                inventoryKey: "berries",
                yieldLabel: "frutas",
                yieldAmount: 3,
                collectionDuration: 1.4,
                staminaCost: 8,
                actionLabel:
                    "Coletar frutas"
            })
        ];
    }

    start() {
        this.camera.follow(
            this.player
        );

        requestAnimationFrame(
            this.loop
        );
    }

    handlePrimaryClick(
        screenX,
        screenY
    ) {
        const worldPosition =
            this.camera.screenToWorld(
                screenX,
                screenY
            );

        const clickedResource =
            this.findResourceAt(
                worldPosition.x,
                worldPosition.y
            );

        if (clickedResource) {
            this.selectResource(
                clickedResource
            );

            return;
        }

        const hasPlannedActions =
            this.currentTask !== null ||
            this.taskQueue.length > 0;

        /*
        * Um clique acidental no chão
        * não cancela mais as tarefas.
        */
        if (hasPlannedActions) {
            this.ui.setTaskStatus(
                "Há uma ação programada. " +
                "Dê duplo clique no chão " +
                "para cancelar e mover."
            );

            return;
        }

        this.movePlayerToWorldPosition(
            worldPosition
        );
    }

    handlePrimaryDoubleClick(
        screenX,
        screenY
    ) {
        const worldPosition =
            this.camera.screenToWorld(
                screenX,
                screenY
            );

        const clickedResource =
            this.findResourceAt(
                worldPosition.x,
                worldPosition.y
            );

        /*
        * Duplo clique em um recurso
        * apenas seleciona o recurso.
        */
        if (clickedResource) {
            this.selectResource(
                clickedResource
            );

            return;
        }

        const hadPlannedActions =
            this.currentTask !== null ||
            this.taskQueue.length > 0;

        this.cancelAllTasks();

        this.movePlayerToWorldPosition(
            worldPosition
        );

        if (hadPlannedActions) {
            this.ui.setTaskStatus(
                "Ações canceladas. Movendo para " +
                "o local selecionado."
            );
        }
    }

    movePlayerToWorldPosition(
        worldPosition
    ) {
        this.selectedResource = null;

        this.ui.hideResourcePanel();

        const destinationX =
            this.clamp(
                worldPosition.x,
                this.player.radius,
                this.world.width -
                    this.player.radius
            );

        const destinationY =
            this.clamp(
                worldPosition.y,
                this.player.radius,
                this.world.height -
                    this.player.radius
            );

        this.player.setTarget(
            destinationX,
            destinationY
        );

        this.ui.setTaskStatus(
            "Movendo para o local selecionado."
        );
    }

    findResourceAt(x, y) {
        return this.resources
            .slice()
            .reverse()
            .find((resource) => {
                return (
                    !resource.isDepleted &&
                    resource.containsPoint(
                        x,
                        y
                    )
                );
            });
    }

    selectResource(resource) {
        this.selectedResource =
            resource;

        this.ui.showResource(
            resource
        );

        this.refreshResourceActionState();

        this.ui.setTaskStatus(
            `${resource.name} selecionado.`
        );
    }

    scheduleSelectedResource() {
        const resource =
            this.selectedResource;

        if (
            !resource ||
            resource.isDepleted
        ) {
            return;
        }

        if (
            this.isResourceScheduled(
                resource
            )
        ) {
            this.ui.setTaskStatus(
                "Esse recurso já está sendo " +
                "coletado ou está na fila."
            );

            return;
        }

        const task =
            this.createResourceTask(
                resource
            );

        /*
         * Sem uma ação atual, começa
         * imediatamente.
         */
        if (!this.currentTask) {
            this.beginTask(task);
            return;
        }

        if (
            this.taskQueue.length >=
            this.maximumQueuedTasks
        ) {
            this.ui.setTaskStatus(
                "A fila está cheia. Remova " +
                "uma ação para adicionar outra."
            );

            this.refreshResourceActionState();

            return;
        }

        task.state = "queued";

        this.taskQueue.push(task);

        this.ui.setTaskStatus(
            `${resource.actionLabel} ` +
            "adicionado à fila."
        );

        this.updateTaskInterface();
    }

    createResourceTask(resource) {
        return {
            id: `task-${resource.id}`,
            resource,
            state: "queued",
            elapsed: 0,
            progress: 0
        };
    }

    beginTask(task) {
        const resource =
            task.resource;

        if (resource.isDepleted) {
            this.startNextQueuedTask();
            return;
        }

        this.currentTask = task;

        this.currentTask.state =
            "moving";

        this.currentTask.elapsed = 0;
        this.currentTask.progress = 0;

        const destination =
            this.calculateInteractionPoint(
                resource
            );

        this.player.setTarget(
            destination.x,
            destination.y
        );

        this.ui.setTaskStatus(
            `Indo até ${resource.name.toLowerCase()}.`
        );

        this.updateTaskInterface();
    }

    isResourceScheduled(resource) {
        const isCurrentResource =
            this.currentTask?.resource.id ===
            resource.id;

        const isQueuedResource =
            this.taskQueue.some(
                (task) => {
                    return (
                        task.resource.id ===
                        resource.id
                    );
                }
            );

        return (
            isCurrentResource ||
            isQueuedResource
        );
    }

    removeQueuedTask(queueIndex) {
        if (
            queueIndex < 0 ||
            queueIndex >=
                this.taskQueue.length
        ) {
            return;
        }

        const [removedTask] =
            this.taskQueue.splice(
                queueIndex,
                1
            );

        this.ui.setTaskStatus(
            `${removedTask.resource.actionLabel} ` +
            "removido da fila."
        );

        this.updateTaskInterface();
    }

    calculateInteractionPoint(
        resource
    ) {
        let directionX =
            this.player.x -
            resource.x;

        let directionY =
            this.player.y -
            resource.y;

        let distance = Math.hypot(
            directionX,
            directionY
        );

        if (distance === 0) {
            directionX = 1;
            directionY = 0;
            distance = 1;
        }

        directionX /= distance;
        directionY /= distance;

        const stoppingDistance =
            resource.radius +
            this.player.radius +
            10;

        return {
            x: this.clamp(
                resource.x +
                    directionX *
                    stoppingDistance,

                this.player.radius,

                this.world.width -
                    this.player.radius
            ),

            y: this.clamp(
                resource.y +
                    directionY *
                    stoppingDistance,

                this.player.radius,

                this.world.height -
                    this.player.radius
            )
        };
    }

    cancelAllTasks() {
        this.currentTask = null;
        this.taskQueue = [];

        this.player.clearTarget();

        this.updateTaskInterface();
    }

    startNextQueuedTask() {
        this.currentTask = null;

        const nextTask =
            this.taskQueue.shift();

        if (!nextTask) {
            this.updateTaskInterface();
            return;
        }

        this.beginTask(nextTask);
    }

    eatBerry() {
        if (
            this.inventory.berries <= 0
        ) {
            this.ui.setTaskStatus(
                "Você não possui frutas."
            );

            return;
        }

        const consumed =
            this.survival.consumeFood({
                satietyAmount: 15,
                staminaAmount: 8
            });

        if (!consumed) {
            this.ui.setTaskStatus(
                "Stamina e saciedade já estão cheias."
            );

            return;
        }

        this.inventory.berries -= 1;

        this.ui.updateInventory(
            this.inventory
        );

        this.ui.updateSurvival(
            this.survival
        );

        this.ui.setTaskStatus(
            "Você comeu uma fruta: " +
            "+15 de saciedade e " +
            "+8 de stamina."
        );
    }

    eatRation() {
        if (
            this.inventory.rations <= 0
        ) {
            this.ui.setTaskStatus(
                "As rações da nave acabaram."
            );

            return;
        }

        const consumed =
            this.survival.consumeFood({
                satietyAmount: 40,
                staminaAmount: 25
            });

        if (!consumed) {
            this.ui.setTaskStatus(
                "Stamina e saciedade já estão cheias."
            );

            return;
        }

        this.inventory.rations -= 1;

        this.ui.updateInventory(
            this.inventory
        );

        this.ui.updateSurvival(
            this.survival
        );

        this.ui.setTaskStatus(
            "Você comeu uma ração: " +
            "+40 de saciedade e " +
            "+25 de stamina."
        );
    }

    handleResize() {
        this.renderer.resize();

        this.camera.resize(
            this.renderer.width,
            this.renderer.height
        );

        this.camera.follow(
            this.player
        );
    }

    loop(timestamp) {
        if (
            this.lastTimestamp === 0
        ) {
            this.lastTimestamp =
                timestamp;
        }

        const deltaTime =
            Math.min(
                (
                    timestamp -
                    this.lastTimestamp
                ) / 1000,
                0.05
            );

        this.lastTimestamp =
            timestamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(
            this.loop
        );
    }

    update(deltaTime) {
        const wasExhausted =
            this.survival.isExhausted;

        const isMoving =
            this.player.target !== null;

        const isPerformingTask =
            this.currentTask?.state ===
            "collecting";

        /*
        * Primeiro atualizamos a stamina.
        * Assim, ao chegar em zero, o
        * personagem para no mesmo frame.
        */
        this.survival.update(
            deltaTime,
            {
                isMoving,
                isPerformingTask
            }
        );

        const startedExhaustion =
            !wasExhausted &&
            this.survival.isExhausted;

        const finishedExhaustion =
            wasExhausted &&
            !this.survival.isExhausted;

        if (startedExhaustion) {
            this.ui.setTaskStatus(
                "Stamina zerada. O personagem " +
                "precisa descansar por 10 segundos."
            );
        }

        if (finishedExhaustion) {
            this.ui.setTaskStatus(
                "Descanso concluído. " +
                "Stamina recuperada para 20."
            );
        }

        const movementSpeedMultiplier =
            this.survival
                .getMovementSpeedMultiplier();

        const arrived =
            this.player.update(
                deltaTime,
                movementSpeedMultiplier
            );

        this.updateCurrentTask(
            deltaTime,
            arrived
        );

        this.ui.updateSurvival(
            this.survival
        );

        if (
            arrived &&
            !this.currentTask
        ) {
            this.ui.setTaskStatus(
                "Aguardando ordens."
            );
        }

        this.camera.follow(
            this.player
        );
    }

    updateCurrentTask(
        deltaTime,
        arrived
    ) {
        if (!this.currentTask) {
            return;
        }

        if (
            this.currentTask.state ===
                "moving" &&
            arrived
        ) {
            if (
                this.survival.canSpendStamina(
                    this.currentTask.resource
                        .staminaCost
                )
            ) {
                this.startCollectingCurrentTask();
            } else {
                this.currentTask.state =
                    "waiting_stamina";

                this.ui.setTaskStatus(
                    "Stamina insuficiente. " +
                    "Aguardando recuperação."
                );

                this.updateTaskInterface();
            }

            return;
        }

        if (
            this.currentTask.state ===
            "waiting_stamina"
        ) {
            const staminaCost =
                this.currentTask.resource
                    .staminaCost;

            if (
                this.survival.canSpendStamina(
                    staminaCost
                )
            ) {
                this.startCollectingCurrentTask();
            }

            return;
        }

        if (
            this.currentTask.state !==
            "collecting"
        ) {
            return;
        }

        const resource =
            this.currentTask.resource;

        const collectionSpeedMultiplier =
        this.survival
            .getCollectionSpeedMultiplier();

    /*
    * Em zero ou durante a exaustão,
    * a coleta fica completamente parada.
    */
    if (
        collectionSpeedMultiplier <= 0
    ) {
        return;
    }

    this.currentTask.elapsed +=
        deltaTime *
        collectionSpeedMultiplier;

        this.currentTask.progress =
            Math.min(
                this.currentTask.elapsed /
                    resource
                        .collectionDuration,
                1
            );

        if (
            this.currentTask.elapsed >=
            resource.collectionDuration
        ) {
            this.completeCurrentTask();
        }
    }

    startCollectingCurrentTask() {
        if (!this.currentTask) {
            return;
        }

        const resource =
            this.currentTask.resource;

        const spentStamina =
            this.survival.spendStamina(
                resource.staminaCost
            );

        if (!spentStamina) {
            return;
        }

        this.currentTask.state =
            "collecting";

        this.currentTask.elapsed = 0;
        this.currentTask.progress = 0;

        this.ui.setTaskStatus(
            `Coletando ${resource.yieldLabel}. ` +
            `-${resource.staminaCost} de stamina.`
        );

        this.updateTaskInterface();
    }

    completeCurrentTask() {
        const resource =
            this.currentTask.resource;

        this.inventory[
            resource.inventoryKey
        ] += resource.yieldAmount;

        resource.isDepleted = true;

        this.ui.updateInventory(
            this.inventory
        );

        /*
         * Não fecha o painel caso o jogador
         * esteja olhando outro recurso.
         */
        if (
            this.selectedResource?.id ===
            resource.id
        ) {
            this.selectedResource = null;

            this.ui.hideResourcePanel();
        }

        this.currentTask = null;

        if (this.taskQueue.length > 0) {
            this.startNextQueuedTask();
            return;
        }

        this.ui.setTaskStatus(
            `Coleta concluída: ` +
            `+${resource.yieldAmount} ` +
            `${resource.yieldLabel}.`
        );

        this.updateTaskInterface();
    }

    updateTaskInterface() {
        this.ui.updateTaskQueue(
            this.currentTask,
            this.taskQueue,
            this.maximumQueuedTasks
        );

        this.refreshResourceActionState();
    }

    refreshResourceActionState() {
        const resource =
            this.selectedResource;

        if (
            !resource ||
            resource.isDepleted
        ) {
            return;
        }

        if (
            this.isResourceScheduled(
                resource
            )
        ) {
            this.ui.setResourceActionState({
                enabled: false,
                text:
                    "Ação já programada"
            });

            return;
        }

        const queueIsFull =
            this.currentTask !== null &&
            this.taskQueue.length >=
                this.maximumQueuedTasks;

        if (queueIsFull) {
            this.ui.setResourceActionState({
                enabled: false,
                text: "Fila cheia (2/2)"
            });

            return;
        }

        this.ui.setResourceActionState({
            enabled: true,
            text: resource.actionLabel
        });
    }

    render() {
        this.renderer.render({
            world: this.world,
            player: this.player,
            camera: this.camera,
            resources: this.resources,
            selectedResource:
                this.selectedResource,
            currentTask:
                this.currentTask
        });
    }

    clamp(
        value,
        minimum,
        maximum
    ) {
        return Math.min(
            Math.max(
                value,
                minimum
            ),
            maximum
        );
    }
}