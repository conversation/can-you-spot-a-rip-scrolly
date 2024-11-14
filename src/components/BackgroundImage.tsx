import Imgix from 'react-imgix'
import { cn } from '../util/helpers'

export default function BackgroundImage({
  src,
  alt,
  focalPoint,
  ar,
  sizes
}: {
  src: string
  alt: string
  focalPoint: { x: number; y: number }
  ar: string
  sizes: string
}) {
  const commonProps: {
    imgixParams: {
      fit: string
      crop: string
      auto: string
      q: number
      ar: string
      ['fp-x']: number
      ['fp-y']: number
    }
    alt: string
    sizes: string
  } = {
    imgixParams: {
      fit: 'crop',
      crop: 'focalpoint',
      auto: 'format',
      q: 30,
      ar: ar,
      ['fp-x']: focalPoint.x,
      ['fp-y']: focalPoint.y
    },
    alt: alt,
    sizes: sizes
  }

  return <Imgix className={cn('h-full w-full object-cover')} {...commonProps} src={src} disableLibraryParam />
}
