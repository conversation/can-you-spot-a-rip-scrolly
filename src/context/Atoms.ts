import { atom } from 'jotai'
import { FIGUREWIDTH } from '../util/constants'

const standardSize = atom<{ height: number; width: number }>({
  height:
    Math.min(Math.min(window.innerWidth - 40, FIGUREWIDTH.maxWidth), window.innerHeight * 0.9 * (4 / 3)) / (4 / 3),
  width: Math.min(Math.min(window.innerWidth - 40, FIGUREWIDTH.maxWidth), window.innerHeight * 0.9 * (4 / 3))
})

const videoSize = atom<{ height: number; width: number }>({
  height:
    Math.min(Math.min(window.innerWidth - 40, FIGUREWIDTH.maxWidth), window.innerHeight * 0.9 * (16 / 9)) / (16 / 9),
  width: Math.min(Math.min(window.innerWidth - 40, FIGUREWIDTH.maxWidth), window.innerHeight * 0.9 * (16 / 9))
})

const quizReveal = atom<{
  quiz1: boolean
  quiz2: boolean
  quiz3: boolean
  quiz4: boolean
  quiz5: boolean
  quiz6: boolean
  quiz7: boolean
}>({
  quiz1: false,
  quiz2: false,
  quiz3: false,
  quiz4: false,
  quiz5: false,
  quiz6: false,
  quiz7: false
})

export { standardSize, videoSize, quizReveal }
