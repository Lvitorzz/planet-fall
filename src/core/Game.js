import { Player } from "../entities/Player.js";
import { Resource } from "../entities/Resource.js";
import { Spaceship } from "../entities/Spaceship.js";
import { TimeSystem } from "../systems/TimeSystem.js";
import { InputManager } from "../input/InputManager.js";
import { EnemySystem } from "../systems/EnemySystem.js";
import { Camera } from "../rendering/Camera.js";
import { Renderer } from "../rendering/Renderer.js";

import { SurvivalSystem } from "../systems/SurvivalSystem.js";

import { UIManager } from "../ui/UIManager.js";

export class Game {
  constructor(canvas) {
    this.canvas = canvas;

    this.world = {
      width: 2400,
      height: 1600,
    };

    this.renderer = new Renderer(canvas);

    this.spaceship = new Spaceship({
      x: this.world.width / 2,

      y: this.world.height / 2,

      radius: 85,
    });

    this.player = new Player({
      x: this.spaceship.x + 130,

      y: this.spaceship.y + 80,
    });

    this.camera = new Camera({
      viewportWidth: this.renderer.width,

      viewportHeight: this.renderer.height,

      worldWidth: this.world.width,

      worldHeight: this.world.height,
    });

    this.inventory = {
      wood: 0,
      stone: 0,
      scrap: 0,
      berries: 0,
      rations: 3,
    };

    this.survival = new SurvivalSystem({
      initialStamina: 100,
      initialSatiety: 80,
    });

    this.timeSystem = new TimeSystem();

    this.enemySystem = new EnemySystem();

    this.isGameOver = false;

    this.resources = this.createResources();

    this.selectedResource = null;

    this.selectedSpaceship = false;

    this.currentTask = null;

    this.taskQueue = [];

    this.maximumQueuedTasks = 2;

    this.taskCounter = 0;

    this.ui = new UIManager({
      onRestartGame: () => {
        window.location.reload();
      },

      onReturnMenu: () => {
        window.location.href = "./index.html";
      },
      onResourceAction: () => {
        this.scheduleSelectedResource();
      },

      onEatBerry: () => {
        this.eatBerry();
      },

      onRest: () => {
        this.scheduleRest();
      },

      onEatRation: () => {
        this.scheduleRation();
      },

      onRepairGenerator: () => {
        this.scheduleGeneratorRepair();
      },

      onRemoveQueuedTask: (queueIndex) => {
        this.removeQueuedTask(queueIndex);
      },
    });

    this.ui.updateInventory(this.inventory);

    this.ui.updateSurvival(this.survival);

    this.ui.updateVitals(this.player, this.spaceship);

    this.ui.updateThreats(0, 0);

    this.ui.updateTime(this.timeSystem);
    this.updateTaskInterface();

    this.input = new InputManager(canvas, {
      onPrimaryClick: ({ screenX, screenY }) => {
        this.handlePrimaryClick(screenX, screenY);
      },

      onPrimaryDoubleClick: ({ screenX, screenY }) => {
        this.handlePrimaryDoubleClick(screenX, screenY);
      },
    });

    this.lastTimestamp = 0;

    this.loop = this.loop.bind(this);

    this.handleResize = this.handleResize.bind(this);

    window.addEventListener("resize", this.handleResize);
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

        yieldLabel: "unidades de madeira",

        yieldAmount: 4,

        collectionDuration: 2,

        staminaCost: 14,

        actionLabel: "Coletar madeira",
      }),

      new Resource({
        id: "tree-2",
        type: "tree",
        name: "Árvore",

        x: 930,
        y: 910,

        radius: 34,

        inventoryKey: "wood",

        yieldLabel: "unidades de madeira",

        yieldAmount: 4,

        collectionDuration: 2,

        staminaCost: 14,

        actionLabel: "Coletar madeira",
      }),

      new Resource({
        id: "rock-1",
        type: "rock",
        name: "Rocha",

        x: 1430,
        y: 700,

        radius: 30,

        inventoryKey: "stone",

        yieldLabel: "unidades de pedra",

        yieldAmount: 4,

        collectionDuration: 2.5,

        staminaCost: 20,

        actionLabel: "Extrair pedra",
      }),

      new Resource({
        id: "rock-2",
        type: "rock",
        name: "Rocha",

        x: 1530,
        y: 950,

        radius: 30,

        inventoryKey: "stone",

        yieldLabel: "unidades de pedra",

        yieldAmount: 4,

        collectionDuration: 2.5,

        staminaCost: 20,

        actionLabel: "Extrair pedra",
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

        actionLabel: "Coletar frutas",
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

        actionLabel: "Coletar frutas",
      }),

      new Resource({
        id: "scrap-1",
        type: "scrap",

        name: "Destroços metálicos",

        x: 830,
        y: 760,

        radius: 30,

        inventoryKey: "scrap",

        yieldLabel: "unidades de sucata",

        yieldAmount: 3,

        collectionDuration: 1.8,

        staminaCost: 12,

        actionLabel: "Vasculhar sucata",
      }),

      new Resource({
        id: "scrap-2",
        type: "scrap",

        name: "Destroços metálicos",

        x: 1580,
        y: 810,

        radius: 30,

        inventoryKey: "scrap",

        yieldLabel: "unidades de sucata",

        yieldAmount: 3,

        collectionDuration: 1.8,

        staminaCost: 12,

        actionLabel: "Vasculhar sucata",
      }),

      new Resource({
        id: "scrap-3",
        type: "scrap",

        name: "Destroços metálicos",

        x: 1220,
        y: 1190,

        radius: 30,

        inventoryKey: "scrap",

        yieldLabel: "unidades de sucata",

        yieldAmount: 3,

        collectionDuration: 1.8,

        staminaCost: 12,

        actionLabel: "Vasculhar sucata",
      }),

      new Resource({
        id: "scrap-4",
        type: "scrap",

        name: "Destroços metálicos",

        x: 1720,
        y: 1110,

        radius: 30,

        inventoryKey: "scrap",

        yieldLabel: "unidades de sucata",

        yieldAmount: 3,

        collectionDuration: 1.8,

        staminaCost: 12,

        actionLabel: "Vasculhar sucata",
      }),
    ];
  }

  start() {
    this.camera.follow(this.player);

    requestAnimationFrame(this.loop);
  }

  handlePrimaryClick(screenX, screenY) {
    const worldPosition = this.camera.screenToWorld(screenX, screenY);

    const clickedResource = this.findResourceAt(
      worldPosition.x,
      worldPosition.y,
    );

    if (clickedResource) {
      this.selectResource(clickedResource);

      return;
    }

    if (this.spaceship.containsPoint(worldPosition.x, worldPosition.y)) {
      this.selectSpaceship();

      return;
    }

    const hasTasks = this.currentTask !== null || this.taskQueue.length > 0;

    if (hasTasks) {
      this.ui.setTaskStatus(
        "Há uma ação programada. " +
          "Dê duplo clique no chão " +
          "para cancelar e mover.",
      );

      return;
    }

    this.movePlayerToWorldPosition(worldPosition);
  }

  handlePrimaryDoubleClick(screenX, screenY) {
    const worldPosition = this.camera.screenToWorld(screenX, screenY);

    const clickedResource = this.findResourceAt(
      worldPosition.x,
      worldPosition.y,
    );

    if (clickedResource) {
      this.selectResource(clickedResource);

      return;
    }

    if (this.spaceship.containsPoint(worldPosition.x, worldPosition.y)) {
      this.selectSpaceship();

      return;
    }

    this.cancelAllTasks();

    this.movePlayerToWorldPosition(worldPosition);

    this.ui.setTaskStatus(
      "Ações canceladas. " + "Movendo para o local selecionado.",
    );
  }

  movePlayerToWorldPosition(worldPosition) {
    this.selectedResource = null;

    this.selectedSpaceship = false;

    this.ui.hideInteractionPanels();

    const destinationX = this.clamp(
      worldPosition.x,

      this.player.radius,

      this.world.width - this.player.radius,
    );

    const destinationY = this.clamp(
      worldPosition.y,

      this.player.radius,

      this.world.height - this.player.radius,
    );

    this.player.setTarget(destinationX, destinationY);

    this.ui.setTaskStatus("Movendo para o local selecionado.");
  }

  findResourceAt(x, y) {
    return this.resources
      .slice()
      .reverse()
      .find((resource) => {
        return !resource.isDepleted && resource.containsPoint(x, y);
      });
  }

  selectResource(resource) {
    this.selectedSpaceship = false;

    this.selectedResource = resource;

    this.ui.showResource(resource);

    this.refreshActionPanels();

    this.ui.setTaskStatus(`${resource.name} selecionado.`);
  }

  selectSpaceship() {
    this.selectedResource = null;

    this.selectedSpaceship = true;

    this.ui.showSpaceship(this.spaceship, this.inventory);

    this.refreshActionPanels();

    this.ui.setTaskStatus("Nave selecionada.");
  }

  scheduleSelectedResource() {
    const resource = this.selectedResource;

    if (!resource || resource.isDepleted) {
      return;
    }

    if (this.isResourceScheduled(resource)) {
      this.ui.setTaskStatus("Esse recurso já está programado.");

      return;
    }

    const task = {
      id: this.createTaskId(),

      type: "resource",

      label: resource.actionLabel,

      targetName: resource.name,

      resource,

      duration: resource.collectionDuration,

      staminaCost: resource.staminaCost,

      state: "queued",

      elapsed: 0,
      progress: 0,
    };

    this.scheduleTask(task);
  }

  scheduleRest() {
    if (this.isTaskTypeScheduled("rest")) {
      this.ui.setTaskStatus("O descanso já está programado.");

      return;
    }

    const task = {
      id: this.createTaskId(),

      type: "rest",

      label: "Descansar na nave",

      targetName: this.spaceship.name,

      spaceship: this.spaceship,

      duration: 5,

      staminaCost: 0,

      state: "queued",

      elapsed: 0,
      progress: 0,
    };

    this.scheduleTask(task);
  }

  scheduleRation() {
    if (this.inventory.rations <= 0) {
      this.ui.setTaskStatus("As rações da nave acabaram.");

      return;
    }

    if (this.isTaskTypeScheduled("ration")) {
      this.ui.setTaskStatus("Já existe uma ação de comer ração programada.");

      return;
    }

    const task = {
      id: this.createTaskId(),

      type: "ration",

      label: "Comer ração",

      targetName: this.spaceship.name,

      spaceship: this.spaceship,

      duration: 1,

      staminaCost: 0,

      state: "queued",

      elapsed: 0,
      progress: 0,
    };

    this.scheduleTask(task);
  }

  scheduleGeneratorRepair() {
    const module = this.spaceship.getModule("generator");

    if (!module) {
      return;
    }

    if (module.status === "repaired") {
      this.ui.setTaskStatus("O Gerador já está funcionando.");

      return;
    }

    if (this.isModuleRepairScheduled("generator")) {
      this.ui.setTaskStatus("O reparo do Gerador já está programado.");

      return;
    }

    if (this.inventory.scrap < module.scrapCost) {
      this.ui.setTaskStatus(
        `Sucata insuficiente. ` + `Necessário: ` + `${module.scrapCost}.`,
      );

      return;
    }

    const task = {
      id: this.createTaskId(),

      type: "repair",

      moduleId: "generator",

      label: "Reparar Gerador",

      targetName: this.spaceship.name,

      spaceship: this.spaceship,

      duration: module.repairDuration,

      staminaCost: module.staminaCost,

      state: "queued",

      elapsed: 0,
      progress: 0,
    };

    this.scheduleTask(task);
  }

  scheduleTask(task) {
    if (!this.currentTask) {
      this.beginTask(task);

      return;
    }

    if (this.taskQueue.length >= this.maximumQueuedTasks) {
      this.ui.setTaskStatus("A fila está cheia.");

      this.updateTaskInterface();

      return;
    }

    task.state = "queued";

    this.taskQueue.push(task);

    this.ui.setTaskStatus(`${task.label} adicionado à fila.`);

    this.updateTaskInterface();
  }

  beginTask(task) {
    this.currentTask = task;

    this.currentTask.state = "moving";

    this.currentTask.elapsed = 0;

    this.currentTask.progress = 0;

    const target = this.getTaskTarget(task);

    const destination = this.calculateInteractionPoint(target);

    this.player.setTarget(destination.x, destination.y);

    this.ui.setTaskStatus(`Indo até ${task.targetName.toLowerCase()}.`);

    this.updateTaskInterface();
  }

  getTaskTarget(task) {
    return task.resource ?? task.spaceship;
  }

  createTaskId() {
    this.taskCounter += 1;

    return `task-${this.taskCounter}`;
  }

  isResourceScheduled(resource) {
    if (this.currentTask?.resource?.id === resource.id) {
      return true;
    }

    return this.taskQueue.some((task) => {
      return task.resource?.id === resource.id;
    });
  }

  isTaskTypeScheduled(type) {
    if (this.currentTask?.type === type) {
      return true;
    }

    return this.taskQueue.some((task) => {
      return task.type === type;
    });
  }

  isModuleRepairScheduled(moduleId) {
    if (
      this.currentTask?.type === "repair" &&
      this.currentTask?.moduleId === moduleId
    ) {
      return true;
    }

    return this.taskQueue.some((task) => {
      return task.type === "repair" && task.moduleId === moduleId;
    });
  }

  calculateInteractionPoint(target) {
    let directionX = this.player.x - target.x;

    let directionY = this.player.y - target.y;

    let distance = Math.hypot(directionX, directionY);

    if (distance === 0) {
      directionX = 1;
      directionY = 0;
      distance = 1;
    }

    directionX /= distance;
    directionY /= distance;

    const stoppingDistance = target.radius + this.player.radius + 10;

    return {
      x: this.clamp(
        target.x + directionX * stoppingDistance,

        this.player.radius,

        this.world.width - this.player.radius,
      ),

      y: this.clamp(
        target.y + directionY * stoppingDistance,

        this.player.radius,

        this.world.height - this.player.radius,
      ),
    };
  }

  removeQueuedTask(queueIndex) {
    if (queueIndex < 0 || queueIndex >= this.taskQueue.length) {
      return;
    }

    const [removed] = this.taskQueue.splice(queueIndex, 1);

    this.ui.setTaskStatus(`${removed.label} removido da fila.`);

    this.updateTaskInterface();
  }

  cancelCurrentTaskEffects() {
    if (this.currentTask?.type !== "repair") {
      return;
    }

    const module = this.spaceship.getModule(this.currentTask.moduleId);

    if (module?.status === "repairing") {
      module.status = "damaged";
    }
  }

  cancelAllTasks() {
    this.cancelCurrentTaskEffects();

    this.currentTask = null;

    this.taskQueue = [];

    this.player.clearTarget();

    this.updateTaskInterface();
  }

  startNextQueuedTask() {
    this.currentTask = null;

    const nextTask = this.taskQueue.shift();

    if (!nextTask) {
      this.updateTaskInterface();

      return;
    }

    this.beginTask(nextTask);
  }

  startPerformingCurrentTask() {
    if (!this.currentTask) {
      return;
    }

    const task = this.currentTask;

    if (task.type === "resource") {
      if (!this.survival.canSpendStamina(task.staminaCost)) {
        task.state = "waiting_stamina";

        this.ui.setTaskStatus(
          "Stamina insuficiente. " + "Aguardando recuperação.",
        );

        this.updateTaskInterface();

        return;
      }

      this.survival.spendStamina(task.staminaCost);
    }

    if (task.type === "repair") {
      const module = this.spaceship.getModule(task.moduleId);

      if (!module || module.status === "repaired") {
        this.startNextQueuedTask();

        return;
      }

      if (this.inventory.scrap < module.scrapCost) {
        this.ui.setTaskStatus("Sucata insuficiente para iniciar o reparo.");

        this.startNextQueuedTask();

        return;
      }

      if (!this.survival.canSpendStamina(task.staminaCost)) {
        task.state = "waiting_stamina";

        this.ui.setTaskStatus(
          "Stamina insuficiente para reparar o Gerador. " +
            "Aguardando recuperação.",
        );

        this.updateTaskInterface();

        return;
      }

      this.survival.spendStamina(task.staminaCost);

      module.status = "repairing";
    }

    if (task.type === "ration" && this.inventory.rations <= 0) {
      this.ui.setTaskStatus("As rações acabaram.");

      this.startNextQueuedTask();

      return;
    }

    task.state = "performing";

    task.elapsed = 0;

    task.progress = 0;

    if (task.type === "resource") {
      this.ui.setTaskStatus(`${task.label}.`);
    }

    if (task.type === "rest") {
      this.ui.setTaskStatus("Descansando na nave.");
    }

    if (task.type === "ration") {
      this.ui.setTaskStatus("Comendo ração.");
    }

    if (task.type === "repair") {
      this.ui.setTaskStatus("Reparando o Gerador...");
    }

    this.updateTaskInterface();
  }

  updateCurrentTask(deltaTime, arrived) {
    if (!this.currentTask) {
      return;
    }

    if (this.currentTask.state === "moving" && arrived) {
      this.startPerformingCurrentTask();

      return;
    }

    if (this.currentTask.state === "waiting_stamina") {
      const cost = this.currentTask.staminaCost;

      if (this.survival.canSpendStamina(cost)) {
        this.startPerformingCurrentTask();
      }

      return;
    }

    if (this.currentTask.state !== "performing") {
      return;
    }

    let speedMultiplier = 1;

    if (
      this.currentTask.type === "resource" ||
      this.currentTask.type === "repair"
    ) {
      speedMultiplier = this.survival.getCollectionSpeedMultiplier();

      if (speedMultiplier <= 0) {
        return;
      }
    }

    this.currentTask.elapsed += deltaTime * speedMultiplier;

    this.currentTask.progress = Math.min(
      this.currentTask.elapsed / this.currentTask.duration,

      1,
    );

    if (this.currentTask.elapsed >= this.currentTask.duration) {
      this.completeCurrentTask();
    }
  }

  completeCurrentTask() {
    const task = this.currentTask;

    if (!task) {
      return;
    }

    if (task.type === "resource") {
      const resource = task.resource;

      this.inventory[resource.inventoryKey] += resource.yieldAmount;

      resource.isDepleted = true;

      if (this.selectedResource?.id === resource.id) {
        this.selectedResource = null;

        this.ui.hideResourcePanel();
      }

      this.ui.setTaskStatus(
        `Coleta concluída: ` +
          `+${resource.yieldAmount} ` +
          `${resource.yieldLabel}.`,
      );
    }

    if (task.type === "rest") {
      this.ui.setTaskStatus("Descanso concluído.");
    }

    if (task.type === "ration") {
      this.inventory.rations -= 1;

      this.survival.consumeFood({
        satietyAmount: 40,
        staminaAmount: 25,
      });

      this.ui.setTaskStatus(
        "Ração consumida: " + "+40 de saciedade e " + "+25 de stamina.",
      );
    }

    if (task.type === "repair") {
      const module = this.spaceship.getModule(task.moduleId);

      if (!module || this.inventory.scrap < module.scrapCost) {
        if (module) {
          module.status = "damaged";
        }

        this.ui.setTaskStatus("O reparo falhou por falta de recursos.");
      } else {
        this.inventory.scrap -= module.scrapCost;

        this.spaceship.repairModule(task.moduleId);

        this.ui.setTaskStatus(
          "Gerador reparado! " + "O Radar foi desbloqueado.",
        );
      }
    }

    this.ui.updateInventory(this.inventory);

    this.currentTask = null;

    if (this.taskQueue.length > 0) {
      this.startNextQueuedTask();

      return;
    }

    this.updateTaskInterface();
  }

  eatBerry() {
    if (this.inventory.berries <= 0) {
      this.ui.setTaskStatus("Você não possui frutas.");

      return;
    }

    const consumed = this.survival.consumeFood({
      satietyAmount: 15,
      staminaAmount: 8,
    });

    if (!consumed) {
      this.ui.setTaskStatus("Stamina e saciedade já estão cheias.");

      return;
    }

    this.inventory.berries -= 1;

    this.ui.updateInventory(this.inventory);

    this.ui.updateSurvival(this.survival);

    this.ui.setTaskStatus(
      "Você comeu uma fruta: " + "+15 de saciedade e " + "+8 de stamina.",
    );
  }

  update(deltaTime) {
    if (this.isGameOver) {
      return;
    }

    const timeTransition = this.timeSystem.update(deltaTime);

    if (timeTransition) {
      if (timeTransition.phase === "night") {
        const wave = this.enemySystem.startNight(
          this.timeSystem.dayNumber,

          this.world,
        );

        this.ui.setTaskStatus(
          `A noite começou. ` +
            `${wave.hunters} Caçadores e ` +
            `${wave.demolishers} Demolidores ` +
            `foram detectados.`,
        );
      } else if (timeTransition.phase === "dawn") {
        const remaining = this.enemySystem.endNight();

        if (remaining > 0) {
          this.ui.setTaskStatus(
            `O amanhecer chegou. ` +
              `${remaining} criatura(s) ` +
              `recuaram para a escuridão.`,
          );
        } else {
          this.ui.setTaskStatus(timeTransition.message);
        }
      } else {
        this.ui.setTaskStatus(timeTransition.message);
      }
    }

    this.ui.updateTime(this.timeSystem);
    const wasExhausted = this.survival.isExhausted;

    const isMoving = this.player.target !== null;

    const isPhysicalTask =
      (this.currentTask?.type === "resource" ||
        this.currentTask?.type === "repair") &&
      this.currentTask?.state === "performing";

    const isResting =
      this.currentTask?.type === "rest" &&
      this.currentTask?.state === "performing";

    this.survival.update(deltaTime, {
      isMoving,

      isPerformingTask: isPhysicalTask,

      isResting,
    });

    const startedExhaustion = !wasExhausted && this.survival.isExhausted;

    const finishedExhaustion = wasExhausted && !this.survival.isExhausted;

    if (startedExhaustion) {
      this.ui.setTaskStatus(
        "Stamina zerada. " + "Descansando por 10 segundos.",
      );
    }

    if (finishedExhaustion) {
      this.ui.setTaskStatus(
        "Descanso forçado concluído. " + "Stamina recuperada para 20.",
      );
    }

    const movementMultiplier = this.survival.getMovementSpeedMultiplier();

    const arrived = this.player.update(deltaTime, movementMultiplier);

    this.updateCurrentTask(deltaTime, arrived);

    this.ui.updateSurvival(this.survival);

    this.refreshActionPanels();

    if (arrived && !this.currentTask) {
      this.ui.setTaskStatus("Aguardando ordens.");
    }

    this.camera.follow(this.player);

    this.enemySystem.update(
    deltaTime,
    {
        world:
            this.world,

        player:
            this.player,

        spaceship:
            this.spaceship
    }
);

this.ui.updateThreats(
    this.enemySystem
        .getAliveCount(),

    this.enemySystem
        .getRemainingSpawnCount()
);

this.ui.updateVitals(
    this.player,
    this.spaceship
);

if (
    this.player.isDead()
) {
    this.triggerGameOver(
        "player"
    );

    return;
}

if (
    this.spaceship
        .isDestroyed()
) {
    this.triggerGameOver(
        "spaceship"
    );

    return;
}
  }

  triggerGameOver(reason) {
    if (this.isGameOver) {
        return;
    }

    this.isGameOver =
        true;

    this.player.clearTarget();

    this.enemySystem.freeze();

    if (
        reason === "player"
    ) {
        this.ui.showGameOver({
            title:
                "Você morreu",

            message:
                "As criaturas alcançaram o sobrevivente. " +
                "A expedição terminou antes que a nave pudesse ser reparada."
        });

        return;
    }

    this.ui.showGameOver({
        title:
            "Nave destruída",

        message:
            "Os Demolidores destruíram a nave. " +
            "Sem ela, não existe mais uma forma de escapar do planeta."
    });
}

  updateTaskInterface() {
    this.ui.updateTaskQueue(
      this.currentTask,
      this.taskQueue,
      this.maximumQueuedTasks,
    );

    this.refreshActionPanels();
  }

  refreshActionPanels() {
    const queueIsFull =
      this.currentTask !== null &&
      this.taskQueue.length >= this.maximumQueuedTasks;

    if (this.selectedResource && !this.selectedResource.isDepleted) {
      if (this.isResourceScheduled(this.selectedResource)) {
        this.ui.setResourceActionState({
          enabled: false,

          text: "Ação já programada",
        });
      } else if (queueIsFull) {
        this.ui.setResourceActionState({
          enabled: false,

          text: "Fila cheia (2/2)",
        });
      } else {
        this.ui.setResourceActionState({
          enabled: true,

          text: this.selectedResource.actionLabel,
        });
      }
    }

    if (this.selectedSpaceship) {
      const restScheduled = this.isTaskTypeScheduled("rest");

      const rationScheduled = this.isTaskTypeScheduled("ration");

      const generatorRepairScheduled =
        this.isModuleRepairScheduled("generator");

      this.ui.setSpaceshipActionState({
        restEnabled: !queueIsFull && !restScheduled,

        restText: restScheduled
          ? "Descanso programado"
          : queueIsFull
            ? "Fila cheia (2/2)"
            : "Descansar por 5s",

        rationEnabled:
          this.inventory.rations > 0 && !queueIsFull && !rationScheduled,

        rationText:
          this.inventory.rations <= 0
            ? "Sem rações"
            : rationScheduled
              ? "Ração programada"
              : queueIsFull
                ? "Fila cheia (2/2)"
                : "Comer ração",
      });

      this.ui.updateSpaceshipModules(this.spaceship, this.inventory, {
        queueIsFull,

        generatorRepairScheduled,
      });
    }
  }

  handleResize() {
    this.renderer.resize();

    this.camera.resize(this.renderer.width, this.renderer.height);

    this.camera.follow(this.player);
  }

  loop(timestamp) {
    if (this.lastTimestamp === 0) {
      this.lastTimestamp = timestamp;
    }

    const deltaTime = Math.min(
      (timestamp - this.lastTimestamp) / 1000,

      0.05,
    );

    this.lastTimestamp = timestamp;

    this.update(deltaTime);

    this.render();

    requestAnimationFrame(this.loop);
  }

  render() {
    this.renderer.render({
      world: this.world,

      player: this.player,

      camera: this.camera,

      spaceship: this.spaceship,

      selectedSpaceship: this.selectedSpaceship,

      resources: this.resources,

      selectedResource: this.selectedResource,

      currentTask: this.currentTask,
    });

    timeSystem: this.timeSystem;

    enemies:
    this.enemySystem.enemies
  }

  clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }
}
