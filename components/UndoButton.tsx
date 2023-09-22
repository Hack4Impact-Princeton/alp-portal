

const UndoButton: React.FC<{ undo: () => void }> = ({ undo }) => {
    return <>
        <img style={{ cursor: "pointer", width: "auto", height: 30 }} src="/undo-icon-black.png" onClick={undo}></img>
    </>
}

export default UndoButton