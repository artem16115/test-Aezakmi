import type { CSSProperties } from 'react'
import { clsx } from 'clsx'
import styles from './Skeleton.module.scss'

interface SkeletonProps {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  className?: string
}

export function Skeleton({ width = '100%', height = 16, radius = 6, className }: SkeletonProps) {
  return (
    <span
      aria-hidden
      className={clsx(styles.skeleton, className)}
      style={{ width, height, borderRadius: radius }}
    />
  )
}
