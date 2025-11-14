import { ReactNode, useRef } from 'react'
import { cn } from '../util/helpers'

export default function TitleSection({
  children,

  publishDate,
  author,
  authorLink,
  authorAffiliation,
  authorAffiliationLink,
  className,
  clipped
}: {
  children: ReactNode
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
          <div className='mx-auto text-center'>
            <div className='mx-auto mb-4 w-full max-w-[32ch] text-center'>
              <h1 className='not-prose relative z-10 inline text-balance bg-neutral-700 box-decoration-clone px-2 text-center font-base text-4xl font-bold !leading-[1.2] text-white md:text-5xl lg:text-6xl'>
                Can you spot a rip current?
              </h1>
            </div>

            <div className='mx-auto w-full max-w-[40ch] text-center'>
              <h2 className='not-prose relative z-10 inline text-balance bg-neutral-700 box-decoration-clone px-2 text-center font-base text-2xl !leading-[1] text-white md:text-3xl lg:text-3xl'>
                Take our 5-minute quiz on Australia's number-one coastal hazard
              </h2>
            </div>

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

          <div className='mx-auto mt-4 w-max animate-bounce'>
            <span className='mx-auto inline-block text-center text-xs'>Scroll down</span>
            <svg
              className='mx-auto h-6 w-6 text-neutral-900'
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
        <div
          id='titleImg'
          className='not-prose col-start-1 row-start-1 h-full max-h-screen w-full overflow-clip bg-[#8e9e9d]'
        >
          {children}
        </div>
      </div>
    </section>
  )
}
