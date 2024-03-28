import { useEffect, useRef, useState } from 'react';
import { model } from './model/model';
import { view } from './view/view';
import { ContextMenu } from './ContextMenu';
import { BallColor } from './types/model';

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
    const [menuVisible, setMenuVisible] = useState(false);
    const [statusGame, setStatusGame] = useState(model.status);

    const onCloseMenu = () => {
        setMenuVisible(false);
    };

    const onSetColor = (e: React.MouseEvent) => {
        onCloseMenu();

        const pos = model.getBallFromCoord(coordinates.offsetX, coordinates.offsetY);

        if (pos === -1) return;

        model.balls[pos].color = e.currentTarget.innerHTML as BallColor;
        model.render();
    };

    const onChangeGame = () => {
        if (model.status === 'InProcess') {
            model.stop();
        } else {
            model.start();
        }

        setStatusGame(model.status);
    };

    const onMouseMove = (e: MouseEvent) => {
        model.cuePosChange(e.offsetX, e.offsetY);
    };

    const onMouseUp = (e: MouseEvent) => {
        if (e.button === 2) {
            if (model.getBallFromCoord(e.offsetX, e.offsetY) === -1) return;

            setCoordinates({ x: e.x, y: e.y, offsetX: e.offsetX, offsetY: e.offsetY });
            setMenuVisible(true);
            console.log(`onMouseUp`);
        } else if (e.button === 0) {
            if (menuVisible) {
                onCloseMenu();
            } else {
                model.cueClick(e.offsetX, e.offsetY);
            }
        }
    };

    useEffect(() => {
        model.render = () => view.redraw(model);
        model.init();
        model.render();

        canvasRef?.current?.addEventListener('mouseup', onMouseUp);
        canvasRef?.current?.addEventListener('mousemove', onMouseMove);

        return () => {
            canvasRef?.current?.removeEventListener('mouseup', onMouseUp);
            canvasRef?.current?.removeEventListener('mousemove', onMouseMove);
        };
    }, []);

    return (
        <>
            <canvas onContextMenu={(e) => e.preventDefault()} ref={canvasRef} id="canvas"></canvas>
            <ContextMenu visible={menuVisible} {...coordinates} onClose={onCloseMenu} onSetMenu={onSetColor} />
            <button className="button" onClick={onChangeGame}>{`Game status: ${statusGame}`}</button>
        </>
    );
};
