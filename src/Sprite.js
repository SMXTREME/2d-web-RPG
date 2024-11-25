import { Vector2 } from './Vector2.js';

export class Sprite {
    constructor({ resource, frameSize, hFrame, vFrame, frame, scale, position }) {
        this.resource = resource;
        this.frameSize = frameSize ?? new Vector2(16, 16);
        this.hFrame = hFrame ?? 1;
        this.vFrame = vFrame ?? 1;
        this.frame = frame ?? 0;
        this.frameMap = new Map();
        this.scale = scale ?? 1;
        this.position = position ?? new Vector2(0, 0);
        this.buildFrameMap();
    }

    buildFrameMap() {
        let frameCount = 0;
        for (let v = 0; v < this.vFrame; v++) {
            for (let h = 0; h < this.hFrame; h++) {
                this.frameMap.set(
                    frameCount,
                    new Vector2(this.frameSize.x * h, this.frameSize.y * v)
                );
                frameCount++;
            }
        }
    }

    drawImage(ctx, x, y) {
        if (!this.resource.isLoaded) return;

        // Find correct sprite sheet frame to use
        let frameCoordX = 0;
        let frameCoordY = 0;
        const frame = this.frameMap.get(this.frame);
        if (frame) {
            frameCoordX = frame.x;
            frameCoordY = frame.y;
        }

        const frameSizeX = this.frameSize.x;
        const frameSizeY = this.frameSize.y;

        ctx.drawImage(
            this.resource.image,
            frameCoordX,
            frameCoordY,
            frameSizeX,
            frameSizeY,
            x,
            y,
            frameSizeX * this.scale,
            frameSizeY * this.scale
        );
    }
}
