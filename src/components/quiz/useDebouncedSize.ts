import { useState, useLayoutEffect, RefObject } from 'react'
import debounce from 'lodash-es/debounce'

const useDebouncedSize = (target: RefObject<HTMLElement>, debounceMs = 100) => {
  const [size, setSize] = useState<[number, number]>([0, 0])

  useLayoutEffect(() => {
    if (!target.current) {
      return
    }

    const debouncedSetSize = debounce(setSize, debounceMs)

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) {
        return
      }
      const entry = entries[0]
      debouncedSetSize([entry.contentRect.width, entry.contentRect.height])
    })

    resizeObserver.observe(target.current)

    return () => {
      resizeObserver.disconnect()
      debouncedSetSize.cancel()
    }
  }, [target, debounceMs])

  return size
}

export default useDebouncedSize
