import { useRef } from 'react'
import Konva from 'konva'
import { Stage, Layer } from 'react-konva'
import useSize from '@react-hook/size'
import { standardSize } from '../../context/Atoms'
import { useAtomValue } from 'jotai'

export default function QuizSix() {
  const parentRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Konva.Stage>(null)
  const [width, height] = useSize(parentRef)
  const originalSize = useAtomValue(standardSize)

  return (
    <div className='relative font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/634718/original/file-20241127-15-5rghif.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
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
        >
          <Layer></Layer>
        </Stage>

        <div
          className='absolute left-2 top-2 text-sm opacity-0 transition-opacity duration-300 ease-in-out md:text-lg'
          id={'draw6Controls'}
        >
          <button className='cursor-pointer bg-neutral-900/50 p-2 text-white hover:shadow-lg active:scale-95'>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
