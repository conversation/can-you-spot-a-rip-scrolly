import { useEffect, lazy, Suspense } from 'react'
import { DarkModeProvider } from './context/DarkModeProvider'
import MarkdownProvider from './providers/MarkdownProvider'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

const Header = lazy(() => import('./components/Header'))
const Article = lazy(() => import('./components/Article'))
const Footer = lazy(() => import('./components/Footer'))

export default function App() {
  gsap.registerPlugin(ScrollTrigger)

  useEffect(() => {
    document.querySelectorAll('img').forEach((img) => {
      img.addEventListener('load', () => {
        img.setAttribute('loaded', '')
      })
      if (img.complete) {
        img.setAttribute('loaded', '')
      }
    })
    document.querySelectorAll('video').forEach((video) => {
      // Add an event listener for the 'loadeddata' event
      video.addEventListener('loadeddata', () => {
        video.setAttribute('loaded', '')
      })

      // If the video is already ready, set the attribute
      if (video.readyState >= 1) {
        // 1 corresponds to HAVE_METADATA
        video.setAttribute('loaded', '')
      }
    })
  }, [])

  return (
    <DarkModeProvider>
      <MarkdownProvider>
        <Suspense
          fallback={
            <div className='h-screen place-content-center bg-[rgb(142_158_157_/1)]'>
              <p className='text-center text-lg font-bold'>Loading..</p>.
            </div>
          }
        >
          <Header />
          <Article />
          <Footer />
        </Suspense>
      </MarkdownProvider>
    </DarkModeProvider>
  )
}
