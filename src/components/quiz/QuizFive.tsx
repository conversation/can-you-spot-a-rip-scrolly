import { useRef, useState, useEffect } from 'react'
import { Stage, Layer, Arrow, Circle, Text, Group } from 'react-konva/lib/ReactKonvaCore'
import Konva from 'konva'
import { quizReveal, videoSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'
import useDebouncedSize from './useDebouncedSize'

interface Target {
  id: number
  x: number
  y: number
  colour: string
  time: string
  textColour: string
}

interface Connector {
  id: number
  from: number
  to: number
}

const colours = [
  '#f9f1f0',
  '#f1dddc',
  '#ecc3C0',
  '#e9928c',
  '#e37169',
  '#d8352a',
  '#b81f14',
  '#990a00',
  '#660700',
  '#3d0400'
]

const numberOfCircles: number = 4

export default function QuizFive() {
  const parentRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [width, height] = useDebouncedSize(parentRef)
  const originalSize = useAtomValue(videoSize)
  const [targets, setTargets] = useState<Target[]>([])
  const [radius, setRadius] = useState<number>(10)
  const [connectors, setConnectors] = useState<Connector[]>([])
  const revealAnswer = useAtomValue(quizReveal)

  useEffect(() => {
    const generateTargets = () => {
      return Array.from({ length: numberOfCircles }, (_, i) => ({
        id: i,
        x: (width / (numberOfCircles + 1)) * (i + 1),
        y: height * 0.9,
        colour: colours[i * 2],
        time: `${i === 0 ? 0 : i === 1 ? 30 : i === 2 ? '1 min' : '2 min'}`,
        textColour: `${i === 0 ? colours[9] : i === 1 ? colours[9] : i === 2 ? colours[9] : colours[1]}`
      }))
    }

    const generateConnectors = () => {
      return Array.from({ length: numberOfCircles - 1 }, (_, i) => ({
        id: i,
        from: i,
        to: i + 1
      }))
    }

    setTargets(generateTargets())
    setConnectors(generateConnectors())
    setRadius(width / 40)
  }, [width, height])

  useEffect(() => {
    if (revealAnswer.quiz5) {
      playVideo()
    } else {
      resetVideo()
    }
  }, [revealAnswer.quiz5])

  const generateTargets = () => {
    return Array.from({ length: numberOfCircles }, (_, i) => ({
      id: i,
      x: (width / (numberOfCircles + 1)) * (i + 1),
      y: height * 0.9,
      colour: colours[i * 2],
      time: `${i === 0 ? 0 : i === 1 ? 30 : i === 2 ? '1 min' : '2 min'}`,
      textColour: `${i === 0 ? colours[9] : i === 1 ? colours[9] : i === 2 ? colours[9] : colours[1]}`
    }))
  }

  const generateConnectors = () => {
    return Array.from({ length: numberOfCircles - 1 }, (_, i) => ({
      id: i,
      from: i,
      to: i + 1
    }))
  }

  const getConnectorPoints = (from: Target, to: Target) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const angle = Math.atan2(-dy, dx)
    const r = radius * 1.5
    return [
      from.x - r * Math.cos(angle + Math.PI),
      from.y + r * Math.sin(angle + Math.PI),
      to.x - r * Math.cos(angle),
      to.y + r * Math.sin(angle)
    ]
  }

  const handleDragMove = (id: number, x: number, y: number) => {
    setTargets((prev) => prev.map((target) => (target.id === id ? { ...target, x, y } : target)))
  }

  const handleVideoPlay = () => {
    const btn = document.querySelector('#draw5PlayBtn')

    if (!btn) return

    if (btn.textContent === 'Replay video') {
      resetVideo()
    } else {
      playVideo()
    }
  }

  const playVideo = () => {
    if (!videoRef.current) return

    const btn = document.querySelector('#draw5PlayBtn')

    if (!btn) return

    videoRef.current.play()
    btn!.textContent = 'Replay video'
  }

  const resetVideo = () => {
    if (!videoRef.current) return

    const btn = document.querySelector('#draw5PlayBtn')

    if (!btn) return

    videoRef.current.pause()
    videoRef.current.currentTime = 0
    btn.textContent = 'Play video'
  }

  const handleVideoEnd = () => {
    setTimeout(() => resetVideo(), 1000)
  }

  const resetGame = () => {
    setTargets(generateTargets())
    setConnectors(generateConnectors())
  }

  return (
    <div className='font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[16/9] w-canvas-width-video max-w-full overflow-hidden rounded-md'
      >
        <video
          id={'draw5video'}
          ref={videoRef}
          playsInline
          muted
          controls={false}
          onEnded={handleVideoEnd}
          className='pointer-events-none h-full w-full object-cover'
        >
          <source
            src='https://cdn.theconversation.com/infographics/1128/6ac6adf562184b909e404bf6499d70476456c8be/site/draw5Video_timer.webm'
            type='video/webm'
          />

          <source
            src='https://cdn.theconversation.com/infographics/1128/6ac6adf562184b909e404bf6499d70476456c8be/site/draw5Video_timer.mp4'
            type='video/mp4'
          />
        </video>
        <Stage
          ref={stageRef}
          className='draw5Controls absolute left-0 top-0 opacity-0 transition-opacity duration-300 ease-in-out'
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
              <Group
                key={target.id}
                x={target.x}
                y={target.y}
                draggable
                onDragMove={(e) => handleDragMove(target.id, e.target.x(), e.target.y())}
                onMouseEnter={() => (stageRef.current!.container().style.cursor = 'pointer')}
                onMouseLeave={() => (stageRef.current!.container().style.cursor = 'default')}
              >
                <Circle x={0} y={0} fill={target.colour} radius={radius} shadowBlur={10} shadowColor={'#93939f'} />
                <Text
                  text={window.innerWidth < 599 ? '' : target.time}
                  fontSize={radius * 0.5}
                  fill={target.textColour}
                  fontStyle='bold'
                  width={radius * 2}
                  height={radius * 2}
                  align='center'
                  verticalAlign='middle'
                  lineHeight={10}
                  x={radius * -1}
                  y={radius * -1 + 2}
                />
              </Group>
            ))}
          </Layer>
        </Stage>

        <div className='draw5Controls absolute left-auto right-2 top-2 flex gap-4 text-sm opacity-0 transition-opacity duration-300 ease-in-out md:text-lg lg:left-2 lg:right-auto'>
          <button
            id={'draw5PlayBtn'}
            onClick={handleVideoPlay}
            className='cursor-pointer bg-neutral-900/50 p-2 text-white transition-all duration-150 ease-in-out hover:shadow-lg active:scale-95'
          >
            Play video
          </button>
          <button
            onClick={resetGame}
            className='cursor-pointer bg-neutral-900/50 p-2 text-white transition-all duration-150 ease-in-out hover:shadow-lg active:scale-95'
          >
            Reset circles
          </button>
        </div>
      </div>
    </div>
  )
}
