import { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Image as KonvaImage } from 'react-konva/lib/ReactKonvaCore'
import useSize from '@react-hook/size'
import { KonvaEventObject } from 'konva/lib/Node'
import Konva from 'konva'
import { quizReveal, standardSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'
import useImage from 'use-image'
import BackgroundImage from '../BackgroundImage'

// export default function QuizFive() {
//   const parentRef = useRef<HTMLDivElement>(null)
//   const stageRef = useRef<Konva.Stage>(null)
//   const [width, height] = useSize(parentRef)
//   const originalSize = useAtomValue(standardSize)
//   const revealAnswer = useAtomValue(quizReveal)

//   const [flagImg] = useImage(
//     'https://images.theconversation.com/files/635148/original/file-20241128-17-ek5h29.png?ixlib=rb-4.1.0&q=25&auto=format&h=90&w=50',
//     'anonymous'
//   )

//   const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
//     e.target.setAttr('scaleX', calculateScale(e.target.y()) * (width / originalSize.width))
//     e.target.setAttr('scaleY', calculateScale(e.target.y()) * (width / originalSize.width))
//   }

//   const calculateScale = (y: number) => {
//     if (height < 1) return 1
//     const normalizedY = y / height
//     return 0.2 + normalizedY * 2
//   }

//   return (
//     <div className='font-base'>
//       <div
//         ref={parentRef}
//         className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/634719/original/file-20241127-15-e3i137.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
//       >
//         <Stage
//           ref={stageRef}
//           width={width}
//           height={height}
//           scaleX={width / originalSize.width}
//           scaleY={height / originalSize.height}
//         >
//           <Layer>
//             {flagImg && (
//               <KonvaImage
//                 ref={(node) => {
//                   if (node && revealAnswer.quiz4) {
//                     node.setAttr('filters', [Konva.Filters.Grayscale])
//                     node.setAttr('draggable', false)
//                     node.cache()
//                     stageRef.current!.container().style.cursor = 'default'
//                   } else if (node && !revealAnswer.quiz4) {
//                     node.setAttr('filters', [])
//                     node.setAttr('draggable', true)
//                     node.cache()
//                   }
//                 }}
//                 x={width * 0.5}
//                 y={height * 0.5}
//                 image={flagImg}
//                 width={flagImg.width * (window.innerWidth / 2000)}
//                 height={flagImg.height * (window.innerWidth / 2000)}
//                 offsetX={flagImg.width * (window.innerWidth / 2000)}
//                 offsetY={flagImg.height * (window.innerWidth / 2000)}
//                 scaleX={calculateScale(height * 0.5) * (width / originalSize.width)}
//                 scaleY={calculateScale(height * 0.5) * (height / originalSize.height)}
//                 onMouseEnter={() => {
//                   if (!revealAnswer.quiz4) stageRef.current!.container().style.cursor = 'pointer'
//                 }}
//                 onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
//                 draggable
//                 onDragMove={handleDragMove}
//               />
//             )}
//           </Layer>
//         </Stage>
//         <div
//           className='not_full_screen pointer-events-none absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out'
//           style={{ opacity: revealAnswer.quiz4 ? 1 : 0 }}
//         >
//           <BackgroundImage
//             src={`https://images.theconversation.com/files/636057/original/file-20241204-15-cwtr4c.png?ixlib=rb-4.1.0&q=45&auto=format&w=${(originalSize.width * 2).toFixed(0)}`}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

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
  const [images, setImages] = useState<ImageData[]>([])

  useEffect(() => {
    if (width > 0 && height > 0) {
      setImages([
        {
          id: 0,
          x: width * 0.5,
          y: height * 0.5,
          imgBlob: flagImg
        },
        {
          id: 1,
          x: width * 0.5,
          y: height * 0.5,
          imgBlob: flagImg
        }
      ])
    }
  }, [width, height, flagImg])

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
    const zeroPoint = height / 4
    if (height <= 0) return 0

    const top = 0
    const bottom = height
    // Map `y` to the range [-1, 1], with `zeroPoint` as the middle
    const range = top - bottom
    const normalizedY = (y - zeroPoint) / (range / 2)

    // Clamp the value to stay within [-1, 1]
    const clampedY = Math.max(-1, Math.min(1, normalizedY))

    return clampedY * (width / 20)
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
                    ref={(node) => {
                      if (node && revealAnswer.quiz4) {
                        node.setAttr('filters', [Konva.Filters.Grayscale])
                        node.setAttr('draggable', false)
                        node.cache()
                        stageRef.current!.container().style.cursor = 'default'
                      } else if (node && !revealAnswer.quiz4) {
                        node.setAttr('filters', [])
                        node.setAttr('draggable', true)
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
                      image.imgBlob.width * (window.innerWidth / 2000) + (image.id === 0 ? calculateXShift(image.y) : 0)
                    }
                    offsetY={
                      image.imgBlob.width * (window.innerWidth / 2000) -
                      (image.id === 1 ? (image.imgBlob.height * (window.innerWidth / 2000)) / 3 : 0)
                    }
                    scaleX={calculateScale(image.y) * (width / originalSize.width)}
                    scaleY={calculateScale(image.y) * (height / originalSize.height)}
                    onMouseEnter={() => {
                      if (!revealAnswer.quiz4) stageRef.current!.container().style.cursor = 'pointer'
                    }}
                    onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
                    draggable
                    onDragMove={handleDragMove}
                  />
                )
            )}
          </Layer>
        </Stage>
        <div
          className='not_full_screen pointer-events-none absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out'
          style={{ opacity: revealAnswer.quiz4 ? 1 : 0 }}
        >
          <BackgroundImage
            src={`https://images.theconversation.com/files/638080/original/file-20241212-17-ft47c.png?ixlib=rb-4.1.0&q=45&auto=format&w=${(originalSize.width * 2).toFixed(0)}`}
          />
        </div>
      </div>
    </div>
  )
}
