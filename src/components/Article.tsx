import { cn } from '../util/helpers'
import ArticleContent from '../article.mdx'
import { useDarkMode } from '../context/useDarkMode'
import { useEffect, useRef } from 'react'

export default function Article({ className }: { className?: string }) {
  const { isDarkMode } = useDarkMode()
  const articleRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (articleRef.current) {
      articleRef.current.querySelectorAll('img').forEach((img) => {
        img.addEventListener('load', () => {
          img.setAttribute('loaded', '')
        })
        if (img.complete) {
          img.setAttribute('loaded', '')
        }
      })
    }
  }, [articleRef])

  return (
    <article
      ref={articleRef}
      className={cn(
        'prose prose-lg pb-8 md:prose-xl prose-figcaption:text-xs md:prose-figcaption:text-sm',
        className,
        isDarkMode ? 'prose-dark' : 'prose-light'
      )}
    >
      <ArticleContent />
    </article>
  )
}
