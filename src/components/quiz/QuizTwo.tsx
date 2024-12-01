import { useRef, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import useSize from '@react-hook/size'
import { KonvaEventObject } from 'konva/lib/Node'
import { useAtomValue } from 'jotai'
import { standardSize } from '../../context/Atoms'

export default function QuizTwo() {
  const parentRef = useRef(null)
  const [width, height] = useSize(parentRef)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lines, setLines] = useState<{ points: number[]; stroke: string }[]>([])

  const originalSize = useAtomValue(standardSize)

  // Calculate the scaling factors
  const scaleX = width / originalSize.width
  const scaleY = height / originalSize.height

  const handlePointerDown = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    setIsDrawing(true)
    const stage = e.target.getStage()

    if (!stage) return

    const point = stage.getPointerPosition()

    // Adjust point to original coordinates
    const adjustedPoint = {
      x: point!.x / scaleX,
      y: point!.y / scaleY
    }

    // Start a new line with stroke 'red'
    setLines([...lines, { points: [adjustedPoint.x, adjustedPoint.y], stroke: '#d8352a' }])
  }

  const handlePointerMove = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    e.evt.preventDefault()
    if (!isDrawing) return

    const stage = e.target.getStage()

    if (!stage) return

    const point = stage.getPointerPosition()

    // Adjust point to original coordinates
    const adjustedPoint = {
      x: point!.x / scaleX,
      y: point!.y / scaleY
    }

    // Update the last line's points
    setLines((prevLines) => {
      const updatedLines = prevLines.slice()
      const lastLine = { ...updatedLines[updatedLines.length - 1] }
      lastLine.points = lastLine.points.concat([adjustedPoint.x, adjustedPoint.y])
      updatedLines[updatedLines.length - 1] = lastLine
      return updatedLines
    })
  }

  const handlePointerUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)

    setLines((prevLines) => {
      const updatedLines = prevLines.slice()
      const lastLine = { ...updatedLines[updatedLines.length - 1] }
      if (lastLine) {
        lastLine.stroke = '#29a37a'
        updatedLines[updatedLines.length - 1] = lastLine
      }
      return updatedLines
    })
  }

  const handleClearLines = () => {
    setLines([])
  }

  return (
    <div className='font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/634720/original/file-20241127-15-fsgcdl.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
      >
        <Stage
          width={width}
          height={height}
          scaleX={scaleX}
          scaleY={scaleY}
          onMouseDown={handlePointerDown}
          onTouchStart={handlePointerDown}
          onMouseMove={handlePointerMove}
          onTouchMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchEnd={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchCancel={handlePointerUp}
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={4}
                tension={0.4}
                lineCap='round'
                lineJoin='round'
              />
            ))}
          </Layer>
        </Stage>

        <div className='absolute left-2 top-2 text-sm md:text-lg'>
          <button
            onClick={handleClearLines}
            className='cursor-pointer bg-neutral-500/20 p-2 text-white backdrop-blur-sm transition-all duration-150 ease-in-out hover:text-neutral-100 hover:shadow-lg active:scale-95'
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
