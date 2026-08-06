export class Resource {
    constructor({
        id,
        type,
        name,
        x,
        y,
        radius,
        inventoryKey,
        yieldLabel,
        yieldAmount,
        collectionDuration,
        staminaCost,
        actionLabel
    }) {
        this.id = id;
        this.type = type;
        this.name = name;

        this.x = x;
        this.y = y;
        this.radius = radius;

        this.inventoryKey = inventoryKey;
        this.yieldLabel = yieldLabel;
        this.yieldAmount = yieldAmount;

        this.collectionDuration =
            collectionDuration;

        this.staminaCost = staminaCost;
        this.actionLabel = actionLabel;

        this.isDepleted = false;
    }

    containsPoint(x, y) {
        const distance = Math.hypot(
            x - this.x,
            y - this.y
        );

        return distance <= this.radius;
    }
}