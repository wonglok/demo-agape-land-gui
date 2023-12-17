import { useEffect } from 'react'

export function GUINode({ self, parent }) {
  useEffect(() => {
    if (parent === null) {
    }
    //
    //
    //
    //
  }, [self, parent])

  return (
    <>
      {/*  */}

      {self.children.map((child) => {
        return <GUINode key={child.oid} parent={self} self={child}></GUINode>
      })}

      {/*  */}
    </>
  )
}
