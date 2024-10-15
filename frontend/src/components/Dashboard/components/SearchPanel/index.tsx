import SearchInput from './components/Search/search_input'
import { ChatResponse } from './components/chat_response'
import { SearchResults } from './components/Search/search_results'

import React, { useEffect, useState } from 'react'
import { ReactComponent as ElasticLogo } from 'images/elastic_logo.svg'
import {
  actions,
  AppStatus, STREAMING_EVENTS,
  thunkActions,
  useAppDispatch,
  useAppSelector,
} from 'redux/provider'
import { SuggestedQueries } from './components/suggested_queries'
import DraggableContainer from "./components/others/draggerable_container";
import {PieChartType} from "types";
import MyPieChart from "./components/others/pie_chart";

import { useToast } from 'components/UI/use_toast'
import {Button} from "components/UI/button";

export default function Chat() {
  const dispatch = useAppDispatch()
  const charts = useAppSelector((state) => state.pieCharts)
  const showCharts = useAppSelector((state) => state.showPieCharts)
  const streamEvent = useAppSelector((state) => state.streamEvent)
  const status = useAppSelector((state) => state.status)
  const sources = useAppSelector((state) => state.sources)
  const followups = useAppSelector((state) => state.followups)
  const [summary, ...messages] = useAppSelector((state) => state.conversation)
  const hasSummary = useAppSelector(
    (state) => !!state.conversation?.[0]?.content
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentChartIndex, setCurrentChartIndex] = useState(0);

  const {toast} = useToast()

   const handlePrevClick = () => {
    setCurrentChartIndex((prevIndex) =>
      (prevIndex > 0 ? prevIndex - 1 : charts.length - 1)
    );
  };

  const handleNextClick = () => {
    setCurrentChartIndex((prevIndex) =>
      (prevIndex < charts.length - 1 ? prevIndex + 1 : 0)
    );
  };


  // 如果有 pie chart 则展示 chart menu
  // useEffect(() => {
  //
  // }, [showCharts]);

  useEffect(() => {
    if (streamEvent === STREAMING_EVENTS.CHART_GENERATION){
      toast({
          title: `STATUS: ${streamEvent}`,
          description: 'Generating pie chart(s)...'
        })
    }
    if (streamEvent === STREAMING_EVENTS.END_CHART_GENERATION){
      toast({
          title: `STATUS: ${streamEvent}`,
          description: 'Pie chart(s) created successfully'
        })
    }
  }, [streamEvent]);

  const handleChartMenu = (status: boolean) => {
    console.log(status)
    dispatch(actions.setShowChart(status))
  }

  const handleSearch = (query: string) => {
    dispatch(thunkActions.search(query))
  }
  const handleSendChatMessage = (query: string) => {
    dispatch(actions.resetFollowups())
    dispatch(thunkActions.askQuestion(query))
  }
  const handleSendChatMessageFocus = (query: string) => {
    dispatch(actions.resetFollowups())
    dispatch(thunkActions.askQuestion(query))
    setTimeout(() => {
      const followupInput = document.getElementsByClassName('followup-input')
      if (followupInput.length) {
        followupInput[0].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        })
      }
    }, 300)
  }
  const handleAbortRequest = () => {
    dispatch(thunkActions.abortRequest())
  }
  const handleToggleSource = (name) => {
    dispatch(actions.sourceToggle({ name }))
  }
  const handleSourceClick = (name) => {
    dispatch(actions.sourceToggle({ name, expanded: true }))

    setTimeout(() => {
      document
        .querySelector(`[data-source="${name}"]`)
        ?.scrollIntoView({ behavior: 'smooth' })
    }, 300)
  }

  const handleFormatPieChart = () => {
    return charts.map((piechart: PieChartType) => {
    return {
      series: [
        {
          chartTitle: piechart.title,
          data: piechart.value.map((value, index) => ({
            id: index,
            value: value,
            label: piechart.label[index],
          })),
        },
      ],
      width: 500,
      height: 500,

    };
  })
  }

  const suggestedQueries = [
    {
      input: 'What is our work from home policy?',
    },
    {
      input: "What's the NASA sales team?",
    },
    {
      input: 'Does the company own my side project?',
    },
    {
      input: 'What job openings do we have?',
    },
    {
      input: 'How does compensation work?',
    },
  ]



  return (
    <div className="search-panel flex items-center justify-center dark:text-white-300">
      {showCharts && (
          <DraggableContainer handleClose={handleChartMenu} title={'Pie Charts'}>
            {handleFormatPieChart().map((chartProps, index) => (
              <div key={index} className={'flex flex-col gap-5'}>
                { index === currentChartIndex &&  (
                  <>
                    {
                      charts.length >= 1 && (
                      <div className={'flex flex-row justify-between mx-[50px]'}>
                        <Button onClick={handlePrevClick} size={"sm"} variant={'outline'}>Previous</Button>
                        <div>
                          {currentChartIndex + 1} / {charts.length}
                        </div>
                        <Button onClick={handleNextClick}  size={"sm"} variant={'outline'}>Next</Button>
                      </div>
                    )
                  }
                    <MyPieChart key={index} {...chartProps} />
                  </>
                )}

              </div>
            ))}
          </DraggableContainer>
      )}
      <div className="py-16 w-2/3">
        <span className="dark:text-white-300 text-lightTheme-textTitle text-3xl font-bold pt-5">
          Hi! How can I help you today?
        </span>
        {/*<h1 className={"dark: text-white-300"}>DASHBOARD</h1>*/}
        <SearchInput
          onSearch={handleSearch}
          value={searchQuery}
          appStatus={status}
        />

        {status === AppStatus.Idle ? (
          <SuggestedQueries
            className="pt-5"
            suggestedQueries={suggestedQueries}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        ) : (
          <>
            {hasSummary ? (
              <div className="mx-auto relative mt-6">
                <ChatResponse
                  status={status}
                  messages={messages}
                  summary={summary}
                  followups={followups}
                  onSend={handleSendChatMessage}
                  onFollowupSend={handleSendChatMessageFocus}
                  onAbortRequest={handleAbortRequest}
                  onSourceClick={handleSourceClick}
                />

                <SearchResults
                  results={sources}
                  toggleSource={handleToggleSource}
                />
              </div>
            ) : (
              <div className="h-36 p-6 dark:bg-darkTheme-dark bg-lightTheme-itembg rounded-md shadow flex flex-col justify-start items-center gap-4 mt-6">
                <ElasticLogo className="w-16 h-16" />
                <p className="text-center dark:text-gray-200 text-lightTheme-textSubtitle text-sm ">
                  Looking that up for you...
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
