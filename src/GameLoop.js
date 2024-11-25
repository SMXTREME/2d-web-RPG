export class GameLoop {
    constructor(update, render) {
        this.lastFrameTime = 0;
        this.accmulatedTime = 0;
        this.timeStep = 1000 / 60; //60 FPS

        this.update = update;
        this.render = render;

        this.rafId = null;
        this.isRunning = false;
    }

    mainLoop = (timestamp) => {
        if (!this.isRunning) return;

        let deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        //Accumulate all the time since the last frame
        this.accmulatedTime += deltaTime;

        while (this.accmulatedTime >= this.timeStep) {
            this.update(this.timeStep);
            this.accmulatedTime -= this.timeStep;
        }

        this.render();

        this.rafId = requestAnimationFrame(this.mainLoop);
    };

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.rafId = requestAnimationFrame(this.mainLoop);
        }
    }

    stop() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        this.isRunning = false;
    }
}
