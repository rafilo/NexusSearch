import { X } from 'lucide-react'
import Draggable from 'react-draggable'
import { useEffect, useRef, useState } from 'react'

import { actions, useAppDispatch, useAppSelector } from 'redux/provider'
import { DraggableContainerType } from 'types'
import { cn, getComponentID } from 'lib/utils'

function DraggableContainer({ handleClose, title, children }) {
  const [cId] = useState(getComponentID())
  const dispatch = useAppDispatch()
  const containerRef = useRef(null)
  const current = useAppSelector((state) => {
    return state.component.draggableContainers.filter(
      (container) => container.cId === cId
    )[0]
  })

  useEffect(() => {
    const newContainer: DraggableContainerType = {
      cId: cId,
      status: 'hidden',
    }
    dispatch(actions.addDraggableContainer(newContainer))
  }, [])

  useEffect(() => {
    console.log(current)
  }, [current])

  const handleFocus = () => {
    dispatch(
      actions.setDraggableContainer({
        cId: cId,
        status: 'active',
      })
    )
  }

  const handleClickOutside = () => {
    dispatch(
      actions.setDraggableContainer({
        cId: cId,
        status: 'hidden',
      })
    )
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dispatch])

  return (
    <Draggable handle=".handle">
      <div
        ref={containerRef}
        onClick={handleFocus}
        className={cn(
          ` fixed top-1/4 left-3 h-[750px] w-[650px] p-6 bg-white-100 rounded-3xl `,
          {
            'opacity-50 z-10 ': current?.status === 'hidden',
            ' z-20 drop-shadow-lg border-lightTheme-textLight dark:border-darkTheme-hoverLight':
              current?.status === 'active',
          }
        )}
      >
        <div className={'flex flex-col'}>
          <div className={'flex flex-row justify-between items-center'}>
            {/* Drag and Drop*/}
            <div
              className={
                'handle flex-grow cursor-move text-lightTheme-textTitle hover:text-lightTheme-textSubtitle dark:text-darkTheme-textHighlight dark:hover:text-darkTheme-white'
              }
            >
              <h2 className={'text-2xl text-center'}>
                <b>{title}</b>
              </h2>
            </div>

            {/* Handle Close */}
            <div
              onClick={() => handleClose(false, cId)}
              className={
                'text-lightTheme-textTitle hover:text-lightTheme-textLight dark:text-darkTheme-textCaption dark:hover:text-darkTheme-white cursor-pointer'
              }
            >
              <X />
            </div>
          </div>

          {/* Content*/}
          <div>{children}</div>
        </div>
      </div>
    </Draggable>
  )
}

export default DraggableContainer
