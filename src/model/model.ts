import { Ball, Model, Position } from '../types/model';

const dimension: Position = {
    x: 1200,
    y: 600,
};
const ballSize = 30;
const pocketSize = 50;
const ballMass = 0.5;
const delta = 50;
const renderFrame = 50;
const impulseLostWay = 1; // % / render
const impulseLostWall = 4.5; // %
const impulseLostBall = 2.5; // %

export const model: Model = {
    status: 'Stop',
    dimension: {
        x: dimension.x,
        y: dimension.y,
    },
    dimensionCloth: {
        x: dimension.x - delta,
        y: dimension.y - delta,
    },
    cueState: 'first',
    cueVolume: 0,
    cueVolumeDirection: 'up',
    cueBallFirst: { x: 0, y: 0 },
    cueBallSecond: { x: 0, y: 0 },
    ballSize: ballSize,
    pocketSize: pocketSize,
    balls: [],
    engineTimer: null,
    init: () => {
        model.cueState = 'first';
        const ballsPosInit: Ball[] = [];
        ballsPosInit.push({ posX: dimension.x / 4, posY: dimension.y / 2, speedX: 0, speedY: 0, color: 'white' });

        for (let i = 1; i < 6; i++) {
            for (let j = 0; j < i; j++) {
                ballsPosInit.push({
                    posX: (3 * dimension.x) / 4 - (ballSize + 1) * j,
                    posY: dimension.y / 2 - (ballSize + 1) * (j / 2 - (i - 3)),
                    speedX: 0,
                    speedY: 0,
                    color: 'white',
                });
            }
        }

        model.balls = ballsPosInit;
        model.cueBallFirst = { x: 0, y: 0 };
        model.cueBallSecond = { x: 0, y: 0 };
        model.cueVolume = 0;
    },
    render: () => {},
    getBallFromCoord: (x: number, y: number) => {
        const pos = model.balls.findIndex((ball) => {
            const dx = ball.posX - x;
            const dy = ball.posY - y;

            if (Math.sqrt(dx * dx + dy * dy) < model.ballSize / 2) return true;

            return false;
        });

        return pos;
    },
    cuePosChange: (x: number, y: number) => {
        if (model.cueState === 'first') {
            model.cueBallFirst.x = x;
            model.cueBallFirst.y = y;
        } else if (model.cueState === 'second') {
            model.cueBallSecond.x = x;
            model.cueBallSecond.y = y;
        }
    },
    cueClick: (x: number, y: number) => {
        const pos = model.getBallFromCoord(x, y);

        if (model.cueState === 'first' && pos !== -1) {
            model.cueState = 'second';
        } else if (model.cueState === 'second') {
            model.cueState = 'volume';
        } else if (model.cueState === 'volume') {
            model.cueState = 'kick';
        }
    },
    start: () => {
        model.status = 'InProcess';
        model.init();
        model.engineTimer = setInterval(() => {
            if (model.cueState === 'volume') {
                let volume = model.cueVolume;

                if (model.cueVolumeDirection === 'up') {
                    volume += renderFrame / 100;

                    if (volume > 100) {
                        volume = 100;
                        model.cueVolumeDirection = 'down';
                    }
                } else {
                    volume -= renderFrame / 100;

                    if (volume < 0) {
                        volume = 0;
                        model.cueVolumeDirection = 'up';
                    }
                }

                model.cueVolume = volume;
            }

            model.engine();
            model.render();
        }, 1000 / renderFrame);
    },
    stop: () => {
        if (model.engineTimer) clearInterval(model.engineTimer);

        model.status = 'Stop';
        model.engineTimer = null;
        model.init();
        model.render();
    },
    engine: () => {
        if (model.cueState === 'kick') {
            const pos = model.getBallFromCoord(model.cueBallFirst.x, model.cueBallFirst.y);
            const dx = model.cueBallFirst.x - model.cueBallSecond.x;
            const dy = model.cueBallFirst.y - model.cueBallSecond.y;
            const modDX = Math.abs(dx);
            const modDY = Math.abs(dy);
            let speedX = 0;
            let speedY = 0;

            if (modDX > modDY) {
                speedX = Math.cos(modDY / modDX);
                speedY = Math.sin(modDY / modDX);
            } else {
                speedX = Math.sin(modDX / modDY);
                speedY = Math.cos(modDX / modDY);
            }

            model.balls[pos].speedX = model.cueVolume * speedX;
            model.balls[pos].speedY = model.cueVolume * speedY;

            if (dx < 0) model.balls[pos].speedX *= -1;
            if (dy < 0) model.balls[pos].speedY *= -1;

            model.cueBallFirst = { x: 0, y: 0 };
            model.cueBallSecond = { x: 0, y: 0 };
            model.cueVolume = 0;
            model.cueState = 'process';
        } else if (model.cueState === 'process') {
            model.balls.forEach((ball) => {
                ball.posX += ball.speedX * ballMass;
                ball.posY += ball.speedY * ballMass;
            });

            model.collision();

            let speed = model.balls.reduce((acc, ball) => acc + Math.abs(ball.speedX) + Math.abs(ball.speedY), 0);

            if (speed <= 0) model.cueState = 'first';
        }
    },
    collisionWall: () => {
        const minDX = model.dimension.x - model.dimensionCloth.x + model.ballSize / 2;
        const minDY = model.dimension.y - model.dimensionCloth.y + model.ballSize / 2;
        const maxDX = model.dimensionCloth.x - model.ballSize / 2;
        const maxDY = model.dimensionCloth.y - model.ballSize / 2;

        model.balls.forEach((ball) => {
            if ((ball.posX < minDX && ball.speedX < 0) || (ball.posX > maxDX && ball.speedX > 0)) ball.speedX *= -1;
            if ((ball.posY < minDY && ball.speedY < 0) || (ball.posY > maxDY && ball.speedY > 0)) ball.speedY *= -1;

            if (ball.posX < minDX || ball.posY < minDY || ball.posX > maxDX || ball.posY > maxDY) {
                ball.speedX -= (ball.speedX * impulseLostWall) / 100;
                ball.speedY -= (ball.speedY * impulseLostWall) / 100;
                if (-0.1 < ball.speedX && ball.speedX < 0.1) ball.speedX = 0;
                if (-0.1 < ball.speedY && ball.speedY < 0.1) ball.speedY = 0;
            }
        });
    },
    collisionBall: () => {
        for (let i = 0; i < model.balls.length; i++) {
            for (let j = i + 1; j < model.balls.length; j++) {
                const dx = model.balls[i].posX - model.balls[j].posX;
                const dy = model.balls[i].posY - model.balls[j].posY;

                if (Math.sqrt(dx * dx + dy * dy) > model.ballSize) continue;

                const angle = Math.atan2(dy, dx);
                const speed1 = Math.sqrt(model.balls[i].speedX * model.balls[i].speedX + model.balls[i].speedY * model.balls[i].speedY);
                const speed2 = Math.sqrt(model.balls[j].speedX * model.balls[j].speedX + model.balls[j].speedY * model.balls[j].speedY);
                const direction1 = Math.atan2(model.balls[i].speedY, model.balls[i].speedX);
                const direction2 = Math.atan2(model.balls[j].speedY, model.balls[j].speedX);

                const velocityX1 = speed1 * Math.cos(direction1 - angle);
                const velocityY1 = speed1 * Math.sin(direction1 - angle);
                const velocityX2 = speed2 * Math.cos(direction2 - angle);
                const velocityY2 = speed2 * Math.sin(direction2 - angle);
                const radius = model.ballSize / 2;
                const finalVelocityX1 = (velocityX1 + model.ballSize * velocityX2) / model.ballSize;
                const finalVelocityX2 = (velocityX2 + model.ballSize * velocityX1) / model.ballSize;

                model.balls[i].speedX = Math.cos(angle) * finalVelocityX1 + Math.cos(angle + Math.PI / 2) * velocityY1;
                model.balls[i].speedY = Math.sin(angle) * finalVelocityX1 + Math.sin(angle + Math.PI / 2) * velocityY1;
                model.balls[j].speedX = Math.cos(angle) * finalVelocityX2 + Math.cos(angle + Math.PI / 2) * velocityY2;
                model.balls[j].speedY = Math.sin(angle) * finalVelocityX2 + Math.sin(angle + Math.PI / 2) * velocityY2;
            }
        }
    },
    collision: () => {
        model.balls.forEach((ball) => {
            ball.speedX -= (ball.speedX * impulseLostWay) / 100;
            ball.speedY -= (ball.speedY * impulseLostWay) / 100;
            if (-0.1 < ball.speedX && ball.speedX < 0.1) ball.speedX = 0;
            if (-0.1 < ball.speedY && ball.speedY < 0.1) ball.speedY = 0;
        });
        model.collisionWall();
        model.collisionBall();
    },
};
