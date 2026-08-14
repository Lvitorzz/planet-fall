export class Spaceship {
    constructor({
        x,
        y,
        radius = 85
    }) {
        this.x = x;
        this.y = y;

        this.radius = radius;

        this.name =
            "Nave danificada";

        this.maxIntegrity =
            250;

        this.integrity =
            250;

        this.modules = {
            generator: {
                id:
                    "generator",

                name:
                    "Gerador",

                description:
                    "Restaura a alimentação elétrica básica da nave.",

                status:
                    "damaged",

                scrapCost: 6,

                staminaCost: 15,

                repairDuration: 6
            },

            radar: {
                id:
                    "radar",

                name:
                    "Radar",

                description:
                    "Permite detectar ameaças e pontos de interesse.",

                status:
                    "locked"
            },

            engine: {
                id:
                    "engine",

                name:
                    "Motor",

                description:
                    "Sistema necessário para escapar do planeta.",

                status:
                    "locked"
            }
        };
    }

    containsPoint(x, y) {
        const distance =
            Math.hypot(
                x - this.x,
                y - this.y
            );

        return (
            distance <=
            this.radius
        );
    }

    takeDamage(amount) {
        this.integrity =
            Math.max(
                0,
                this.integrity -
                    amount
            );
    }

    repairIntegrity(amount) {
        this.integrity =
            Math.min(
                this.maxIntegrity,
                this.integrity +
                    amount
            );
    }

    isDestroyed() {
        return (
            this.integrity <= 0
        );
    }

    getModule(moduleId) {
        return (
            this.modules[
                moduleId
            ] ?? null
        );
    }

    isModuleRepaired(
        moduleId
    ) {
        return (
            this.getModule(
                moduleId
            )?.status ===
            "repaired"
        );
    }

    repairModule(moduleId) {
        const module =
            this.getModule(
                moduleId
            );

        if (!module) {
            return false;
        }

        module.status =
            "repaired";

        if (
            moduleId ===
            "generator"
        ) {
            this.modules
                .radar
                .status =
                "available";
        }

        return true;
    }
}