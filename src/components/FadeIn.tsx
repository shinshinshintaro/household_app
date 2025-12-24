import { Fade, Box } from '@mui/material'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  delay?: number
}

export function FadeIn({ children, delay = 0 }: Props) {
  return (
    <Fade in appear timeout={300} style={{ transitionDelay: `${delay}ms` }}>
      <Box>{children}</Box>
    </Fade>
  )
}
