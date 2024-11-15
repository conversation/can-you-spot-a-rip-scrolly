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

export const breakpoints: {
  media: string
  sizing: string
}[] = [
  { media: '(max-width: 699px)', sizing: 'mobile' },
  { media: '(orientation: landscape) and (max-width: 979px)', sizing: 'tabletLandscape' },
  { media: '(min-width: 700px) and (max-width: 979px)', sizing: 'tablet' },
  { media: '(min-width: 980px) and (max-width: 1799px)', sizing: 'laptop' },
  { media: '(min-width: 1800px)', sizing: 'desktop' }
]

export const widthsQualities = [
  { w: 700, q: 15, dpr: 3 },
  { w: 960, q: 30, dpr: 2 },
  { w: 1400, q: 30, dpr: 2 },
  { w: 2100, q: 45, dpr: 1 }
]
