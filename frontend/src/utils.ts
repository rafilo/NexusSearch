import { ScreenSize } from './types'
import { v4 as uuidv4 } from 'uuid'

export function getScreenSize(): ScreenSize {
  const width = window.innerWidth
  // if (width >= 976) return 'lg';
  // if (width >= 768) return 'md';

  if (width >= 800) return 'lg'
  if (width >= 650) return 'md'
  return 'md'
}
