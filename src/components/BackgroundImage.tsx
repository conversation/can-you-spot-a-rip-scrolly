import { Background } from 'react-imgix'

export default function BackgroundImage({ src }: { src: string }) {
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
