import { ReactNode, useRef } from 'react'
import { addClassToChildren, cn } from '../util/helpers'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
// import Imgix from 'react-imgix'

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
  return <div className={cn('pinned_foreground standard_width', className)}>{children}</div>
}

// export function ScrollFigure({
//   src,
//   lazyLoad,
//   figcaption,
//   source,
//   sourceLink,
//   className,
//   imgClassName
// }: {
//   src: string
//   lazyLoad?: string
//   figcaption?: string
//   source?: string
//   sourceLink?: string
//   className?: string
//   imgClassName?: string
// }) {
//   const commonProps: {
//     src: string
//     sizes: string
//     imgixParams: {
//       fit: string
//       usm: number
//       auto: string
//       q: number
//     }
//     loading?: string
//   } = {
//     src: src,
//     sizes: '100vw',
//     imgixParams: {
//       fit: 'crop',
//       usm: 12,
//       auto: 'format,compress',
//       q: 45
//     }
//   }

//   if (lazyLoad === 'lazy') {
//     commonProps.loading = 'lazy'
//   }

//   const renderSource = () => {
//     if (!source) return null

//     return sourceLink ? (
//       <>
//         {' '}
//         <span>
//           <a
//             className='underline hover:text-neutral-100 active:text-neutral-100'
//             href={sourceLink}
//             target='_blank'
//             rel='noopener noreferrer'
//           >
//             {source}
//           </a>
//         </span>
//       </>
//     ) : (
//       <>
//         <span>{source}</span>
//       </>
//     )
//   }

//   return (
//     <figure className={cn('full_screen_media', className)}>
//       <Imgix {...commonProps} className={cn('', imgClassName)} />
//       {figcaption && (
//         <figcaption className=''>
//           {figcaption}
//           {renderSource()}
//         </figcaption>
//       )}
//     </figure>
//   )
// }

export function ScrollTextChapter({
  children,
  className,
  position,
  step
}: {
  children: ReactNode
  className: string
  position?: string
  step?: string
}) {
  return (
    <div className={cn('chapter_wrapper', className, position)}>{addClassToChildren(children, step ? 'step' : '')}</div>
  )
}
