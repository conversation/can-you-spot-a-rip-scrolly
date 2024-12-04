import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva'
import useSize from '@react-hook/size'
import { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'
import { quizReveal, standardSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'
import useImage from 'use-image'

interface ImageData {
  id: number
  x: number
  y: number
  // src: string
  imgBlob: HTMLImageElement | undefined
}

export default function QuizFive() {
  const parentRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [width, height] = useSize(parentRef)
  const originalSize = useAtomValue(standardSize)
  const revealAnswer = useAtomValue(quizReveal)

  const flagURL =
    'https://images.theconversation.com/files/635148/original/file-20241128-17-ek5h29.png?ixlib=rb-4.1.0&q=25&auto=format&h=90&w=50'

  const [flagImg] = useImage(flagURL, 'anonymous')
  const [images, setImages] = useState<ImageData[]>([
    // {
    //   id: 0,
    //   x: width * 0.011,
    //   y: height * 0.01,
    //   // x: originalSize.width / 7,
    //   // y: originalSize.height / 1.25,
    //   src: flagURL,
    //   imgBlob: null
    // },
    // {
    //   id: 1,
    //   x: originalSize.width / 7,
    //   y: originalSize.height / 1.25,
    //   src: flagURL,
    //   imgBlob: null
    // }
  ])

  useEffect(() => {
    if (width > 0 && height > 0) {
      setImages([
        {
          id: 0,
          x: width * 0.5,
          y: height * 0.5,
          // x: originalSize.width / 7,
          // y: originalSize.height / 1.25,
          imgBlob: undefined
        },
        {
          id: 1,
          x: width * 0.5,
          y: height * 0.5,
          imgBlob: undefined
        }
      ])
    }
  }, [width, height])

  useEffect(() => {
    if (images.length) {
      // images.forEach((image) => {
      //   const img = new window.Image()
      //   img.src = image.src
      //   img.onload = () => {
      //     setImages((prevImages) =>
      //       prevImages.map((imgData) => (imgData.id === image.id ? { ...imgData, imgBlob: img } : imgData))
      //     )
      //   }
      // })
      setImages((prevImages) => prevImages.map((imgData) => ({ ...imgData, imgBlob: flagImg })))
    }
  }, [flagImg])

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    // e.evt.preventDefault()
    const y = e.target.y()
    const x = e.target.x()

    // setShiftX(calculateXShift(y))

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

    return clampedY * (width / 50)
  }

  return (
    <div className='font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/634719/original/file-20241127-15-e3i137.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
      >
        {/* <div className='w-[150%] md:w-full'>
          <img
            src='https://images.theconversation.com/files/634719/original/file-20241127-15-e3i137.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800'
            alt=''
            className='not_full_screen h-full w-full object-cover object-[0%_0%] opacity-100'
          />
        </div> */}
        <Stage
          ref={stageRef}
          width={width}
          height={height}
          scaleX={width / originalSize.width}
          scaleY={height / originalSize.height}
        >
          <Layer>
            {!revealAnswer.quiz4 &&
              images.map(
                (image) =>
                  image.imgBlob && (
                    <KonvaImage
                      key={image.id}
                      x={image.x}
                      y={image.y}
                      image={image.imgBlob}
                      width={image.imgBlob.width * (window.innerWidth / 2000)}
                      height={image.imgBlob.height * (window.innerWidth / 2000)}
                      offsetX={
                        image.imgBlob.width * (window.innerWidth / 2000) +
                        (image.id === 0 ? calculateXShift(image.y) : 0)
                      }
                      offsetY={
                        image.imgBlob.width * (window.innerWidth / 2000) -
                        (image.id === 1 ? (image.imgBlob.height * (window.innerWidth / 2000)) / 3 : 0)
                      }
                      scaleX={calculateScale(image.y) * (width / originalSize.width)}
                      scaleY={calculateScale(image.y) * (height / originalSize.height)}
                      onMouseEnter={() => (stageRef.current!.container().style.cursor = 'pointer')}
                      onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
                      draggable
                      onDragMove={handleDragMove}
                    />
                  )
              )}
            {revealAnswer.quiz4 &&
              images.map(
                (image) =>
                  image.imgBlob && (
                    <KonvaImage
                      ref={(node) => {
                        if (node && revealAnswer.quiz4) {
                          node.setAttr('filters', [Konva.Filters.Grayscale])
                          node.cache()
                        }
                      }}
                      key={image.id}
                      x={image.x}
                      y={image.y}
                      image={image.imgBlob}
                      width={image.imgBlob.width * (window.innerWidth / 2000)}
                      height={image.imgBlob.height * (window.innerWidth / 2000)}
                      offsetX={
                        image.imgBlob.width * (window.innerWidth / 2000) +
                        (image.id === 0 ? calculateXShift(image.y) : 0)
                      }
                      offsetY={
                        image.imgBlob.width * (window.innerWidth / 2000) -
                        (image.id === 1 ? (image.imgBlob.height * (window.innerWidth / 2000)) / 3 : 0)
                      }
                      scaleX={calculateScale(image.y) * (width / originalSize.width)}
                      scaleY={calculateScale(image.y) * (height / originalSize.height)}
                      // onMouseEnter={() => (stageRef.current!.container().style.cursor = 'pointer')}
                      // onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
                      // draggable
                      // onDragMove={handleDragMove}
                    />
                  )
              )}
          </Layer>
        </Stage>
        <div
          className='not_full_screen pointer-events-none absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out'
          style={{ opacity: revealAnswer.quiz4 ? 1 : 0 }}
        >
          <img
            src='https://images.theconversation.com/files/636057/original/file-20241204-15-cwtr4c.png?ixlib=rb-4.1.0&q=45&auto=format&w=1200'
            className='not_full_screen h-full w-full object-cover opacity-100'
          />
        </div>
      </div>
    </div>
  )
}
