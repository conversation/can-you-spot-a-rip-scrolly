import { useEffect } from 'react'
import { useDarkMode } from './useDarkMode'

export default function ArticleSetup({
  theme,
  title,
  dropCap,
  author,
  keywords,
  description,
  image
}: {
  theme: string
  title: string
  dropCap: boolean
  author: string
  keywords: [string]
  description: string
  image: string
}) {
  const { toggleDarkMode } = useDarkMode()

  useEffect(() => {
    if (title) {
      document.title = title
    }

    // Define meta tag setup
    const metaTags = [
      { 'http-equiv': 'Content-Language', content: 'en-AU' },
      { name: 'theme-color', content: '#d8352a' },
      { name: 'msapplication-navbutton-color', content: '#d8352a' },
      { name: 'description', content: description },
      { name: 'news_keywords', content: keywords.toString() },
      { name: 'author', content: author },
      { name: 'current-region', content: 'au' },
      { property: 'og:site_name', content: 'The Conversation' },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image }
    ]

    // // Append or update meta tags
    // metaTags.forEach(({ name, property, content }) => {
    //   const meta = document.createElement('meta')
    //   if (name) meta.setAttribute('name', name)
    //   if (property) meta.setAttribute('property', property)
    //   meta.setAttribute('content', content)

    //   document.head.appendChild(meta)
    // })

    // Drop cap logic
    const article = document.querySelector('article')
    if (!article) return

    const firstPar = article.querySelector(':scope > p')
    if (dropCap && firstPar && firstPar.textContent) {
      firstPar.classList.add('drop-cap')
    }

    // Theme handling
    if (theme === 'dark') {
      toggleDarkMode(true)
      article.classList.add('prose-dark')
    } else {
      toggleDarkMode(false)
      article.classList.add('prose-light')
    }
  }, [author, description, dropCap, image, keywords, theme, title, toggleDarkMode])
}
