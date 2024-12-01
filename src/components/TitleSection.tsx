import { ReactNode, useRef } from 'react'
import TitleTextBorder from './TitleTextBorder'
import { cn } from '../util/helpers'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
// import { useDarkMode } from '../context/useDarkMode'

export default function TitleSection({
  children,
  title,
  standFirst,
  publishDate,
  author,
  authorLink,
  authorAffiliation,
  authorAffiliationLink,
  className,
  clipped,
  textBackground
}: {
  children?: ReactNode
  title?: string
  standFirst?: string
  publishDate: string
  author: string
  authorLink?: string
  authorAffiliation?: string
  authorAffiliationLink?: string
  className?: string
  clipped?: boolean
  textBackground?: boolean
}) {
  // const { isDarkMode } = useDarkMode()
  const sectionRef = useRef<HTMLDivElement>(null)

  const createAuthor = () => {
    return (
      <>
        {authorLink ? (
          <a className='underline' href={authorLink} target='_blank' rel='noopener noreferrer'>
            {author}
          </a>
        ) : (
          <span>{author}</span>
        )}
        {authorAffiliation && authorAffiliationLink ? (
          <>
            ,{' '}
            <a className='underline' href={authorAffiliationLink} target='_blank' rel='noopener noreferrer'>
              {authorAffiliation}
            </a>
          </>
        ) : authorAffiliation ? (
          <>
            , <span>{authorAffiliation}</span>
          </>
        ) : null}
      </>
    )
  }

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      const header = document.querySelector('header')
      if (!header) return

      const titleImage = section.querySelector('#titleImg > *')

      if (titleImage) {
        gsap
          .timeline({
            scrollTrigger: {
              scrub: true,
              trigger: clipped ? section : titleImage,
              start: 'top top',
              end: 'bottom top'
            }
          })
          .fromTo(
            titleImage,
            { y: clipped ? header.clientHeight : 0 },
            { y: clipped ? header.clientHeight * -1 : 100, ease: 'linear' }
          )
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative !m-0 !mb-14 h-screen w-full max-w-none',
        className,
        clipped ? '[clip-path:inset(0px_0px)]' : ''
      )}
    >
      <div className={cn('grid h-full w-full', clipped ? 'fixed top-0' : '')}>
        <div className={cn('z-10 col-start-1 row-start-1 mt-[20vh] max-h-screen place-content-center px-8 lg:pt-12')}>
          <div className='mx-auto max-w-[40ch] text-center'>
            {textBackground && title ? (
              <>
                <TitleTextBorder
                  as={'h1'}
                  className='not-prose text-balance text-center font-base text-4xl font-bold md:text-5xl lg:text-6xl'
                >
                  {title}
                </TitleTextBorder>
                <br />
              </>
            ) : (
              <h1 className='not-prose text-balance text-center font-base text-4xl font-bold md:text-5xl lg:text-6xl'>
                {title}
              </h1>
            )}

            {textBackground && standFirst ? (
              <TitleTextBorder as={'h2'} className='not-prose text-center font-base text-2xl md:text-3xl lg:text-4xl'>
                {standFirst}
              </TitleTextBorder>
            ) : (
              <h2 className='not-prose text-center font-base text-2xl md:text-3xl lg:text-4xl'>{standFirst}</h2>
            )}

            <p className='!mb-1 !mt-4 text-xs md:text-sm'>{createAuthor()}</p>

            <time dateTime={publishDate} className='not-prose m-0 font-base text-xs'>
              Published:{' '}
              {new Date(publishDate)
                .toLocaleString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                  timeZone: 'Australia/Sydney'
                })
                .replace('AM', 'am')
                .replace('PM', 'pm')}{' '}
              AEDT
            </time>
          </div>
        </div>
        <div id='titleImg' className='not-prose col-start-1 row-start-1 h-full w-full overflow-clip'>
          {children}
        </div>
        <div className='absolute bottom-5 left-1/2 -translate-x-1/2'>
          <div className='animate-bounce'>
            <svg
              className='h-6 w-6 text-neutral-900'
              fill='none'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='3'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path d='M19 14l-7 7m0 0l-7-7m7 7V3'></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
