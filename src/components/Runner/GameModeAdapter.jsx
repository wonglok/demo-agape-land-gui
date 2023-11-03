import { RoomView } from 'agape-sdk'
import { BirdWalk } from 'agape-sdk'
import { ProductView } from 'agape-sdk'

export function GameModeAdapter({ useStore }) {
  let gameMode = useStore((r) => r.gameMode)

  return (
    <>
      {/*  */}
      {gameMode === 'orbit' && (
        <>
          <ProductView useStore={useStore}></ProductView>
        </>
      )}
      {gameMode === 'street' && <BirdWalk useStore={useStore}></BirdWalk>}
      {gameMode === 'room' && <RoomView useStore={useStore}></RoomView>}
    </>
  )
}

//
