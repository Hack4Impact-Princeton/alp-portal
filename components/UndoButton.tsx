import React from 'react'

const UndoButton: React.FC<{ active: boolean, undo: () => void }> = ({ active, undo }) => {
    return (
        <>
            {active && <img style={{ cursor: "pointer", width: "auto", height: 30 }} src="/undo-icon-black.png" onClick={undo}></img>}
            {!active && <img style={{ width: "auto", height: 30 }} src="/undo-icon-gray.png"></img>}
        </>
    )
}

export default UndoButton