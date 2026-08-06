export class UIManager {
    constructor({
        onResourceAction,
        onEatBerry,
        onEatRation,
        onRemoveQueuedTask
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

        this.eatRationButton =
            document.querySelector(
                "#eat-ration-button"
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

        this.eatRationButton.addEventListener(
            "click",
            () => {
                onEatRation?.();
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

                const queueIndex = Number(
                    removeButton.dataset.queueIndex
                );

                if (
                    !Number.isInteger(queueIndex)
                ) {
                    return;
                }

                onRemoveQueuedTask?.(
                    queueIndex
                );
            }
        );
    }

    showResource(resource) {
        this.currentResourceActionLabel =
            resource.actionLabel;

        this.resourceName.textContent =
            resource.name;

        this.resourceDescription.textContent =
            `Fornece ${resource.yieldAmount} ` +
            `${resource.yieldLabel}. ` +
            `Custo: ${resource.staminaCost} ` +
            `de stamina.`;

        this.setResourceActionState({
            enabled: true,
            text: resource.actionLabel
        });

        this.resourcePanel.classList.remove(
            "hidden"
        );
    }

    hideResourcePanel() {
        this.resourcePanel.classList.add(
            "hidden"
        );
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

    setTaskStatus(message) {
        this.taskStatus.textContent =
            message;
    }

    updateInventory(inventory) {
        this.woodAmount.textContent =
            inventory.wood;

        this.stoneAmount.textContent =
            inventory.stone;

        this.berriesAmount.textContent =
            inventory.berries;

        this.rationsAmount.textContent =
            inventory.rations;

        this.eatBerryButton.disabled =
            inventory.berries <= 0;

        this.eatRationButton.disabled =
            inventory.rations <= 0;
    }

    updateSurvival(survivalSystem) {
        const stamina = Math.round(
            survivalSystem.stamina
        );

        const satiety = Math.round(
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

        this.taskQueueList.replaceChildren();

        if (taskQueue.length === 0) {
            const emptyMessage =
                document.createElement(
                    "div"
                );

            emptyMessage.className =
                "empty-task-queue";

            emptyMessage.textContent =
                "Nenhuma ação na fila";

            this.taskQueueList.appendChild(
                emptyMessage
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
                    String(index + 1);

                const content =
                    document.createElement(
                        "div"
                    );

                content.className =
                    "queued-task-content";

                const actionName =
                    document.createElement(
                        "strong"
                    );

                actionName.textContent =
                    task.resource.actionLabel;

                const resourceName =
                    document.createElement(
                        "small"
                    );

                resourceName.textContent =
                    task.resource.name;

                const removeButton =
                    document.createElement(
                        "button"
                    );

                removeButton.type = "button";

                removeButton.className =
                    "remove-queued-task";

                removeButton.dataset.queueIndex =
                    String(index);

                removeButton.textContent = "×";

                removeButton.setAttribute(
                    "aria-label",
                    `Remover ${task.resource.actionLabel} da fila`
                );

                content.append(
                    actionName,
                    resourceName
                );

                item.append(
                    position,
                    content,
                    removeButton
                );

                this.taskQueueList.appendChild(
                    item
                );
            }
        );
    }

    describeCurrentTask(task) {
        const resourceName =
            task.resource.name;

        if (task.state === "moving") {
            return `Indo até: ${resourceName}`;
        }

        if (
            task.state ===
            "waiting_stamina"
        ) {
            return (
                "Aguardando stamina: " +
                resourceName
            );
        }

        if (
            task.state ===
            "collecting"
        ) {
            return task.resource.actionLabel;
        }

        return task.resource.actionLabel;
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