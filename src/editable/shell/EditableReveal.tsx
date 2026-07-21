'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  index?: number
  as?: ElementType
  className?: string
  /** Extra ms of delay on top of `index * step`. */
  delay?: number
  /** Stagger step per index. Default 90ms. */
  step?: number
}

/*
  IntersectionObserver-driven fade + slide. Hidden state applies only after mount
  to keep server HTML fully visible (progressive enhancement). Index/step give
  each child a small offset so groups of cards cascade in.
*/
export function EditableReveal({ children, index = 0, as = 'div', className = '', delay = 0, step = 90 }: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [ready, setReady] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setReady(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
            break
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Tag = as
  const classes = [
    ready ? 'editable-reveal' : '',
    visible ? 'is-in' : '',
    className,
  ].filter(Boolean).join(' ')

  const style = ready
    ? { animationDelay: `${delay + index * step}ms`, transitionDelay: `${delay + index * step}ms` }
    : undefined

  return (
    <Tag ref={ref as never} className={classes} style={style}>
      {children}
    </Tag>
  )
}
