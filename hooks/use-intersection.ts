import { useEffect, useRef, useState } from "react"

interface UseInViewOptions {
  /**
   * The root element to use for intersection
   */
  root?: Element | null
  /**
   * Margin around the root element
   */
  rootMargin?: string
  /**
   * Threshold at which the callback is triggered
   */
  threshold?: number | number[]
  /**
   * Only trigger the observer once
   */
  triggerOnce?: boolean
}

/**
 * Custom hook for detecting when an element is in the viewport
 */
export function useInView({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  triggerOnce = false,
}: UseInViewOptions = {}) {
  const [ref, setRef] = useState<Element | null>(null)
  const [inView, setInView] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const triggerOnceRef = useRef(false)

  useEffect(() => {
    // Skip if no element to observe or if we've already triggered once
    if (!ref || (triggerOnce && triggerOnceRef.current)) return

    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    // Create new IntersectionObserver
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting
        
        // Update state only if needed
        if (inView !== isIntersecting) {
          setInView(isIntersecting)
          
          // If element is intersecting and triggerOnce is true,
          // disconnect and set triggerOnceRef to true
          if (isIntersecting && triggerOnce) {
            triggerOnceRef.current = true
            observer.disconnect()
          }
        }
      },
      { root, rootMargin, threshold }
    )

    // Start observing
    observer.observe(ref)
    observerRef.current = observer

    // Cleanup on unmount
    return () => {
      if (observer) {
        observer.disconnect()
      }
    }
  }, [ref, root, rootMargin, threshold, triggerOnce, inView])

  return [setRef as (node: Element | null) => void, inView] as const
}
