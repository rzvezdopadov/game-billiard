import './ContextMenu.css';

interface ContextMenuProps {
    visible?: boolean;
    onClose?: (e) => void;
    onSetMenu?: (e: React.MouseEvent) => void;
    y?: number;
    x?: number;
}

export const ContextMenu = (props: ContextMenuProps) => {
    return (
        <>
            {props.visible && (
                <div className="contextMenu_wrapper" style={{ left: props.x! + 1, top: props.y! + 1 }} autoFocus={false}>
                    <span className="contextMenu_item" onClick={props.onSetMenu} autoFocus={false}>
                        black
                    </span>
                    <span className="contextMenu_item" onClick={props.onSetMenu} autoFocus={false}>
                        white
                    </span>
                    <span className="contextMenu_item" onClick={props.onSetMenu} autoFocus={false}>
                        red
                    </span>
                    <span className="contextMenu_item" onClick={props.onSetMenu} autoFocus={false}>
                        green
                    </span>
                    <span className="contextMenu_item" onClick={props.onSetMenu} autoFocus={false}>
                        blue
                    </span>
                    <span className="contextMenu_item" onClick={props.onSetMenu} autoFocus={false}>
                        yellow
                    </span>
                </div>
            )}
        </>
    );
};
