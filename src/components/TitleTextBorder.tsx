import { ReactNode, ElementType } from 'react'
import { cn } from '../util/helpers'
import { useDarkMode } from '../context/useDarkMode'

export default function TitleTextBorder({
  children,
  className,
  as: Component = 'div' // Default to div if not specified
}: {
  children: ReactNode
  className?: string
  background?: string
  as?: ElementType // Element type prop
}) {
  const { isDarkMode } = useDarkMode()

  if (isDarkMode) {
    return (
      <div className='not-prose relative grid grid-cols-1 grid-rows-1 text-neutral-800'>
        <div className='col-span-1 col-start-1 row-span-1 row-start-1' aria-hidden='true'>
          <Component
            className={cn(
              'not-sr-only pointer-events-none inline select-none bg-neutral-50 decoration-clone px-3 py-1 !leading-[1]',
              className
            )}
          >
            {children}
          </Component>
        </div>
        <div className='col-span-1 col-start-1 row-span-1 row-start-1'>
          <Component className={cn('inline decoration-clone px-3 !leading-[1] mix-blend-darken', className)}>
            {children}
          </Component>
        </div>
      </div>
    )
  }

  return (
    <div className='not-prose relative grid grid-cols-1 grid-rows-1 text-neutral-50'>
      <div className='col-span-1 col-start-1 row-span-1 row-start-1' aria-hidden='true'>
        <Component
          className={cn(
            'not-sr-only pointer-events-none inline select-none bg-neutral-800 decoration-clone px-3 py-1 !leading-[1]',
            className
          )}
        >
          {children}
        </Component>
      </div>
      <div className='col-span-1 col-start-1 row-span-1 row-start-1'>
        <Component className={cn('inline decoration-clone px-3 !leading-[1]', className)}>{children}</Component>
      </div>
    </div>
  )
}
