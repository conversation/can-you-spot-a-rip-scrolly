import { useEffect } from 'react'
import Article from './components/Article'
import Footer from './components/Footer'
import Header from './components/Header'
import { DarkModeProvider } from './context/DarkModeProvider'
import MarkdownProvider from './providers/MarkdownProvider'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

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
        <Header />
        <Article />
        <Footer />
      </MarkdownProvider>
    </DarkModeProvider>
  )
}
