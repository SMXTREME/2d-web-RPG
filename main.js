import { GameLoop } from './src/GameLoop.js';
import {
    STAND_DOWN,
    STAND_LEFT,
    STAND_RIGHT,
    STAND_UP,
    WALK_DOWN,
    WALK_LEFT,
    WALK_RIGHT,
    WALK_UP,
} from './src/objects/Hero/heroAnimation.js';
import { resources } from './src/Resources.js';
import { Sprite } from './src/Sprite.js';
import { Vector2 } from './src/Vector2.js';
import { Input, UP, DOWN, LEFT, RIGHT } from './src/Input.js';
import { gridCells, isSpaceFree } from './src/helpers/grid.js';
import { moveTowards } from './src/helpers/moveTowards.js';
import { walls } from './src/levels/level1.js';
import { Animations } from './src/Animations.js';
import { FrameIndexPattern } from './src/FrameIndexPattern.js';

const canvas = document.querySelector('#game-canvas');
const ctx = canvas.getContext('2d');

const skySprite = new Sprite({
    resource: resources.images.sky,
    frameSize: new Vector2(320, 180),
});

const groundSprite = new Sprite({
    resource: resources.images.ground,
    frameSize: new Vector2(320, 180),
});

const hero = new Sprite({
    resource: resources.images.hero,
    frameSize: new Vector2(32, 32),
    hFrame: 3,
    vFrame: 8,
    frame: 1,
    position: new Vector2(gridCells(6), gridCells(5)),
    animations: new Animations({
        walkDown: new FrameIndexPattern(WALK_DOWN),
        walkLeft: new FrameIndexPattern(WALK_LEFT),
        walkRight: new FrameIndexPattern(WALK_RIGHT),
        walkUp: new FrameIndexPattern(WALK_UP),
        standDown: new FrameIndexPattern(STAND_DOWN),
        standLeft: new FrameIndexPattern(STAND_LEFT),
        standRight: new FrameIndexPattern(STAND_RIGHT),
        standUp: new FrameIndexPattern(STAND_UP),
    }),
});

const heroDestinationPosition = hero.position.duplicate();
let heroFacing = DOWN;

const shadow = new Sprite({
    resource: resources.images.shadow,
    frameSize: new Vector2(32, 32),
});

const input = new Input();

const update = (delta) => {
    const distance = moveTowards(hero, heroDestinationPosition, 1);
    const hasArrived = distance <= 1;
    if (hasArrived) {
        tryMove();
    }

    hero.step(delta);
};

const tryMove = () => {
    if (!input.direction) {
        if (heroFacing === LEFT) hero.animations.play('standLeft');
        if (heroFacing === RIGHT) hero.animations.play('standRight');
        if (heroFacing === UP) hero.animations.play('standUp');
        if (heroFacing === DOWN) hero.animations.play('standDown');

        return;
    }

    let nextX = heroDestinationPosition.x;
    let nextY = heroDestinationPosition.y;
    const gridSize = 16;

    if (input.direction === DOWN) {
        nextY += gridSize;
        hero.animations.play('walkDown');
    }
    if (input.direction === UP) {
        nextY -= gridSize;
        hero.animations.play('walkUp');
    }
    if (input.direction === LEFT) {
        nextX -= gridSize;
        hero.animations.play('walkLeft');
    }
    if (input.direction === RIGHT) {
        nextX += gridSize;
        hero.animations.play('walkRight');
    }

    heroFacing = input.direction ?? heroFacing;

    if (isSpaceFree(walls, nextX, nextY)) {
        heroDestinationPosition.x = nextX;
        heroDestinationPosition.y = nextY;
    }
};

const draw = () => {
    skySprite.drawImage(ctx, 0, 0);
    groundSprite.drawImage(ctx, 0, 0);

    const heroOffset = new Vector2(-8, -21);
    const heroPosX = hero.position.x + heroOffset.x;
    const heroPosY = hero.position.y + 1 + heroOffset.y;

    shadow.drawImage(ctx, heroPosX, heroPosY);
    hero.drawImage(ctx, heroPosX, heroPosY);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
