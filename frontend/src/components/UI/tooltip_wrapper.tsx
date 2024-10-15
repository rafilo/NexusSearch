import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from 'components/UI/tooltip'

const TooltipWrapper = ({ children, tooltipContent }) => {
  return (
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
  )
}

export { TooltipWrapper }
