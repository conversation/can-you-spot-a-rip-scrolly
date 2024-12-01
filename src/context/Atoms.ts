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

export { standardSize, videoSize }
