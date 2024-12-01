import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Arrow, Circle } from 'react-konva'
import useSize from '@react-hook/size'
import Konva from 'konva'
import { videoSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'

interface Target {
  id: string
  x: number
  y: number
  colour: string
}

interface Connector {
  id: string
  from: string
  to: string
}

export default function QuizFive() {
  const parentRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [width, height] = useSize(parentRef)
  const originalSize = useAtomValue(videoSize)

  const [targets, setTargets] = useState<Target[]>([])
  const [connectors, setConnectors] = useState<Connector[]>([])

  useEffect(() => {
    const numberOfCircles = 4
    const colours = [
      '#3d0400',
      '#660700',
      '#990a00',
      '#b81f14',
      '#d8352a',
      '#e37169',
      '#e9928c',
      '#ecc3C0',
      '#f1dddc',
      '#f9f1f0'
    ]

    const generateTargets = () => {
      return Array.from({ length: numberOfCircles }, (_, i) => ({
        id: 'target-' + i,
        x: width * 0.1,
        y: (height / (numberOfCircles + 1)) * (numberOfCircles - i),
        colour: colours[i * 2]
      }))
    }

    const generateConnectors = () => {
      return Array.from({ length: numberOfCircles - 1 }, (_, i) => ({
        id: `connector-${i}`,
        from: `target-${i}`,
        to: `target-${i + 1}`
      }))
    }

    const newTargets = generateTargets()
    setTargets(newTargets)
    setConnectors(generateConnectors())
  }, [width, height])

  const getConnectorPoints = (from: Target, to: Target) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const angle = Math.atan2(-dy, dx)
    const radius = 50

    return [
      from.x - radius * Math.cos(angle + Math.PI),
      from.y + radius * Math.sin(angle + Math.PI),
      to.x - radius * Math.cos(angle),
      to.y + radius * Math.sin(angle)
    ]
  }

  const handleDragMove = (id: string, x: number, y: number) => {
    setTargets((prev) => prev.map((target) => (target.id === id ? { ...target, x, y } : target)))
  }

  const handleVideoPlay = () => {
    if (!videoRef.current) return

    const btn = document.querySelector('#draw5PlayBtn')

    if (!btn) return

    if (btn.textContent === 'Restart' || btn.textContent === 'Replay') {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      btn.textContent = 'Play video'
    } else {
      videoRef.current.play()
      btn!.textContent = 'Restart'
    }
  }

  const handleVideoEnd = () => {
    const btn = document.querySelector('#draw5PlayBtn')
    btn!.textContent = 'Replay'
  }

  return (
    <div className='font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[16/9] w-canvas-width-video max-w-full overflow-hidden rounded-md'
      >
        <Stage
          ref={stageRef}
          className='draw5Controls absolute opacity-0 transition-opacity duration-300 ease-in-out'
          width={width}
          height={height}
          scaleX={width / originalSize.width}
          scaleY={height / originalSize.height}
        >
          <Layer>
            {connectors.map((connector) => {
              const fromTarget = targets.find((t) => t.id === connector.from)
              const toTarget = targets.find((t) => t.id === connector.to)

              if (!fromTarget || !toTarget) return null

              const points = getConnectorPoints(fromTarget, toTarget)
              return <Arrow key={connector.id} strokeWidth={4} points={points} stroke='#4b4b4e' fill='#4b4b4e' />
            })}
            {targets.map((target) => (
              <Circle
                key={target.id}
                id={target.id}
                x={target.x}
                y={target.y}
                fill={target.colour}
                radius={20}
                shadowBlur={10}
                shadowColor={'#93939f'}
                onMouseEnter={() => (stageRef.current!.container().style.cursor = 'pointer')}
                onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
                draggable
                onDragMove={(e) => handleDragMove(target.id, e.target.x(), e.target.y())}
              />
            ))}
          </Layer>
        </Stage>
        <video
          id={'draw5video'}
          ref={videoRef}
          src='./draw5Video.webm'
          muted={true}
          controls={false}
          onEnded={handleVideoEnd}
          className='pointer-events-none h-full w-full object-cover'
        ></video>
        <div className='draw5Controls absolute left-2 top-2 text-sm opacity-0 transition-opacity duration-300 ease-in-out md:text-lg'>
          <button
            id={'draw5PlayBtn'}
            onClick={handleVideoPlay}
            className='cursor-pointer bg-neutral-900/50 p-2 text-white transition-all duration-150 ease-in-out hover:shadow-lg active:scale-95'
          >
            Play video
          </button>
        </div>
      </div>
    </div>
  )
}
