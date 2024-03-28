export type BallColor = 'black' | 'white' | 'red' | 'green' | 'blue' | 'yellow';

export interface Ball {
    posX: number;
    posY: number;
    speedX: number;
    speedY: number;
    color: BallColor;
}

type Status = 'Stop' | 'InProcess';

export interface Position {
    x: number;
    y: number;
}

type СueState = 'first' | 'second' | 'volume' | 'kick' | 'process';

export interface Model {
    status: Status; // Статус игры
    dimension: Position; // Размеры поля
    dimensionCloth: Position; // Размеры скатерти
    cueState: СueState; // Статус битка
    cueVolume: number; // Сила удара
    cueVolumeDirection: 'up' | 'down'; // Направление силы
    cueBallFirst: Position; // Позиция битка первичная
    cueBallSecond: Position; // Позиция битка после установки первичной
    ballSize: number; // Размер шара
    pocketSize: number; // Размер лузы
    balls: Ball[]; // Массив шаров на полотне
    engineTimer: ReturnType<typeof setInterval> | null;
    init: () => void;
    render: () => void;
    getBallFromCoord: (x: number, y: number) => number;
    cuePosChange: (x: number, y: number) => void;
    cueClick: (x: number, y: number) => void;
    start: () => void;
    stop: () => void;
    engine: () => void;
    collisionWall: () => void;
    collisionBall: () => void;
    collision: () => void;
}
