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
      <div className='mx-auto text-pretty border border-red-600 bg-red-200 px-4 py-1 text-center'>{answer}</div>
    )
  }

  return (
    <div className='relative font-base'>
      <div
        ref={parentRef}
        className='canvas-container relative mx-auto aspect-[4/3] w-canvas-width max-w-full overflow-hidden rounded-md bg-[url(https://images.theconversation.com/files/635449/original/file-20241201-17-rrt4sw.jpg?ixlib=rb-4.1.0&q=45&auto=format&w=800)] bg-cover bg-no-repeat shadow-lg'
      >
        <div className='questions transition-opacity duration-300 ease-in-out'>
          <div className=''>
            <div
              className='absolute right-[5%] top-[70%] grid -translate-y-1/2 select-none place-items-center gap-4 text-xs md:right-[12%] md:top-[48%] lg:text-base'
              style={{
                opacity: answeredQuestions.q1 ? 0.5 : 1,
                filter: `saturate(${answeredQuestions.q1 ? '0' : '1'})`
              }}
            >
              <div
                className='flex flex-col items-center gap-1 md:flex-row md:gap-4'
                style={{
                  pointerEvents: answeredQuestions.q1 ? 'none' : 'auto'
                }}
              >
                <QuizSixButton
                  answer='If you swam left you would head INTO the rip... not a good idea!'
                  question={1}
                  handleClick={handleClick}
                  text='👈 Swim left'
                ></QuizSixButton>
                <QuizSixButton
                  answer='If you swam right you would be going against the current, which would tire you out!'
                  question={1}
                  handleClick={handleClick}
                  text='Swim right 👉'
                ></QuizSixButton>
              </div>
            </div>
            <div
              className='absolute left-[75%] top-[48%] animate-bounce drop-shadow-lg md:left-[75%] md:top-[53%]'
              style={{
                opacity: answeredQuestions.q1 ? 0.5 : 1,
                filter: `saturate(${answeredQuestions.q1 ? '0' : '1'})`,
                animation: answeredQuestions.q1 ? 'none' : 'bounce 1s infinite'
              }}
            >
              <img src='SwimmerIcon.png' alt='swimmer' className='not_full_screen h-auto w-8 !opacity-100 md:w-10' />
            </div>
          </div>
          {answeredQuestions.q1 && (
            <div className=''>
              <div
                className='absolute left-[43%] top-[66%] grid -translate-x-1/2 -translate-y-1/2 select-none place-items-center gap-4 text-xs md:left-[39.2%] md:top-[41%] lg:text-base'
                style={{
                  opacity: answeredQuestions.q2 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q2 ? '0' : '1'})`
                }}
              >
                <div
                  className='flex flex-col items-center gap-1 md:flex-row md:gap-4'
                  style={{
                    pointerEvents: answeredQuestions.q2 ? 'none' : 'auto'
                  }}
                >
                  <QuizSixButton
                    answer="It's too late to swim to shore! You might have been able to at the start but now you are in the highest-speed current."
                    question={2}
                    handleClick={handleClick}
                    text='Swim to shore 👇'
                  />
                  <QuizSixButton
                    answer='Swimming out is...'
                    question={2}
                    handleClick={handleClick}
                    text='☝️ Swim out to sea'
                  />
                </div>
              </div>
              <div
                className='absolute left-[37%] top-[43%] animate-bounce drop-shadow-lg md:left-[37%] md:top-[46%]'
                style={{
                  opacity: answeredQuestions.q2 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q2 ? '0' : '1'})`,
                  animation: answeredQuestions.q2 ? 'none' : 'bounce 1s infinite'
                }}
              >
                <img
                  src='SwimmerIcon.png'
                  alt='swimmer'
                  loading='eager'
                  className='not_full_screen h-auto w-8 !opacity-100 md:w-10'
                />
              </div>
            </div>
          )}
          {answeredQuestions.q2 && (
            <div className=''>
              <div
                className='absolute left-[30%] top-[30%] grid -translate-y-1/2 select-none place-items-center gap-4 text-xs md:left-[8.2%] md:top-[30%] lg:text-base'
                style={{
                  opacity: answeredQuestions.q3 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q3 ? '0' : '1'})`
                }}
              >
                <div
                  className='flex flex-col gap-1 md:flex-row md:gap-4'
                  style={{
                    pointerEvents: answeredQuestions.q3 ? 'none' : 'auto'
                  }}
                >
                  <QuizSixButton
                    question={3}
                    answer='The newest advice is to float (not swim sideways), while signaling for help'
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
              </div>
              <div
                className='absolute left-[14%] top-[35%] animate-bounce drop-shadow-lg md:left-[14%] md:top-[35%]'
                style={{
                  opacity: answeredQuestions.q3 ? 0.5 : 1,
                  filter: `saturate(${answeredQuestions.q3 ? '0' : '1'})`,
                  animation: answeredQuestions.q3 ? 'none' : 'bounce 1s infinite'
                }}
              >
                <img src='SwimmerIcon.png' alt='swimmer' className='not_full_screen h-auto w-8 !opacity-100 md:w-10' />
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
