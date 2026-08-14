export class TimeSystem {
    constructor() {
        this.dayNumber = 1;

        this.phase = "day";
        this.phaseElapsed = 0;

        this.durations = {
            day: 90,
            dusk: 15,
            night: 45,
            dawn: 15
        };
    }

    update(deltaTime) {
        this.phaseElapsed += deltaTime;

        const currentDuration =
            this.durations[this.phase];

        if (
            this.phaseElapsed <
            currentDuration
        ) {
            return null;
        }

        this.phaseElapsed = 0;

        return this.advancePhase();
    }

    advancePhase() {
        if (this.phase === "day") {
            this.phase = "dusk";

            return {
                phase: "dusk",
                message:
                    "O sol está se pondo..."
            };
        }

        if (this.phase === "dusk") {
            this.phase = "night";

            return {
                phase: "night",
                message:
                    "A noite começou."
            };
        }

        if (this.phase === "night") {
            this.phase = "dawn";

            return {
                phase: "dawn",
                message:
                    "O amanhecer está chegando."
            };
        }

        this.phase = "day";
        this.dayNumber += 1;

        return {
            phase: "day",
            message:
                `Dia ${this.dayNumber} começou.`
        };
    }

    getPhaseProgress() {
        return Math.min(
            this.phaseElapsed /
                this.durations[this.phase],
            1
        );
    }

    getRemainingSeconds() {
        return Math.max(
            0,
            this.durations[this.phase] -
                this.phaseElapsed
        );
    }

    getPhaseLabel() {
        const labels = {
            day: "Dia",
            dusk: "Entardecer",
            night: "Noite",
            dawn: "Amanhecer"
        };

        return labels[this.phase];
    }

    getPhaseIcon() {
        const icons = {
            day: "☀",
            dusk: "◐",
            night: "☾",
            dawn: "◑"
        };

        return icons[this.phase];
    }

    getCountdownLabel() {
        if (this.phase === "day") {
            return "Entardecer em";
        }

        if (this.phase === "dusk") {
            return "Noite em";
        }

        if (this.phase === "night") {
            return "Amanhecer em";
        }

        return "Novo dia em";
    }

    getDarknessAlpha() {
        const progress =
            this.getPhaseProgress();

        if (this.phase === "day") {
            return 0;
        }

        if (this.phase === "dusk") {
            return 0.62 * progress;
        }

        if (this.phase === "night") {
            return 0.62;
        }

        if (this.phase === "dawn") {
            return 0.62 * (1 - progress);
        }

        return 0;
    }

    isNight() {
        return this.phase === "night";
    }
}