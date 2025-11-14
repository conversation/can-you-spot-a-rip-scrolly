import { Background } from 'react-imgix'
import { memo } from 'react'

function BackgroundImage({ src }: { src: string }) {
  return (
    <Background
      src={src}
      className='h-full w-full'
      htmlAttributes={{
        loading: 'lazy'
      }}
    ></Background>
  )
}
export default memo(BackgroundImage)
