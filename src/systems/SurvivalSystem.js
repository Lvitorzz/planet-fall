// src/systems/SurvivalSystem.js

export class SurvivalSystem {
    constructor({
        initialStamina = 100,
        initialSatiety = 80
    } = {}) {
        this.maxStamina = 100;
        this.maxSatiety = 100;

        this.stamina = initialStamina;
        this.satiety = initialSatiety;

        this.lowStaminaThreshold = 20;

        this.idleSatietyDrainPerSecond = 0.025;
        this.movingSatietyDrainPerSecond = 0.08;
        this.activitySatietyDrainPerSecond = 0.12;

        this.idleStaminaRecoveryPerSecond = 1.8;
        this.restStaminaRecoveryPerSecond = 7;
        this.movingStaminaDrainPerSecond = 0.4;

        this.lowStaminaMovementMultiplier = 0.45;
        this.lowStaminaCollectionMultiplier = 0.5;

        this.isExhausted = false;

        this.exhaustionDuration = 10;
        this.exhaustionRemaining = 0;

        this.exhaustionRecoveryStamina = 20;
    }

    update(
        deltaTime,
        {
            isMoving = false,
            isPerformingTask = false,
            isResting = false
        } = {}
    ) {
        if (this.isExhausted) {
            this.updateSatiety(
                deltaTime,
                {
                    isMoving: false,
                    isPerformingTask: false
                }
            );

            this.updateExhaustion(
                deltaTime
            );

            return;
        }

        this.updateSatiety(
            deltaTime,
            {
                isMoving,
                isPerformingTask
            }
        );

        this.updateStamina(
            deltaTime,
            {
                isMoving,
                isPerformingTask,
                isResting
            }
        );
    }

    updateSatiety(
        deltaTime,
        {
            isMoving,
            isPerformingTask
        }
    ) {
        let drainPerSecond =
            this.idleSatietyDrainPerSecond;

        if (isPerformingTask) {
            drainPerSecond =
                this.activitySatietyDrainPerSecond;
        } else if (isMoving) {
            drainPerSecond =
                this.movingSatietyDrainPerSecond;
        }

        this.satiety = this.clamp(
            this.satiety -
                drainPerSecond * deltaTime,
            0,
            this.maxSatiety
        );
    }

    updateStamina(
        deltaTime,
        {
            isMoving,
            isPerformingTask,
            isResting
        }
    ) {
        if (isResting) {
            this.stamina = this.clamp(
                this.stamina +
                    this.restStaminaRecoveryPerSecond *
                    deltaTime,
                0,
                this.maxStamina
            );

            return;
        }

        if (isPerformingTask) {
            return;
        }

        if (isMoving) {
            this.stamina = this.clamp(
                this.stamina -
                    this.movingStaminaDrainPerSecond *
                    deltaTime,
                0,
                this.maxStamina
            );

            if (this.stamina <= 0) {
                this.startExhaustion();
            }

            return;
        }

        const recoveryMultiplier =
            this.getRecoveryMultiplier();

        this.stamina = this.clamp(
            this.stamina +
                this.idleStaminaRecoveryPerSecond *
                recoveryMultiplier *
                deltaTime,
            0,
            this.maxStamina
        );
    }

    startExhaustion() {
        if (this.isExhausted) {
            return;
        }

        this.stamina = 0;

        this.isExhausted = true;

        this.exhaustionRemaining =
            this.exhaustionDuration;
    }

    updateExhaustion(deltaTime) {
        this.exhaustionRemaining =
            Math.max(
                0,
                this.exhaustionRemaining -
                    deltaTime
            );

        if (
            this.exhaustionRemaining > 0
        ) {
            return;
        }

        this.isExhausted = false;

        this.exhaustionRemaining = 0;

        this.stamina =
            this.exhaustionRecoveryStamina;
    }

    canSpendStamina(amount) {
        if (this.isExhausted) {
            return false;
        }

        return this.stamina >= amount;
    }

    spendStamina(amount) {
        if (!this.canSpendStamina(amount)) {
            return false;
        }

        this.stamina = this.clamp(
            this.stamina - amount,
            0,
            this.maxStamina
        );

        if (this.stamina <= 0) {
            this.startExhaustion();
        }

        return true;
    }

    getMovementSpeedMultiplier() {
        if (
            this.isExhausted ||
            this.stamina <= 0
        ) {
            return 0;
        }

        if (
            this.stamina <=
            this.lowStaminaThreshold
        ) {
            return this
                .lowStaminaMovementMultiplier;
        }

        return 1;
    }

    getCollectionSpeedMultiplier() {
        if (
            this.isExhausted ||
            this.stamina <= 0
        ) {
            return 0;
        }

        if (
            this.stamina <=
            this.lowStaminaThreshold
        ) {
            return this
                .lowStaminaCollectionMultiplier;
        }

        return 1;
    }

    consumeFood({
        satietyAmount,
        staminaAmount
    }) {
        const isCompletelyFull =
            this.satiety >=
                this.maxSatiety &&
            this.stamina >=
                this.maxStamina;

        if (isCompletelyFull) {
            return false;
        }

        this.satiety = this.clamp(
            this.satiety +
                satietyAmount,
            0,
            this.maxSatiety
        );

        if (!this.isExhausted) {
            this.stamina = this.clamp(
                this.stamina +
                    staminaAmount,
                0,
                this.maxStamina
            );
        }

        return true;
    }

    getRecoveryMultiplier() {
        if (this.satiety <= 10) {
            return 0.2;
        }

        if (this.satiety <= 30) {
            return 0.5;
        }

        return 1;
    }

    getConditionMessage() {
        if (this.isExhausted) {
            const remainingSeconds =
                Math.ceil(
                    this.exhaustionRemaining
                );

            return (
                "Exausto. Descansando por " +
                `${remainingSeconds}s.`
            );
        }

        if (this.satiety <= 10) {
            return (
                "Com muita fome. A stamina " +
                "recupera muito lentamente."
            );
        }

        if (this.satiety <= 30) {
            return (
                "Com fome. A recuperação de " +
                "stamina está reduzida."
            );
        }

        if (
            this.stamina <=
            this.lowStaminaThreshold
        ) {
            return (
                "Muito cansado. Movimento e " +
                "coleta estão mais lentos."
            );
        }

        if (this.stamina <= 50) {
            return (
                "Um pouco cansado, mas ainda " +
                "consegue realizar atividades."
            );
        }

        return "Condição estável.";
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