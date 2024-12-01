import { ReactNode, useRef } from 'react'
import { addClassToChildren, cn } from '../util/helpers'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ARTICLEWIDTH } from '../util/constants'
import useSize from '@react-hook/size'

gsap.registerPlugin(ScrollTrigger)

export function ScrollSection({
  className,
  children,
  pinType,
  id
}: {
  children: ReactNode
  pinType: string
  className?: string
  id?: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [width, height] = useSize(sectionRef)

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const steps = section.querySelectorAll('.pinned_foreground .step')
      const backgroundElements = section.querySelectorAll('.pinned_background_wrapper > *')

      steps.forEach((step, index) => {
        const element = backgroundElements[index + 1]

        if (element) {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 90%',
            onEnter: () => {
              element.classList.add('make_visible')
            },
            onLeaveBack: () => {
              element.classList.remove('make_visible')
            }
          })
        }
      })
    },
    { scope: sectionRef }
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const backgroundElements = section.querySelectorAll('.pinned_background_wrapper > *')
      const firstDrawPar = section.querySelector('#draw1-step')
      const canvas = backgroundElements[1].querySelector('.canvas-container')
      const img = backgroundElements[0].querySelector('img')

      if (!firstDrawPar || !img || !canvas) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: firstDrawPar,
            start: '50% 40%',
            end: '50% top',
            scrub: true
          }
        })
        .to(img, { height: canvas.clientHeight, width: canvas.clientWidth, borderRadius: '0.375rem' })
    },
    { dependencies: [width, height], scope: sectionRef, revertOnUpdate: true }
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const backgroundElements = section.querySelectorAll('.pinned_background_wrapper > *')
      const firstDrawPar = section.querySelector('#draw4-step')
      const canvas = backgroundElements[1].querySelector('.canvas-container')
      const img = backgroundElements[4].querySelector('img')

      if (!firstDrawPar || !img || !canvas) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: firstDrawPar,
            start: '50% 40%',
            end: '50% top',
            scrub: true
          }
        })
        .to(img, { height: canvas.clientHeight, width: canvas.clientWidth, borderRadius: '0.375rem' })
    },
    { dependencies: [width, height], scope: sectionRef, revertOnUpdate: true }
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const drawPar = section.querySelector('#draw5-step')
      const drawPar2 = section.querySelector('#draw5-step-2')

      const controls: NodeList | null = section.querySelectorAll('.draw5Controls')
      const video: HTMLVideoElement | null = section.querySelector('#draw5video')
      const playBtn: HTMLButtonElement | null = section.querySelector('#draw5PlayBtn')

      if (!drawPar || !drawPar2 || !controls || !playBtn || !video) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: drawPar,
            start: 'center 90%',
            scrub: true
          }
        })
        .to(controls, { opacity: 100 })

      ScrollTrigger.create({
        trigger: drawPar2,
        start: 'center 75%',
        onEnter: () => {
          if (playBtn.textContent === 'Play video') {
            video.play()
            playBtn.textContent = 'Restart'
          }
        },
        onLeaveBack: () => {
          if (playBtn.textContent === 'Restart' || playBtn.textContent === 'Replay') {
            video.pause()
            video.currentTime = 0
            playBtn.textContent = 'Play video'
          }
        }
      })
    },
    { scope: sectionRef }
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const drawPar = section.querySelector('#draw6-step')
      const canvas = section.querySelector('#draw6Canvas')

      const controls = section.querySelector('#draw6Controls')

      if (!drawPar || !controls || !canvas) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: drawPar,
            start: 'center 90%',
            scrub: true
          }
        })
        .to(controls, { opacity: 100 })
        .to(canvas, { opacity: 100 }, '<')

      ScrollTrigger.create({
        trigger: drawPar,
        start: 'center 75%',
        onEnter: () => {
          gsap.set(canvas, { opacity: 100 })
          gsap.set(controls, { opacity: 100 })
        },
        onLeaveBack: () => {
          gsap.set(canvas, { opacity: 0 })
          gsap.set(controls, { opacity: 0 })
        }
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn('not-prose relative grid min-h-screen w-full text-lg md:text-xl', pinType, className)}
    >
      {children}
    </section>
  )
}

export function ScrollBackground({ children }: { children: ReactNode }) {
  return (
    <div className='pinned_background'>
      <div className='pinned_background_wrapper'>{children}</div>
    </div>
  )
}

export function ScrollForeground({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn('pinned_foreground mx-auto', className)}
      style={{
        width: `min(100% - 40px, ${ARTICLEWIDTH.maxWidth}px)`
      }}
    >
      {children}
    </div>
  )
}

export function ScrollTextChapter({
  children,
  className,
  position,
  step,
  id
}: {
  children: ReactNode
  className: string
  position?: string
  step?: string
  id?: string
}) {
  return (
    <div className={cn('chapter_wrapper', className, position)} id={id}>
      {addClassToChildren(children, step ? 'step' : '')}
    </div>
  )
}
