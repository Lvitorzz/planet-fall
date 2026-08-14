export class UIManager {
    constructor({
    onResourceAction,
    onEatBerry,
    onRest,
    onEatRation,
    onRepairGenerator,
    onRemoveQueuedTask,
    onRestartGame,
    onReturnMenu
}) {
        this.resourcePanel =
            document.querySelector(
                "#resource-panel"
            );

        this.resourceName =
            document.querySelector(
                "#resource-name"
            );

        this.resourceDescription =
            document.querySelector(
                "#resource-description"
            );

        this.resourceActionButton =
            document.querySelector(
                "#resource-action-button"
            );

        this.spaceshipPanel =
            document.querySelector(
                "#spaceship-panel"
            );

        this.restButton =
            document.querySelector(
                "#rest-button"
            );

        this.shipEatRationButton =
            document.querySelector(
                "#ship-eat-ration-button"
            );

        this.shipRationsAmount =
            document.querySelector(
                "#ship-rations-amount"
            );

        this.repairGeneratorButton =
            document.querySelector(
                "#repair-generator-button"
            );

        this.generatorStatus =
            document.querySelector(
                "#generator-status"
            );

        this.generatorScrapRequirement =
            document.querySelector(
                "#generator-scrap-requirement"
            );

        this.radarModule =
            document.querySelector(
                "#radar-module"
            );

        this.radarStatus =
            document.querySelector(
                "#radar-status"
            );

        this.radarMessage =
            document.querySelector(
                "#radar-message"
            );

            this.healthValue =
    document.querySelector(
        "#health-value"
    );

this.healthFill =
    document.querySelector(
        "#health-fill"
    );

this.shipIntegrityValue =
    document.querySelector(
        "#ship-integrity-value"
    );

this.shipIntegrityFill =
    document.querySelector(
        "#ship-integrity-fill"
    );

this.threatCount =
    document.querySelector(
        "#threat-count"
    );

this.gameOverOverlay =
    document.querySelector(
        "#game-over-overlay"
    );

this.gameOverTitle =
    document.querySelector(
        "#game-over-title"
    );

this.gameOverMessage =
    document.querySelector(
        "#game-over-message"
    );

this.restartGameButton =
    document.querySelector(
        "#restart-game-button"
    );

this.returnMenuButton =
    document.querySelector(
        "#return-menu-button"
    );

        this.taskStatus =
            document.querySelector(
                "#task-status"
            );

        this.woodAmount =
            document.querySelector(
                "#wood-amount"
            );

        this.stoneAmount =
            document.querySelector(
                "#stone-amount"
            );

        this.scrapAmount =
            document.querySelector(
                "#scrap-amount"
            );

        this.berriesAmount =
            document.querySelector(
                "#berries-amount"
            );

        this.rationsAmount =
            document.querySelector(
                "#rations-amount"
            );

        this.staminaValue =
            document.querySelector(
                "#stamina-value"
            );

        this.staminaFill =
            document.querySelector(
                "#stamina-fill"
            );

        this.satietyValue =
            document.querySelector(
                "#satiety-value"
            );

        this.satietyFill =
            document.querySelector(
                "#satiety-fill"
            );

        this.conditionMessage =
            document.querySelector(
                "#condition-message"
            );

        this.eatBerryButton =
            document.querySelector(
                "#eat-berry-button"
            );

        this.currentTaskLabel =
            document.querySelector(
                "#current-task-label"
            );

        this.queueCount =
            document.querySelector(
                "#queue-count"
            );

        this.taskQueueList =
            document.querySelector(
                "#task-queue-list"
            );

            this.dayNumber =
    document.querySelector(
        "#day-number"
    );

this.phaseName =
    document.querySelector(
        "#phase-name"
    );

this.cycleIcon =
    document.querySelector(
        "#cycle-icon"
    );

this.cycleCountdownLabel =
    document.querySelector(
        "#cycle-countdown-label"
    );

this.cycleCountdown =
    document.querySelector(
        "#cycle-countdown"
    );

this.cycleProgressFill =
    document.querySelector(
        "#cycle-progress-fill"
    );

    this.restartGameButton
    .addEventListener(
        "click",
        () => {
            onRestartGame?.();
        }
    );

this.returnMenuButton
    .addEventListener(
        "click",
        () => {
            onReturnMenu?.();
        }
    );

        this.currentResourceActionLabel =
            "Coletar";

        this.resourceActionButton
            .addEventListener(
                "click",
                () => {
                    onResourceAction?.();
                }
            );

        this.eatBerryButton.addEventListener(
            "click",
            () => {
                onEatBerry?.();
            }
        );

        this.restButton.addEventListener(
            "click",
            () => {
                onRest?.();
            }
        );

        this.shipEatRationButton
            .addEventListener(
                "click",
                () => {
                    onEatRation?.();
                }
            );

        this.repairGeneratorButton
            .addEventListener(
                "click",
                () => {
                    onRepairGenerator?.();
                }
            );

        this.taskQueueList.addEventListener(
            "click",
            (event) => {
                const removeButton =
                    event.target.closest(
                        "[data-queue-index]"
                    );

                if (!removeButton) {
                    return;
                }

                const queueIndex =
                    Number(
                        removeButton
                            .dataset
                            .queueIndex
                    );

                if (
                    !Number.isInteger(
                        queueIndex
                    )
                ) {
                    return;
                }

                onRemoveQueuedTask?.(
                    queueIndex
                );
            }
        );
    }

    updateTime(timeSystem) {
    this.dayNumber.textContent =
        `Dia ${timeSystem.dayNumber}`;

    this.phaseName.textContent =
        timeSystem.getPhaseLabel();

    this.cycleIcon.textContent =
        timeSystem.getPhaseIcon();

    this.cycleCountdownLabel
        .textContent =
        timeSystem.getCountdownLabel();

    this.cycleCountdown.textContent =
        this.formatTime(
            timeSystem
                .getRemainingSeconds()
        );

    const progress =
        timeSystem
            .getPhaseProgress() *
        100;

    this.cycleProgressFill
        .style
        .width =
        `${progress}%`;

    document.body.classList.remove(
        "day-phase",
        "dusk-phase",
        "night-phase",
        "dawn-phase"
    );

    document.body.classList.add(
        `${timeSystem.phase}-phase`
    );
}

formatTime(totalSeconds) {
    const seconds =
        Math.max(
            0,
            Math.ceil(totalSeconds)
        );

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        seconds % 60;

    return (
        `${String(minutes)
            .padStart(2, "0")}:` +
        `${String(remainingSeconds)
            .padStart(2, "0")}`
    );
}

    showResource(resource) {
        this.hideSpaceshipPanel();

        this.currentResourceActionLabel =
            resource.actionLabel;

        this.resourceName.textContent =
            resource.name;

        this.resourceDescription.textContent =
            `Fornece ${resource.yieldAmount} ` +
            `${resource.yieldLabel}. ` +
            `Custo: ${resource.staminaCost} ` +
            `de stamina.`;

        this.resourcePanel.classList.remove(
            "hidden"
        );
    }

    hideResourcePanel() {
        this.resourcePanel.classList.add(
            "hidden"
        );
    }

    showSpaceship(
        spaceship,
        inventory
    ) {
        this.hideResourcePanel();

        this.shipRationsAmount.textContent =
            inventory.rations;

        this.spaceshipPanel.classList.remove(
            "hidden"
        );

        this.updateSpaceshipModules(
            spaceship,
            inventory
        );
    }

    hideSpaceshipPanel() {
        this.spaceshipPanel.classList.add(
            "hidden"
        );
    }

    hideInteractionPanels() {
        this.hideResourcePanel();

        this.hideSpaceshipPanel();
    }

    setResourceActionState({
        enabled,
        text
    }) {
        this.resourceActionButton.disabled =
            !enabled;

        this.resourceActionButton.textContent =
            text ??
            this.currentResourceActionLabel;
    }

    setSpaceshipActionState({
        restEnabled,
        restText,
        rationEnabled,
        rationText
    }) {
        this.restButton.disabled =
            !restEnabled;

        this.restButton.textContent =
            restText ??
            "Descansar";

        this.shipEatRationButton.disabled =
            !rationEnabled;

        this.shipEatRationButton.textContent =
            rationText ??
            "Comer ração";
    }

    updateSpaceshipModules(
        spaceship,
        inventory,
        {
            queueIsFull = false,
            generatorRepairScheduled = false
        } = {}
    ) {
        const generator =
            spaceship.getModule(
                "generator"
            );

        const radar =
            spaceship.getModule(
                "radar"
            );

        this.generatorScrapRequirement
            .textContent =
            `${inventory.scrap}/` +
            `${generator.scrapCost}`;

        this.generatorStatus.className =
            "module-status";

        if (
            generator.status ===
            "repaired"
        ) {
            this.generatorStatus
                .classList.add(
                    "repaired"
                );

            this.generatorStatus
                .textContent =
                "Online";

            this.repairGeneratorButton
                .disabled = true;

            this.repairGeneratorButton
                .textContent =
                "Gerador online";
        } else if (
            generator.status ===
            "repairing"
        ) {
            this.generatorStatus
                .classList.add(
                    "repairing"
                );

            this.generatorStatus
                .textContent =
                "Reparando";

            this.repairGeneratorButton
                .disabled = true;

            this.repairGeneratorButton
                .textContent =
                "Reparo em andamento";
        } else {
            this.generatorStatus
                .classList.add(
                    "damaged"
                );

            this.generatorStatus
                .textContent =
                "Danificado";

            if (
                generatorRepairScheduled
            ) {
                this.repairGeneratorButton
                    .disabled = true;

                this.repairGeneratorButton
                    .textContent =
                    "Reparo programado";
            } else if (
                inventory.scrap <
                generator.scrapCost
            ) {
                this.repairGeneratorButton
                    .disabled = true;

                this.repairGeneratorButton
                    .textContent =
                    `Sucata insuficiente ` +
                    `(${inventory.scrap}/` +
                    `${generator.scrapCost})`;
            } else if (queueIsFull) {
                this.repairGeneratorButton
                    .disabled = true;

                this.repairGeneratorButton
                    .textContent =
                    "Fila cheia (2/2)";
            } else {
                this.repairGeneratorButton
                    .disabled = false;

                this.repairGeneratorButton
                    .textContent =
                    "Reparar Gerador";
            }
        }

        this.radarStatus.className =
            "module-status";

        if (
            radar.status ===
            "available"
        ) {
            this.radarModule.classList.remove(
                "locked"
            );

            this.radarStatus.classList.add(
                "available"
            );

            this.radarStatus.textContent =
                "Desbloqueado";

            this.radarMessage.textContent =
                "Sistema disponível para uma futura reparação.";
        } else {
            this.radarModule.classList.add(
                "locked"
            );

            this.radarStatus.classList.add(
                "locked"
            );

            this.radarStatus.textContent =
                "Bloqueado";

            this.radarMessage.textContent =
                "Repare o Gerador para desbloquear.";
        }
    }

    updateVitals(
    player,
    spaceship
) {
    const healthPercent =
        (
            player.health /
            player.maxHealth
        ) * 100;

    const integrityPercent =
        (
            spaceship.integrity /
            spaceship.maxIntegrity
        ) * 100;

    this.healthValue.textContent =
        Math.ceil(
            player.health
        );

    this.healthFill.style.width =
        `${healthPercent}%`;

    this.shipIntegrityValue
        .textContent =
        `${Math.ceil(
            spaceship.integrity
        )} / ` +
        `${spaceship.maxIntegrity}`;

    this.shipIntegrityFill
        .style
        .width =
        `${integrityPercent}%`;

    this.updateStatusClass(
        this.healthFill,
        healthPercent
    );

    this.updateStatusClass(
        this.shipIntegrityFill,
        integrityPercent
    );
}

updateThreats(
    activeCount,
    remainingCount = 0
) {
    this.threatCount.textContent =
        activeCount;

    this.threatCount.title =
        `${remainingCount} criatura(s) ` +
        `ainda podem surgir nesta noite.`;
}

showGameOver({
    title,
    message
}) {
    this.gameOverTitle.textContent =
        title;

    this.gameOverMessage.textContent =
        message;

    this.gameOverOverlay
        .classList
        .remove(
            "hidden"
        );
}

    setTaskStatus(message) {
        this.taskStatus.textContent =
            message;
    }

    updateInventory(inventory) {
        this.woodAmount.textContent =
            inventory.wood;

        this.stoneAmount.textContent =
            inventory.stone;

        this.scrapAmount.textContent =
            inventory.scrap;

        this.berriesAmount.textContent =
            inventory.berries;

        this.rationsAmount.textContent =
            inventory.rations;

        this.shipRationsAmount.textContent =
            inventory.rations;

        this.eatBerryButton.disabled =
            inventory.berries <= 0;
    }

    updateSurvival(
        survivalSystem
    ) {
        const stamina =
            Math.round(
                survivalSystem.stamina
            );

        const satiety =
            Math.round(
                survivalSystem.satiety
            );

        this.staminaValue.textContent =
            stamina;

        this.satietyValue.textContent =
            satiety;

        this.staminaFill.style.width =
            `${stamina}%`;

        this.satietyFill.style.width =
            `${satiety}%`;

        this.updateStatusClass(
            this.staminaFill,
            stamina
        );

        this.updateStatusClass(
            this.satietyFill,
            satiety
        );

        this.conditionMessage.textContent =
            survivalSystem
                .getConditionMessage();
    }

    updateTaskQueue(
        currentTask,
        taskQueue,
        maximumQueuedTasks
    ) {
        this.currentTaskLabel.textContent =
            currentTask
                ? this.describeCurrentTask(
                    currentTask
                )
                : "Nenhuma ação em andamento";

        this.queueCount.textContent =
            `${taskQueue.length}/` +
            `${maximumQueuedTasks}`;

        this.taskQueueList
            .replaceChildren();

        if (
            taskQueue.length === 0
        ) {
            const empty =
                document.createElement(
                    "div"
                );

            empty.className =
                "empty-task-queue";

            empty.textContent =
                "Nenhuma ação na fila";

            this.taskQueueList
                .appendChild(
                    empty
                );

            return;
        }

        taskQueue.forEach(
            (task, index) => {
                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "queued-task-item";

                const position =
                    document.createElement(
                        "span"
                    );

                position.className =
                    "queued-task-position";

                position.textContent =
                    String(
                        index + 1
                    );

                const content =
                    document.createElement(
                        "div"
                    );

                content.className =
                    "queued-task-content";

                const action =
                    document.createElement(
                        "strong"
                    );

                action.textContent =
                    task.label;

                const target =
                    document.createElement(
                        "small"
                    );

                target.textContent =
                    task.targetName;

                const remove =
                    document.createElement(
                        "button"
                    );

                remove.type =
                    "button";

                remove.className =
                    "remove-queued-task";

                remove.dataset
                    .queueIndex =
                    String(index);

                remove.textContent =
                    "×";

                content.append(
                    action,
                    target
                );

                item.append(
                    position,
                    content,
                    remove
                );

                this.taskQueueList
                    .appendChild(
                        item
                    );
            }
        );
    }

    describeCurrentTask(task) {
        if (
            task.state ===
            "moving"
        ) {
            return (
                `Indo até: ` +
                `${task.targetName}`
            );
        }

        if (
            task.state ===
            "waiting_stamina"
        ) {
            return (
                `Aguardando stamina: ` +
                `${task.targetName}`
            );
        }

        if (
            task.type ===
            "rest"
        ) {
            return (
                "Descansando na nave"
            );
        }

        if (
            task.type ===
            "ration"
        ) {
            return (
                "Comendo ração"
            );
        }

        if (
            task.type ===
            "repair"
        ) {
            return task.label;
        }

        return task.label;
    }

    updateStatusClass(
        element,
        value
    ) {
        element.classList.remove(
            "warning",
            "critical"
        );

        if (value <= 10) {
            element.classList.add(
                "critical"
            );

            return;
        }

        if (value <= 30) {
            element.classList.add(
                "warning"
            );
        }
    }
}