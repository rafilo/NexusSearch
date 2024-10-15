import type { TypedUseSelectorHook } from 'react-redux'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { configureStore, createSlice } from '@reduxjs/toolkit'
import {
  SourceType,
  ChatMessageType,
  ComponentType,
  WindowsType,
  AuthType,
  Role, PieChartType, DraggableContainerType,
} from 'types'
import { getScreenSize } from '../utils'
import {v4 as uuidv4} from 'uuid'


type GlobalStateType = {
  status: AppStatus
  conversation: ChatMessageType[]
  streamEvent: STREAMING_EVENTS | '[READY]'
  sources: SourceType[]
  followups: string[]
  pieCharts: PieChartType[]
  showPieCharts: boolean
  sessionId: string | null
  windows: WindowsType
  component: ComponentType
  auth: AuthType
}

class RetriableError extends Error {}
class FatalError extends Error {}
export enum AppStatus {
  Idle = 'idle',
  StreamingMessage = 'loading',
  Done = 'done',
  Error = 'error',
}
export enum STREAMING_EVENTS {
  SESSION_ID = '[SESSION_ID]',
  SOURCE = '[SOURCE]',
  DONE = '[DONE]',
  FOLLOWUP = '[FOLLOWUP]',

  CHART_GENERATION = '[CHART_GENERATION]',
  END_CHART_GENERATION = '[END_CHART_GENERATION]',
  CHART_DATA = '[CHART_DATA]',
}

const GLOBAL_STATE: GlobalStateType = {
  status: AppStatus.Idle,
  conversation: [],
  sessionId: null,
  streamEvent: '[READY]',
  sources: [],
  followups: [],
  pieCharts: [],
  windows: {
    screen: getScreenSize(),
  },
  showPieCharts: false,
  component: {
    navigation: {
      isShown: false,
    },
    draggableContainers: [],
  },
  auth: {
    isAuthenticated: false,
    user: {
      role_name: Role.User,
      department_name: '',
      first_name: '',
      last_name: '',
      username: '',
    },
    loading: false,
    token: '',
  },
}
const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:3001/api'

let abortController: AbortController | null = null
const globalSlice = createSlice({
  name: 'global',
  initialState: GLOBAL_STATE as GlobalStateType,
  reducers: {
    setShowChart: (state, action) => {
      const status: boolean = action.payload
      state.showPieCharts = status
    },
    addSource: (state, action) => {
      const source = action.payload.source
      const rootSource = state.sources.find(
        (s) =>
          s.name === source.name &&
          s.url === source.url &&
          s.updated_at === source.updated_at
      )

      if (rootSource) {
        if (!rootSource.summary.find((summary) => summary === source.summary)) {
          rootSource.summary = [...rootSource.summary, source.summary]
        }
      } else {
        state.sources.push({ ...source, summary: [source.summary] })
      }
    },
    addDraggableContainer: (state, action) => {
      const newContainer:DraggableContainerType = {
        cId:action.payload.cId,
        status: action.payload.status,
        metaData: action.payload.metaData,
      }
      // @ts-ignore
      state.component.draggableContainers.push(newContainer)
    },
    deleteDraggableContainer: (state, action) => {
      // console.log(action.payload)
      // @ts-ignore
      state.component.draggableContainers = state.component.draggableContainers.filter(
        container => container.cId !== action.payload
      );
    },
    setDraggableContainer: (state, action) => {
      console.log(action.payload.status)
      // @ts-ignore
      const newState:DraggableContainerType = state.component.draggableContainers.map(container => {
        if (container.cId === action.payload.cId) {
          return {
            ...container,
            status: action.payload.status
          };
        }
        return container;
      });

      // @ts-ignore
      state.component.draggableContainers = newState;
    },
    setStreamEvent: (state, action) => {
      const streamEvent: STREAMING_EVENTS = action.payload
      state.streamEvent = streamEvent
    },
    addPieChart: (state, action) => {
      const pieChart: PieChartType = action.payload
      state.pieCharts.push(pieChart)
    },
    addFollowup: (state, action) => {
      const followup = action.payload
      state.followups.push(followup)
    },
    setStatus: (state, action) => {
      state.status = action.payload.status
    },
    setSessionId: (state, action) => {
      state.sessionId = action.payload.sessionId
    },
    addMessage: (state, action) => {
      state.conversation.push(action.payload.conversation)
    },
    updateMessage: (state, action) => {
      const messageIndex = state.conversation.findIndex(
        (c) => c.id === action.payload.id
      )

      if (messageIndex !== -1) {
        state.conversation[messageIndex] = {
          ...state.conversation[messageIndex],
          ...action.payload,
        }
      }
    },
    setMessageSource: (state, action) => {
      const message = state.conversation.find((c) => c.id === action.payload.id)

      if (message) {
        let matchedSources = []
        action.payload.sources.forEach((sourceName) => {
          const reg = new RegExp(sourceName, 'g')
          state.sources.forEach((stateSource) => {
            stateSource.name.match(reg)
              ? matchedSources.push(stateSource)
              : null
          })
        })
        message.sources = matchedSources.filter((source) => !!source)
        /*
        message.sources = action.payload.sources
          .map((sourceName) =>
            state.sources.find((stateSource) => stateSource.name === sourceName)
          )
          .filter((source) => !!source)
          */
      }
    },
    removeMessage: (state, action) => {
      const messageIndex = state.conversation.findIndex(
        (c) => c.id === action.payload.id
      )

      if (messageIndex !== -1) {
        state.conversation.splice(messageIndex, 1)
      }
    },
    sourceToggle: (state, action) => {
      const source = state.sources.find((s) => s.name === action.payload.name)

      if (source) {
        source.expanded = action.payload.expanded ?? !source.expanded
      }
    },
    reset: (state) => {
      state.status = AppStatus.Idle
      state.sessionId = null
      state.conversation = []
      state.sources = []
      state.followups = []
      state.pieCharts = []
    },
    resetFollowups:(state) => {
      state.followups = []
    },
    setScreenSize: (state, action) => {
      state.windows.screen = action.payload
    },
    setUserAuthInfo: (state, action) => {
      state.auth = action.payload
    },
  },
})

const store = configureStore({
  reducer: globalSlice.reducer,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const actions = globalSlice.actions

export const thunkActions = {
  search: (query: string) => {
    return async function fetchSearch(dispatch, getState) {
      if (getState().status === AppStatus.StreamingMessage) {
        dispatch(thunkActions.abortRequest())
      }

      dispatch(actions.reset())
      dispatch(thunkActions.chat(query))
    }
  },
  askQuestion: (question: string) => {
    return async function (dispatch, getState) {
      const state = getState()

      dispatch(
        actions.addMessage({
          conversation: {
            isHuman: true,
            content: question,
            id: state.conversation.length + 1,
          },
        })
      )
      dispatch(thunkActions.chat(question))
    }
  },
  chat: (question: string) => {
    return async function fetchSearch(dispatch, getState) {
      abortController = new AbortController()
      const conversationId = getState().conversation.length + 1

      dispatch(
        actions.addMessage({
          conversation: {
            isHuman: false,
            content: '',
            id: conversationId,
          },
        })
      )
      dispatch(actions.setStatus({ status: AppStatus.StreamingMessage }))

      let countRetiresError = 0
      let message = ``
      const sessionId = getState().sessionId
      const sourcesMap: Map<
        string,
        { name: string; url?: string; summary: string[] }
      > = new Map()

      await fetchEventSource(
        //`${API_HOST}/chat${sessionId ? `?session_id=${sessionId}` : ''}`,
        `${API_HOST}/chat_refined${
          sessionId ? `?session_id=${sessionId}` : ''
        }`,
        {
          method: 'POST',
          openWhenHidden: true,
          body: JSON.stringify({
            question,
            permission: [
              getState().auth.user.department_name,
              getState().auth.user.role_name,
            ],
            department: getState().auth.user.department_name,
            role: getState().auth.user.role_name,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          signal: abortController.signal,
          async onmessage(event) {
            if (event.event === 'FatalError') {
              throw new FatalError(event.data)
            }

            if (event.data.startsWith(STREAMING_EVENTS.SESSION_ID)) {
              const sessionId = event.data.split(' ')[1].trim()
              dispatch(actions.setSessionId({ sessionId }))
            } else if (event.data.startsWith(STREAMING_EVENTS.SOURCE)) {
              const source = event.data.replace(
                `${STREAMING_EVENTS.SOURCE} `,
                ''
              )

              try {
                if (source) {
                  const parsedSource: {
                    name: string
                    page_content: string
                    url?: string
                    category?: string
                    updated_at?: string | null
                    label?: string[]
                  } = JSON.parse(source.replaceAll('\n', ''))

                  if (parsedSource.page_content && parsedSource.name) {
                    dispatch(
                      actions.addSource({
                        source: {
                          name: parsedSource.name,
                          url: parsedSource.url,
                          summary: parsedSource.page_content,
                          icon: parsedSource.category,
                          updated_at: parsedSource.updated_at,
                          label: parsedSource.label,
                        },
                      })
                    )
                  }
                }
              } catch (e) {
                console.log('error', source, event.data)
                console.error(e)
              }
            } else if (event.data.startsWith(STREAMING_EVENTS.FOLLOWUP)){
              const followup = event.data.split(STREAMING_EVENTS.FOLLOWUP)[1]

              try {
                if (followup) {     
                  console.log(followup)
                  dispatch(actions.addFollowup(followup.replace(/^[\s0-9.]+/g, '').trim()))
                }
              } catch (e) {
                console.log('error', followup, event.data)
                console.error(e)
              }
            } else if (event.data === STREAMING_EVENTS.DONE) {
              const sources = parseSources(message)
              dispatch(
                actions.setMessageSource({
                  id: conversationId,
                  sources,
                })
              )

              dispatch(actions.setStatus({ status: AppStatus.Done }))
            } else if (event.data === STREAMING_EVENTS.CHART_GENERATION){
              dispatch(actions.setStreamEvent(STREAMING_EVENTS.CHART_GENERATION))

            } else if (event.data === STREAMING_EVENTS.END_CHART_GENERATION){
              dispatch(actions.setStreamEvent(STREAMING_EVENTS.END_CHART_GENERATION))
              dispatch(actions.setShowChart(true))
              dispatch(actions.setStreamEvent('READY'))
            } else if (event.data.startsWith(STREAMING_EVENTS.CHART_DATA)){
              const chart_data = event.data.split(STREAMING_EVENTS.CHART_DATA)[1]
              console.log(chart_data)

              // 使用正则表达式提取value
              const valueMatch = chart_data.match(/value=\[(.*?)\]/);
              const value = valueMatch ? valueMatch[1].split(',').map(Number) : [];

              // 使用正则表达式提取label
              const labelMatch = chart_data.match(/label=\[(.*?)\]/);
              const label = labelMatch ? labelMatch[1].split(',').map(item => item.trim().replace(/['"]+/g, '')) : [];

              // 使用正则表达式提取pie_chat_title
              const titleMatch = chart_data.match(/pie_chat_title='(.*?)'/);
              const pieChatTitle = titleMatch ? titleMatch[1] : '';

              const pieChart: PieChartType = {
                title: pieChatTitle,
                id: uuidv4(),
                value: value,
                label: label
              }
              dispatch(
                actions.addPieChart(pieChart)
              )

            }
            else {
              message += event.data.replaceAll('<br>', '\n')
              dispatch(
                actions.updateMessage({
                  id: conversationId,
                  content: `${message.replace(/SOURCES:(.+)*/, '')}`,
                })
              )
            }
          },
          async onopen(response) {
            if (response.ok) {
              return
            } else if (
              response.status >= 400 &&
              response.status < 500 &&
              response.status !== 429
            ) {
              throw new FatalError()
            } else {
              throw new RetriableError()
            }
          },
          onerror(err) {
            if (err instanceof FatalError || countRetiresError > 3) {
              dispatch(actions.setStatus({ status: AppStatus.Error }))

              throw err
            } else {
              countRetiresError++
              console.error(err)
            }
          },
        }
      )
    }
  },
  abortRequest: () => {
    return function (dispatch, getState) {
      const messages = getState().conversation
      const lastMessage = messages[getState().conversation.length - 1]

      abortController?.abort()
      abortController = null

      if (!lastMessage.content) {
        dispatch(
          actions.removeMessage({
            id: lastMessage.id,
          })
        )
      }
      dispatch(
        actions.setStatus({
          status: messages.length ? AppStatus.Done : AppStatus.Idle,
        })
      )
    }
  },
}

const parseSources = (message: string) => {
  message = message.replaceAll('"', '')
  const match = message.match(/SOURCES:(.+)*/)
  if (match && match[1]) {
    return match[1].split(',').map((element) => {
      return element.trim()
    })
  }
  return []
}

export const GlobalStateProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>
}
