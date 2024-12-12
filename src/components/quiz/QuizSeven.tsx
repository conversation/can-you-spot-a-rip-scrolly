import { useRef, useState } from 'react'

type QuizSixButtonProps = {
  handleClick: (arg: ClickProps) => void
  answer: string
  question: number
  text: string
}

type ClickProps = { answer: string; question: number }

function QuizSixButton({ handleClick, answer, question, text }: QuizSixButtonProps) {
  return (
    <button
      onClick={(event) => {
        event.preventDefault()
        handleClick({ answer, question })
      }}
      className='inline-block w-max cursor-pointer rounded-md bg-neutral-300 px-2 py-1 hover:bg-neutral-500 hover:text-white hover:drop-shadow-md'
    >
      {text}
    </button>
  )
}

export default function QuizSix() {
  const parentRef = useRef<HTMLDivElement>(null)
  const [content, setContent] = useState<React.ReactNode>(null)
  const [answeredQuestions, setAnsweredQuestions] = useState<{ q1: boolean; q2: boolean; q3: boolean }>({
    q1: false,
    q2: false,
    q3: false
  })

  const handleClick = ({ answer, question }: ClickProps) => {
    // Manage visibility of questions based on answer
    setAnsweredQuestions((prev) => ({ ...prev, [`q${question}`]: true }))

    // Set results output
    setContent(
      <div
        className='mx-auto text-pretty rounded-md bg-neutral-200 px-2 py-1 text-center shadow-md'
        dangerouslySetInnerHTML={{ __html: answer }}
      ></div>
    )
  }

  return (
    <div className='relative font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/635449/original/file-20241201-17-rrt4sw.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
      >
        <div className='questions opacity-0 transition-opacity duration-300 ease-in-out'>
          <div className='absolute left-[80%] top-[51%] flex -translate-x-1/2 flex-col-reverse items-center gap-4 sm:left-[80%] sm:top-[57%] sm:-translate-y-full sm:flex-col'>
            <div
              className='flex flex-col items-center gap-1 text-xs sm:flex-row sm:gap-4 lg:text-base'
              style={{
                opacity: answeredQuestions.q1 ? 0.5 : 1,
                filter: `saturate(${answeredQuestions.q1 ? '0' : '1'})`,
                pointerEvents: answeredQuestions.q1 ? 'none' : 'inherit'
              }}
            >
              <QuizSixButton
                answer="<span class='text-green-600 font-bold'>Correct!</span> The best advice is to float, conserve your energy and signal for help."
                question={1}
                handleClick={handleClick}
                text='Float 🛟'
              ></QuizSixButton>
              <QuizSixButton
                answer='If you swam right you would be going against the current, which would tire you out!'
                question={1}
                handleClick={handleClick}
                text='Swim right 👉'
              ></QuizSixButton>
            </div>

            <div
              className='animate-bounce drop-shadow-lg'
              style={{
                opacity: answeredQuestions.q1 ? 0.5 : 1,
                filter: `saturate(${answeredQuestions.q1 ? '0' : '1'})`,
                animation: answeredQuestions.q1 ? 'none' : 'bounce 1s infinite'
              }}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='not_full_screen h-auto w-8 fill-yellow-500 !opacity-100 md:w-10'
                viewBox='0 0 400 304.422'
              >
                <path d='M252 11.222c-25.333 6.4-47.467 12.534-49.067 13.467-1.733.933-4 3.2-4.933 5.067-1.2 2.133-3.067 19.733-5.333 46.8-3.2 40-3.6 43.333-6.267 45.6-1.467 1.333-24 17.066-49.867 35.066-26 18-47.2 33.2-47.2 33.734s3.2 2 7.067 3.466c10.267 3.6 21.867 9.6 31.2 16 4.4 3.2 9.333 6.134 10.8 6.534 4 1.333 10.4-1.867 20.933-10.4 13.467-10.934 26.4-16.934 37.6-17.734 19.334-1.466 43.867 6.534 61.467 20l8.4 6.534 7.867-5.2 7.733-5.067-22.533-39.6-22.534-39.6 1.467-31.733c.8-17.467 1.733-32 2-32.267s15.2-4.533 33.333-9.467c18-4.933 34.4-10.133 36.4-11.6 1.867-1.333 4.934-5.333 6.667-8.8 2.533-5.066 2.933-7.467 2.267-12.133-1.6-10-8.934-18.133-18.134-19.867-1.866-.4-24 4.667-49.333 11.2' />
                <path d='M307.333 70.289c-21.333 5.333-36.8 21.866-40.8 43.6-6.4 34.933 26.4 67.733 61.2 61.333 23.067-4.267 40.534-21.6 44.534-44.267 4.8-27.466-14.4-55.066-42.667-61.066-8.667-1.867-13.6-1.734-22.267.4M182 226.289c-6.533 2.4-14.933 6.133-18.667 8.4-8.266 4.933-17.41 11.998-19.2 12.667s-5.466 1.6-10 1.6c-8.666.133-8.533.133-25.733-11.467-14.533-9.867-22.667-12.533-41.467-14-12.933-.933-26.533 3.867-45.466 16.267-8.4 5.466-16.667 10-18.4 10H0v54.666h400l-.267-27.733-.4-27.6-3.866-.4c-2.134-.267-4.534-1.067-5.334-1.733s-3.866-2.8-6.8-4.8-8.266-5.6-12-8c-10.4-6.934-22-10.267-36-10.267-16.4 0-27.333 3.6-42.666 13.867-6.534 4.4-14.267 8-14.267 8l-3.067 1.333s-4.4 1.333-8.8 1.333-7.867-1.333-7.867-1.333l-2.091-1.04s-4.975-2.56-9.375-5.36c-19.067-12.133-35.2-19.036-47.2-18.903-7.118-.002-11.334 2.103-18 4.503' />
              </svg>{' '}
            </div>
          </div>
          {answeredQuestions.q1 && (
            <div className='absolute left-[49%] top-[45%] flex -translate-x-1/2 flex-col-reverse items-center gap-4 sm:left-[49%] sm:top-[50%] sm:-translate-y-full sm:flex-col'>
              <div
                className='flex flex-col items-center gap-1 text-xs sm:flex-row sm:gap-4 lg:text-base'
                style={{
                  pointerEvents: answeredQuestions.q2 ? 'none' : 'inherit',
                  opacity: answeredQuestions.q2 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q2 ? '0' : '1'})`
                }}
              >
                <QuizSixButton
                  answer="It's too late to swim to shore! You might have been able to at the start but now you are in the highest-speed current."
                  question={2}
                  handleClick={handleClick}
                  text='Swim to shore 👇'
                />
                <QuizSixButton
                  answer="<span class='text-green-600 font-bold'>Correct!</span> Start signalling for help as soon as possible. Raise your arms, yell, splash around."
                  question={2}
                  handleClick={handleClick}
                  text='Signal for help 🚨'
                />
              </div>

              <div
                className='animate-bounce drop-shadow-lg'
                style={{
                  opacity: answeredQuestions.q2 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q2 ? '0' : '1'})`,
                  animation: answeredQuestions.q2 ? 'none' : 'bounce 1s infinite'
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='not_full_screen h-auto w-8 fill-yellow-500 !opacity-100 md:w-10'
                  viewBox='0 0 400 304.422'
                >
                  <path d='M252 11.222c-25.333 6.4-47.467 12.534-49.067 13.467-1.733.933-4 3.2-4.933 5.067-1.2 2.133-3.067 19.733-5.333 46.8-3.2 40-3.6 43.333-6.267 45.6-1.467 1.333-24 17.066-49.867 35.066-26 18-47.2 33.2-47.2 33.734s3.2 2 7.067 3.466c10.267 3.6 21.867 9.6 31.2 16 4.4 3.2 9.333 6.134 10.8 6.534 4 1.333 10.4-1.867 20.933-10.4 13.467-10.934 26.4-16.934 37.6-17.734 19.334-1.466 43.867 6.534 61.467 20l8.4 6.534 7.867-5.2 7.733-5.067-22.533-39.6-22.534-39.6 1.467-31.733c.8-17.467 1.733-32 2-32.267s15.2-4.533 33.333-9.467c18-4.933 34.4-10.133 36.4-11.6 1.867-1.333 4.934-5.333 6.667-8.8 2.533-5.066 2.933-7.467 2.267-12.133-1.6-10-8.934-18.133-18.134-19.867-1.866-.4-24 4.667-49.333 11.2' />
                  <path d='M307.333 70.289c-21.333 5.333-36.8 21.866-40.8 43.6-6.4 34.933 26.4 67.733 61.2 61.333 23.067-4.267 40.534-21.6 44.534-44.267 4.8-27.466-14.4-55.066-42.667-61.066-8.667-1.867-13.6-1.734-22.267.4M182 226.289c-6.533 2.4-14.933 6.133-18.667 8.4-8.266 4.933-17.41 11.998-19.2 12.667s-5.466 1.6-10 1.6c-8.666.133-8.533.133-25.733-11.467-14.533-9.867-22.667-12.533-41.467-14-12.933-.933-26.533 3.867-45.466 16.267-8.4 5.466-16.667 10-18.4 10H0v54.666h400l-.267-27.733-.4-27.6-3.866-.4c-2.134-.267-4.534-1.067-5.334-1.733s-3.866-2.8-6.8-4.8-8.266-5.6-12-8c-10.4-6.934-22-10.267-36-10.267-16.4 0-27.333 3.6-42.666 13.867-6.534 4.4-14.267 8-14.267 8l-3.067 1.333s-4.4 1.333-8.8 1.333-7.867-1.333-7.867-1.333l-2.091-1.04s-4.975-2.56-9.375-5.36c-19.067-12.133-35.2-19.036-47.2-18.903-7.118-.002-11.334 2.103-18 4.503' />
                </svg>
              </div>
            </div>
          )}
          {answeredQuestions.q2 && (
            <div className='absolute left-[15%] top-[32%] flex -translate-x-1/2 flex-col-reverse items-center gap-4 sm:left-[15%] sm:top-[39%] sm:-translate-y-full sm:flex-col'>
              <div
                className='flex flex-col items-center gap-1 text-xs sm:flex-row sm:gap-4 lg:text-base'
                style={{
                  pointerEvents: answeredQuestions.q3 ? 'none' : 'inherit',
                  opacity: answeredQuestions.q3 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q3 ? '0' : '1'})`
                }}
              >
                <QuizSixButton
                  question={3}
                  answer="<span class='text-green-600 font-bold'>Correct!</span> Continue to float until you have regained your energy or help arrives."
                  handleClick={handleClick}
                  text='Float 🛟'
                />
                <QuizSixButton
                  question={3}
                  answer='At this point you might be very tired. Swimming back could put you in danger again, except this time you have no more energy!'
                  handleClick={handleClick}
                  text='🏊‍♀️ Swim back'
                />
              </div>

              <div
                className='flex flex-col items-center gap-1 text-xs sm:flex-row sm:gap-4 lg:text-base'
                style={{
                  opacity: answeredQuestions.q3 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q3 ? '0' : '1'})`,
                  animation: answeredQuestions.q3 ? 'none' : 'bounce 1s infinite'
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='not_full_screen h-auto w-8 fill-yellow-500 !opacity-100 md:w-10'
                  viewBox='0 0 400 304.422'
                >
                  <path d='M252 11.222c-25.333 6.4-47.467 12.534-49.067 13.467-1.733.933-4 3.2-4.933 5.067-1.2 2.133-3.067 19.733-5.333 46.8-3.2 40-3.6 43.333-6.267 45.6-1.467 1.333-24 17.066-49.867 35.066-26 18-47.2 33.2-47.2 33.734s3.2 2 7.067 3.466c10.267 3.6 21.867 9.6 31.2 16 4.4 3.2 9.333 6.134 10.8 6.534 4 1.333 10.4-1.867 20.933-10.4 13.467-10.934 26.4-16.934 37.6-17.734 19.334-1.466 43.867 6.534 61.467 20l8.4 6.534 7.867-5.2 7.733-5.067-22.533-39.6-22.534-39.6 1.467-31.733c.8-17.467 1.733-32 2-32.267s15.2-4.533 33.333-9.467c18-4.933 34.4-10.133 36.4-11.6 1.867-1.333 4.934-5.333 6.667-8.8 2.533-5.066 2.933-7.467 2.267-12.133-1.6-10-8.934-18.133-18.134-19.867-1.866-.4-24 4.667-49.333 11.2' />
                  <path d='M307.333 70.289c-21.333 5.333-36.8 21.866-40.8 43.6-6.4 34.933 26.4 67.733 61.2 61.333 23.067-4.267 40.534-21.6 44.534-44.267 4.8-27.466-14.4-55.066-42.667-61.066-8.667-1.867-13.6-1.734-22.267.4M182 226.289c-6.533 2.4-14.933 6.133-18.667 8.4-8.266 4.933-17.41 11.998-19.2 12.667s-5.466 1.6-10 1.6c-8.666.133-8.533.133-25.733-11.467-14.533-9.867-22.667-12.533-41.467-14-12.933-.933-26.533 3.867-45.466 16.267-8.4 5.466-16.667 10-18.4 10H0v54.666h400l-.267-27.733-.4-27.6-3.866-.4c-2.134-.267-4.534-1.067-5.334-1.733s-3.866-2.8-6.8-4.8-8.266-5.6-12-8c-10.4-6.934-22-10.267-36-10.267-16.4 0-27.333 3.6-42.666 13.867-6.534 4.4-14.267 8-14.267 8l-3.067 1.333s-4.4 1.333-8.8 1.333-7.867-1.333-7.867-1.333l-2.091-1.04s-4.975-2.56-9.375-5.36c-19.067-12.133-35.2-19.036-47.2-18.903-7.118-.002-11.334 2.103-18 4.503' />
                </svg>{' '}
              </div>
            </div>
          )}
          <div className='invisible absolute left-auto right-4 top-2 mb-2 w-[65%] text-xs md:visible md:left-1/2 md:right-auto md:top-4 md:-translate-x-1/2 md:text-base'>
            {content}
          </div>
          <div className='absolute left-2 top-2 text-sm transition-opacity duration-300 ease-in-out md:text-lg'>
            <button
              onClick={() => {
                setAnsweredQuestions({
                  q1: false,
                  q2: false,
                  q3: false
                })
                setContent(null)
              }}
              className='cursor-pointer bg-neutral-900/50 p-2 text-white hover:shadow-lg active:scale-95'
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className='absolute bottom-full left-1/2 right-auto mb-2 w-[65%] -translate-x-1/2 text-xs md:invisible md:text-base'>
        {content}
      </div>
    </div>
  )
}
