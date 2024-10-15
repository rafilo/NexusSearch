export interface Facet {
  name: string
  entries: {
    count: number
    value: string
  }[]
}

export interface SearchResponse {
  results: Result[]
  facets: Facet[]
  streaming_id: string
  conversation_id: string
}

export interface Result {
  id: string
  category: [string]
  content: [string]
  summary: [string]
  name: [string]
  url: [string]
}

export type SourceType = {
  name: string
  summary: string[]
  url: string
  icon: string
  updated_at?: string | null
  label?: [string]
  expanded: boolean
}

export type ChatMessageType = {
  id: string
  content: string
  isHuman?: boolean
  loading?: boolean
  sources?: SourceType[]
  followups?: string[]
}

export type PieChartType = {
  id: string
  title: string
  label: string[]
  value: number[]
}

export type NavigationType = {
  isShown: boolean
}

export type ComponentType = {
  navigation: NavigationType
  draggableContainers: DraggableContainerType[]
}

export type WindowsType = {
  screen: ScreenSize
}

export type DraggableContainerType = {
  cId: string
  status: DraggableStatus
  metaData?: Object
}

export type ScreenSize = keyof typeof ScreenType
export type DraggableStatus = keyof typeof DraggableStatusType

export const ScreenType = {
  md: 'md',
  lg: 'lg',
}

export const ThemeType = {
  _: 'theme',
  DARK: 'dark',
  LIGHT: 'light',
}

export const DraggableStatusType = {
  active: 'active',
  hidden: 'hidden',
  // minimize: 'minimize',
  // maximize: 'maximize'
}

export interface AuthType {
  isAuthenticated: boolean
  user: {
    role_name: Role
    department_name: string
    first_name: string
    last_name: string
    username: string
  }
  loading: boolean
  token: string
}

export enum Role {
  Admin = 'Admin',
  User = 'User',
}
