import { Model } from './model';

export interface View {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    timecode: number;
    redrawGrid: (model: Model) => void;
    updatePositionBall: (model: Model) => void;
    updatePositionCue: (model: Model) => void;
    updateCueVolume: (model: Model) => void;
    redraw: (model: Model) => void;
}
