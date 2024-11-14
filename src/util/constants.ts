export const ARTICLEWIDTH = {
  maxWidth: 750,
  widthCalc: ''
}

export const FIGUREWIDTH = {
  maxWidth: ARTICLEWIDTH.maxWidth * 1.2,
  base: '100%',
  widthCalc: ''
}

ARTICLEWIDTH.widthCalc = `min(100% - 40px, ${ARTICLEWIDTH.maxWidth}px)`
FIGUREWIDTH.widthCalc = `min(100% - 40px, ${FIGUREWIDTH.maxWidth}px)`

export const PINWIDTH = { base: ARTICLEWIDTH.widthCalc }
