import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useSize from '@react-hook/size'
import { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'
import { quizReveal, standardSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'

interface ImageData {
  id: number
  x: number
  y: number
  src: string
  imgBlob: HTMLImageElement | null
}

export default function QuizFive() {
  const parentRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [width, height] = useSize(parentRef)
  const [shiftX, setShiftX] = useState<number>(0)
  const originalSize = useAtomValue(standardSize)
  const revealAnswer = useAtomValue(quizReveal)

  const flagURL =
    'https://images.theconversation.com/files/635148/original/file-20241128-17-ek5h29.png?ixlib=rb-4.1.0&q=25&auto=format&h=90&w=50'

  const [images, setImages] = useState<ImageData[]>([
    {
      id: 0,
      x: originalSize.width / 7,
      y: originalSize.height / 1.25,
      src: flagURL,
      imgBlob: null // To store the loaded image
    },
    {
      id: 1,
      x: originalSize.width / 7 - 20,
      y: originalSize.height / 1.25,
      src: flagURL,
      imgBlob: null // To store the loaded image
    }
  ])

  const answerImgs: ImageData[] = []

  useEffect(() => {
    images.forEach((image) => {
      if (!image.imgBlob) {
        const img = new window.Image()
        img.src = image.src
        img.onload = () => {
          setImages((prevImages) =>
            prevImages.map((imgData) => (imgData.id === image.id ? { ...imgData, imgBlob: img } : imgData))
          )
        }
      }
    })
  }, [images])

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    e.evt.preventDefault()
    const y = e.target.y()
    const x = e.target.x()

    setShiftX(calculateXShift(y))

    setImages((prevImages) =>
      prevImages.map((image) => {
        return { ...image, x, y }
      })
    )
  }

  const calculateScale = (y: number) => {
    if (height < 1) return 1
    const normalizedY = y / height
    return 0.2 + normalizedY * 2
  }

  const calculateXShift = (y: number) => {
    const zeroPoint = height / 3
    if (height <= 0) return 0

    const top = 0
    const bottom = height
    // Map `y` to the range [-1, 1], with `zeroPoint` as the middle
    const range = top - bottom
    const normalizedY = (y - zeroPoint) / (range / 2)

    // Clamp the value to stay within [-1, 1]
    const clampedY = Math.max(-1, Math.min(1, normalizedY))

    return clampedY * 50
  }

  return (
    <div className='font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/634719/original/file-20241127-15-e3i137.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
      >
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={width / originalSize.width}
          scaleY={height / originalSize.height}
        >
          <Layer>
            {images.map(
              (image) =>
                image.imgBlob && (
                  <KonvaImage
                    key={image.id}
                    x={image.x}
                    y={image.y}
                    image={image.imgBlob}
                    offsetX={image.imgBlob.width / 2 + (image.id === 0 ? shiftX : 0)}
                    offsetY={image.imgBlob.height / 2 - (image.id === 1 ? 20 : 0)}
                    scaleX={calculateScale(image.y)}
                    scaleY={calculateScale(image.y)}
                    onMouseEnter={() => (stageRef.current!.container().style.cursor = 'pointer')}
                    onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
                    draggable
                    onDragMove={handleDragMove}
                  />
                )
            )}
            {revealAnswer.quiz4 &&
              answerImgs.map(
                (image) =>
                  image.imgBlob && (
                    <KonvaImage
                      key={image.id}
                      x={image.x}
                      y={image.y}
                      image={image.imgBlob}
                      offsetX={image.imgBlob.width / 2 + (image.id === 0 ? shiftX : 0)}
                      offsetY={image.imgBlob.height / 2 - (image.id === 1 ? 20 : 0)}
                      scaleX={calculateScale(image.y)}
                      scaleY={calculateScale(image.y)}
                      onMouseEnter={() => (stageRef.current!.container().style.cursor = 'pointer')}
                      onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
                      draggable
                      onDragMove={handleDragMove}
                    />
                  )
              )}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
