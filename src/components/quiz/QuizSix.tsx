import { useRef, useState, DragEvent, useEffect } from 'react'
import Konva from 'konva'
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva'
import useSize from '@react-hook/size'
import useImage from 'use-image'
import { KonvaEventObject } from 'konva/lib/Node'
import { ReactRef } from '@gsap/react'
import { quizReveal, videoSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'

// Types
interface ImageType {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  id: number
}

interface URLImageProps {
  imgBlob: HTMLImageElement
  image: ImageType
  isSelected: boolean
  stage: ReactRef
  onSelect: () => void
  onChange: (attrs: ImageType) => void
}

const URLImage = ({ imgBlob, image, isSelected, stage, onSelect, onChange }: URLImageProps) => {
  const shapeRef = useRef<Konva.Image | null>(null)
  const [scale, setScale] = useState<number>(1)
  const trRef = useRef<Konva.Transformer | null>(null)

  let tween: Konva.Tween | null = null

  useEffect(() => {
    // Ensure the references are not null before accessing their methods
    if (isSelected && trRef.current && shapeRef.current) {
      // Attach transformer manually
      trRef.current.nodes([shapeRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  if (!imgBlob) return

  const imgWidth = imgBlob.width
  const imgHeight = imgBlob.height

  const handleDragStart = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const shape = e.target

    if (!shape) return

    if (tween) {
      tween.pause()
    }

    setScale(shape.scaleX())

    shape.setAttrs({
      // shadowBlur: 10,
      shadowOffset: {
        x: 12,
        y: 12
      },
      scale: {
        x: scale * 1.1,
        y: scale * 1.1
      }
    })
  }

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={imgBlob}
        draggable
        shadowBlur={20}
        shadowOffset={{
          x: 5,
          y: 5
        }}
        rotation={image.rotation}
        width={imgWidth}
        height={imgHeight}
        x={image.x}
        y={image.y}
        offsetX={imgWidth / 2}
        offsetY={imgHeight / 2}
        onDragStart={handleDragStart}
        onMouseEnter={() => (stage.current!.container().style.cursor = 'pointer')}
        onMouseLeave={() => (stage.current!.container().style.cursor = 'default')}
        onClick={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...image,
            x: e.target.x(),
            y: e.target.y()
          })

          const shape = e.target

          tween = new Konva.Tween({
            node: shape,
            duration: 0.2,
            easing: Konva.Easings.ElasticEaseOut,
            scaleX: scale,
            scaleY: scale,
            shadowOffsetX: 5,
            shadowOffsetY: 5
          })

          tween.play()
        }}
        onTransformEnd={() => {
          const node = shapeRef.current

          if (!node) return

          const scaleX = node.scaleX()
          const scaleY = node.scaleY()

          setScale(scaleX)

          onChange({
            ...image,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),

            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY)
          })
        }}
      />

      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={true}
          centeredScaling={true}
          borderStrokeWidth={3}
          borderStroke={'#e37169'}
          borderDash={[5, 5]}
          rotateAnchorCursor='grab'
          useSingleNodeRotation={true}
          anchorStyleFunc={(anchor: Konva.Rect) => {
            anchor.cornerRadius(100)
            anchor.fill('#e37169')
            anchor.stroke('#d8352a')
            anchor.height(20)
            anchor.width(20)
            anchor.offsetX(10)
            anchor.offsetY(10)

            if (
              anchor.hasName('top-center') ||
              anchor.hasName('bottom-center') ||
              anchor.hasName('middle-left') ||
              anchor.hasName('middle-right')
            ) {
              anchor.height(0)
              anchor.width(0)
              anchor.offsetX(0)
              anchor.offsetY(0)
            }
          }}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox
            }
            return newBox
          }}
        />
      )}
    </>
  )
}

export default function QuizSix() {
  const parentRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [images, setImages] = useState<ImageType[]>([])
  const revealAnswer = useAtomValue(quizReveal)
  const answerImgs: ImageType[] = []

  const HQImgURL =
    'https://images.theconversation.com/files/635152/original/file-20241128-17-4yc7x1.png?ixlib=rb-4.1.0&q=45&auto=format&h=200'
  // const LQImgURL =
  //   'https://images.theconversation.com/files/635152/original/file-20241128-17-4yc7x1.png?ixlib=rb-4.1.0&q=45&auto=format&h=100'

  const [img] = useImage(HQImgURL)
  const [width, height] = useSize(parentRef)
  const originalSize = useAtomValue(videoSize)

  const [selectedImg, setSelectedImg] = useState<number | null>(null)

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedImg(null)
    }
  }

  const handleClear = () => {
    setImages([])
    setSelectedImg(null)
  }

  return (
    <div className='relative font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[16/9] w-canvas-width-video max-w-full overflow-hidden rounded-md'
        onDrop={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault()

          if (!stageRef.current) return

          // Register event position
          stageRef.current.setPointersPositions(e)

          // Add image
          setImages([
            ...images,
            {
              ...stageRef.current.getPointerPosition()!,
              id: images.length,
              width: 0,
              height: 0,
              rotation: 15 + (Math.random() * 2 - 1) * 5
            }
          ])
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        <Stage
          id={'draw6Canvas'}
          ref={stageRef}
          className='absolute opacity-0 transition-opacity duration-300 ease-in-out'
          width={width}
          height={height}
          scaleX={width / originalSize.width}
          scaleY={height / originalSize.height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <Layer>
            {img &&
              stageRef &&
              images.map((image, i) => (
                <URLImage
                  key={image.id}
                  imgBlob={img}
                  image={image}
                  isSelected={image.id === selectedImg}
                  stage={stageRef}
                  onSelect={() => {
                    setSelectedImg(image.id)
                  }}
                  onChange={(newAttrs: ImageType) => {
                    const imgs = images.slice()

                    imgs[i] = { ...newAttrs }
                    setImages(imgs)
                  }}
                />
              ))}
            {img &&
              stageRef &&
              revealAnswer.quiz4 &&
              answerImgs.map((image, i) => (
                <KonvaImage
                  key={i}
                  image={img}
                  draggable
                  shadowBlur={20}
                  shadowOffset={{
                    x: 5,
                    y: 5
                  }}
                  rotation={image.rotation}
                  width={image.width}
                  height={image.height}
                  x={image.x}
                  y={image.y}
                  offsetX={image.width / 2}
                  offsetY={image.height / 2}
                />
              ))}
          </Layer>
        </Stage>
        <video
          ref={videoRef}
          src='./draw6Video.webm'
          controls={false}
          autoPlay
          muted
          loop
          className='pointer-events-none h-full w-full object-cover'
        ></video>
        <div
          className='absolute left-2 top-2 text-sm opacity-0 transition-opacity duration-300 ease-in-out md:text-lg'
          id={'draw6Controls'}
        >
          <button
            onClick={handleClear}
            className='cursor-pointer bg-neutral-900/50 p-2 text-white hover:shadow-lg active:scale-95'
          >
            Clear
          </button>
          <p className='mt-4 text-xs font-bold text-neutral-100'>
            Click on images <br />
            to resize
          </p>
          <img
            src={HQImgURL}
            alt='Olympic pool'
            draggable
            className='!mx-0 mt-2 !h-auto !w-24 cursor-pointer object-cover shadow-lg transition-all duration-200 ease-in-out'
          />
        </div>
      </div>
    </div>
  )
}
