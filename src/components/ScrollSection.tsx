import { ReactNode, useRef } from 'react'
import { addClassToChildren, cn } from '../util/helpers'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ARTICLEWIDTH } from '../util/constants'
import useSize from '@react-hook/size'
import { useSetAtom } from 'jotai'
import { quizReveal } from '../context/Atoms'

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
  const setRevealAnswers = useSetAtom(quizReveal)

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
      const firstQuizPar = section.querySelector('#quiz1-step')
      const canvas = backgroundElements[1].querySelector('.canvas-container')
      const img = backgroundElements[0].querySelector('img')

      if (!firstQuizPar || !img || !canvas) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: firstQuizPar,
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
      const quizPar = section.querySelector('#quizFour-step')
      const canvas = backgroundElements[1].querySelector('.canvas-container')
      const img = backgroundElements[4].querySelector('img')

      if (!quizPar || !img || !canvas) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: quizPar,
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

      const quizPar = section.querySelector('#quizFive-step-2')

      const controls: NodeList | null = section.querySelectorAll('.draw5Controls')

      if (!quizPar || !controls) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: quizPar,
            start: 'center 90%',
            scrub: true
          }
        })
        .to(controls, { opacity: 100 })
    },
    { scope: sectionRef }
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const revealQuizStep = section.querySelector('#quizSix-step')
      const canvas = section.querySelector('#draw6Canvas')
      const controls = section.querySelector('#draw6Controls')

      if (!revealQuizStep || !controls || !canvas) return

      gsap
        .timeline({
          scrollTrigger: {
            trigger: revealQuizStep,
            start: 'center 90%',
            scrub: true
          }
        })
        .to(controls, { opacity: 100 })
        .to(canvas, { opacity: 100 }, '<')

      ScrollTrigger.create({
        trigger: revealQuizStep,
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

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const revealQuizStep = section.querySelector('#quizSeven-step')
      const questions = section.querySelector('.questions')

      if (!revealQuizStep || !questions) return

      ScrollTrigger.create({
        trigger: revealQuizStep,
        start: 'center 75%',
        onEnter: () => {
          gsap.set(questions, { opacity: 100 })
        },
        onLeaveBack: () => {
          gsap.set(questions, { opacity: 0 })
        }
      })
    },
    { scope: sectionRef }
  )

  // Reveal answers code
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const answerSteps = section.querySelectorAll('.answerStep')

      if (!answerSteps.length) return

      answerSteps.forEach((answerStep, index) => {
        ScrollTrigger.create({
          // markers: true,
          trigger: answerStep,
          start: 'center 90%',
          end: 'center 90%',
          onEnter: () => {
            setRevealAnswers((prev) => ({ ...prev, [`quiz${index + 1}`]: true }))
          },
          onLeaveBack: () => {
            setRevealAnswers((prev) => ({ ...prev, [`quiz${index + 1}`]: false }))
          }
        })
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
