import { Navigation } from './components/Navigation'
import { Outlet } from 'react-router-dom'
import { Header } from './components/Header'
type DashboardProps = {
  panel?: JSX.Element
}
export const Dashboard: React.FC<DashboardProps> = ({ panel }) => {
  return (
    <>
      <Navigation />
      <div className={'w-3/4 min-w-[calc(100%-250px)] max-h-screen relative'}>
        <Header />
        <div className="overflow-y-scroll max-h-[calc(100%-50px)]">
          {panel ? panel : <Outlet />}
        </div>
      </div>
    </>
  )
}
