import { Model } from '../types/model';
import { View } from '../types/view';

export const view: View = {
    canvas: null,
    ctx: null,
    timecode: 0,

    redrawGrid(model: Model) {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        if (!canvas) return;

        if (view.canvas === null || view.ctx === null || canvas?.clientWidth !== model.dimension.x || canvas?.clientHeight !== model.dimension.y) {
            view.canvas = canvas;
            view.ctx = view.canvas.getContext('2d');
            view.canvas.width = model.dimension.x;
            view.canvas.height = model.dimension.y;
        }
        view!.ctx!.lineWidth = 1;

        const x0 = model.dimension.x - model.dimensionCloth.x;
        const y0 = model.dimension.y - model.dimensionCloth.y;
        const x1 = model.dimensionCloth.x;
        const y1 = model.dimensionCloth.y;

        view!.ctx!.fillStyle = `#888`;
        view!.ctx!.fillRect(0, 0, model.dimension.x, model.dimension.y);
        view!.ctx!.fillStyle = `#FFF`;

        view!.ctx!.fillStyle = `#228B22`;
        view!.ctx!.fillRect(x0, y0, x1 - x0, y1 - y0);
        view!.ctx!.strokeStyle = `#000`;

        const drawLine = (beginX: number, beginY: number, endX: number, endY: number) => {
            view!.ctx!.beginPath();
            view!.ctx!.moveTo(beginX, beginY);
            view!.ctx!.lineTo(endX, endY);
            view!.ctx!.stroke();
        };

        drawLine(x0, y0, x0, y1);
        drawLine(x1, y0, x1, y1);
        drawLine(x0, y0, x1, y0);
        drawLine(x0, y1, x1, y1);

        const drawHole = (x: number, y: number) => {
            view!.ctx!.beginPath();
            view!.ctx!.arc(x, y, model.pocketSize / 2, 0, 2 * Math.PI, false);
            view!.ctx!.fillStyle = 'black';
            view!.ctx!.fill();
        };

        drawHole(x0, y0);
        drawHole(model.dimension.x / 2, y0);
        drawHole(model.dimension.x - x0, y0);
        drawHole(x0, y1);
        drawHole(model.dimension.x / 2, y1);
        drawHole(model.dimension.x - x0, y1);
    },

    updatePositionBall(model: Model) {
        model.balls.forEach((ball) => {
            switch (ball.color) {
                case 'black':
                    view!.ctx!.fillStyle = `#000`;
                    break;
                case 'white':
                    view!.ctx!.fillStyle = `#FFF`;
                    break;
                case 'blue':
                    view!.ctx!.fillStyle = `#0000FF`;
                    break;
                case 'green':
                    view!.ctx!.fillStyle = `#00FF00`;
                    break;
                case 'red':
                    view!.ctx!.fillStyle = `#FF0000`;
                    break;
                case 'yellow':
                    view!.ctx!.fillStyle = `#FFFF00`;
                    break;
            }

            view!.ctx!.beginPath();
            view!.ctx!.arc(ball.posX, ball.posY, model.ballSize / 2, 0, 2 * Math.PI, false);
            view!.ctx!.fill();
        });
    },

    updatePositionCue: (model: Model) => {
        if (!(model.cueBallFirst.x || model.cueBallFirst.y || model.cueBallSecond.x || model.cueBallSecond.y)) return;

        view!.ctx!.fillStyle = `#000`;

        if (model.cueBallSecond.x || model.cueBallSecond.y) {
            view!.ctx!.lineWidth = 5;
            view!.ctx!.beginPath();
            view!.ctx!.moveTo(model.cueBallFirst.x, model.cueBallFirst.y);
            view!.ctx!.lineTo(model.cueBallSecond.x, model.cueBallSecond.y);
            view!.ctx!.stroke();
        } else {
            view!.ctx!.fillRect(model.cueBallFirst.x - 2.5, model.cueBallFirst.y, 5, 100);
        }
    },

    updateCueVolume: (model: Model) => {
        const cueVolume = model.cueVolume;
        const divX = model.dimension.x - model.dimensionCloth.x;
        const divY = model.dimension.y - model.dimensionCloth.y;
        const x0 = model.dimension.x - (3 * divX) / 4;
        const y0 = divY * 3;
        const x1 = divX / 2;
        const y1 = model.dimension.y - divY * 6;

        view!.ctx!.fillStyle = `#000`;
        view!.ctx!.fillRect(x0, y0, x1, y1);

        view!.ctx!.fillStyle = `#0F0`;
        view!.ctx!.fillRect(x0, y0, x1, y1 - ((100 - cueVolume) * y1) / 100);
    },

    redraw(model: Model) {
        view.redrawGrid(model);
        view.updatePositionBall(model);
        view.updatePositionCue(model);
        view.updateCueVolume(model);
        const timecode = new Date() as unknown as number;
        // console.log(`+${(timecode - this.timecode) / 1000}`); // Performance - time between renders
        this.timecode = timecode;
    },
};
