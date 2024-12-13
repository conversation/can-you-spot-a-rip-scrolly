import { useRef, useState, useEffect } from 'react'
import Konva from 'konva'
import { Stage, Layer, Image as KonvaImage, Transformer, Text, Group } from 'react-konva/lib/ReactKonvaCore'
import useSize from '@react-hook/size'
import useImage from 'use-image'
import { KonvaEventObject } from 'konva/lib/Node'
import { ReactRef } from '@gsap/react'
import { quizReveal, videoSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'
import BackgroundImage from '../BackgroundImage'

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
  const groupRef = useRef<Konva.Group | null>(null)
  const imageRef = useRef<Konva.Image | null>(null)
  const trRef = useRef<Konva.Transformer | null>(null)
  const [scale, setScale] = useState<number>(1)
  let tween: Konva.Tween | null = null

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      // Attach transformer to the Group node
      trRef.current.nodes([groupRef.current])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [isSelected])

  if (!imgBlob) return null

  const imgWidth = Math.min(imgBlob.width * 1.5, window.innerWidth / 10)
  const imgHeight = Math.min(imgBlob.height * 1.5, (window.innerWidth / 10) * 2)

  const handleDragStart = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    const image = imageRef.current

    if (!e.target || !image) return

    stage.current!.container().style.cursor = 'grabbing'

    const shape = e.target

    if (!shape) return

    if (tween) {
      tween.pause()
    }

    setScale(shape.scaleX())

    shape.setAttrs({
      scale: {
        x: scale * 1.1,
        y: scale * 1.1
      }
    })

    image.setAttrs({
      shadowBlur: 10,
      shadowOffset: {
        x: 12,
        y: 12
      }
    })
  }

  const handleDragEnd = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    onChange({
      ...image,
      x: e.target.x(),
      y: e.target.y()
    })
    stage.current!.container().style.cursor = 'default'

    tween = new Konva.Tween({
      node: e.target!,
      duration: 0.2,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: scale,
      scaleY: scale,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    })

    tween.play()
  }

  const handleTransformEnd = () => {
    const node = groupRef.current
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
  }

  return (
    <>
      <Group
        ref={groupRef}
        draggable
        rotation={image.rotation}
        x={image.x}
        y={image.y}
        offsetX={imgWidth / 2}
        offsetY={imgHeight / 2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onTransformEnd={handleTransformEnd}
        onClick={onSelect}
        onTap={onSelect}
        onMouseEnter={() => (stage.current!.container().style.cursor = 'pointer')}
        onMouseLeave={() => (stage.current!.container().style.cursor = 'default')}
      >
        <KonvaImage
          width={imgWidth}
          height={imgHeight}
          ref={imageRef}
          shadowBlur={20}
          shadowOpacity={0.5}
          shadowOffset={{
            x: 5,
            y: 5
          }}
          image={imgBlob}
        />
        <Text
          text={'Click to resize'}
          fontSize={12}
          fill={'white'}
          fontStyle='bold'
          offsetY={-20}
          width={imgWidth}
          align='center'
        />
      </Group>
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

  const HQImgURL =
    'https://images.theconversation.com/files/635152/original/file-20241128-17-4yc7x1.png?ixlib=rb-4.1.0&q=45&auto=format&h=200'

  const [img] = useImage(HQImgURL)
  const [width, height] = useSize(parentRef)
  const originalSize = useAtomValue(videoSize)

  const [selectedImg, setSelectedImg] = useState<number | null>(null)

  const checkDeselect = (e: KonvaEventObject<MouseEvent | TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      setSelectedImg(null)
    }
  }

  const handleClear = () => {
    setImages([])
    setSelectedImg(null)
  }

  const handleAddPool = (e: React.MouseEvent<HTMLButtonElement> | React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!stageRef.current) return

    setImages([
      ...images,
      {
        x: width / 2 + (Math.random() * 2 - 1) * 50,
        y: height / 2 + (Math.random() * 2 - 1) * 50,
        id: images.length,
        width: 0,
        height: 0,
        rotation: 15 + (Math.random() * 2 - 1) * 5
      }
    ])
  }

  return (
    <div className='relative font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[16/9] w-canvas-width-video max-w-full overflow-hidden rounded-md'
        onDragOver={(e) => e.preventDefault()}
      >
        <video
          ref={videoRef}
          controls={false}
          autoPlay
          muted
          loop
          className='pointer-events-none absolute left-0 top-0 h-full w-full object-cover'
        >
          <source
            src='https://cdn.theconversation.com/infographics/1128/6ac6adf562184b909e404bf6499d70476456c8be/site/draw6Video.webm'
            type='video/webm'
          />

          <source
            src='https://cdn.theconversation.com/infographics/1128/6ac6adf562184b909e404bf6499d70476456c8be/site/draw6Video.mp4'
            type='video/mp4'
          />
        </video>

        <Stage
          id={'draw6Canvas'}
          ref={stageRef}
          className='absolute left-0 top-0 opacity-0 transition-opacity duration-300 ease-in-out'
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
              !revealAnswer.quiz6 &&
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
          </Layer>
        </Stage>
        <div
          className='not_full_screen pointer-events-none absolute left-0 top-0 h-full w-full object-cover transition-opacity duration-300 ease-in-out'
          style={{ opacity: revealAnswer.quiz6 ? 1 : 0 }}
        >
          <BackgroundImage
            src={`https://images.theconversation.com/files/636083/original/file-20241204-15-f8wfm5.png?ixlib=rb-4.1.0&q=45&auto=format&w=${(originalSize.width * 2).toFixed(0)}`}
          />
          <span className='text-bold absolute left-[45%] top-[30%] text-sm font-bold text-yellow-500 md:text-lg'>
            Surfers
          </span>
          <span className='text-bold absolute left-[62%] top-[23%] text-lg font-bold text-yellow-500 drop-shadow-xl md:text-3xl'>
            150m
          </span>
        </div>

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
          <div className='flex flex-col items-center'>
            <p className='mt-4 text-center text-xs font-bold text-black md:text-neutral-100'>
              Click to
              <br />
              add a pool
            </p>
            <button
              onClick={handleAddPool}
              className='mt-2 grid aspect-square h-auto w-10 cursor-pointer place-items-center rounded-full border bg-blue-400/60 text-2xl shadow-lg ease-in-out hover:bg-blue-500/70 md:w-20 md:text-6xl'
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
