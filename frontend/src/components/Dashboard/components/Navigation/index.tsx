import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { NavList } from './components/nav_list'
import {
  UserNavConfig,
  footerConfig,
  AdminNavConfig,
} from 'components/Config/nav_config.js'
import {actions, useAppDispatch, useAppSelector} from 'redux/provider'
import { Role } from 'types'

import {PieChart} from "lucide-react";


type navItems = {
  icon: React.ReactNode
  text: string
  path: string
  isDisabled: boolean
  isSelected: boolean
}
const userConcatConfig = {
  userNavConfig: UserNavConfig,
  footerConfig: footerConfig,
}
const adminConcatConfig = {
  userNavConfig: AdminNavConfig,
  footerConfig: footerConfig,
}
export function Navigation() {
  const { user } = useAppSelector((state) => state.auth)
  const charts = useAppSelector((state) => state.pieCharts)
  const dispatch = useAppDispatch()
  const currentNavigationList =
    user.role_name == Role.Admin ? adminConcatConfig : userConcatConfig
  const [navigationList, setNavigationList] = useState(currentNavigationList)
  const navigator = useNavigate()
  const location = useLocation()
  const { pathname } = location

  const handleSelectItem = (navItem: navItems) => {
    if (!navItem.isDisabled) {
      navigator(navItem.path)
    }
  }

  useEffect(() => {
    //TODO: refine
    console.log(pathname)
    const newUserNavigationList = navigationList.userNavConfig.map(
      (section) => {
        return {
          ...section,
          navItems: section.navItems.map((item) => {
            return {
              ...item,
              isSelected: item.path === pathname,
            }
          }),
        }
      }
    )
    const newFooterNavigationList = navigationList.footerConfig.map(
      (section) => {
        return {
          ...section,
          navItems: section.navItems.map((item) => {
            return {
              ...item,
              isSelected: item.path === pathname,
            }
          }),
        }
      }
    )
    setNavigationList((prevState) => {
      return {
        footerConfig: newFooterNavigationList,
        userNavConfig: newUserNavigationList,
      }
    })
  }, [pathname])

  const handleShowPieChart = () => {
    dispatch(actions.setShowChart(true))
  }


  return (
    <>
      <div
        className={
          'w-1/4 max-w-[250px] p-4 h-screen border-r-2 gap-3 bg-lightTheme-navLight dark:bg-darkTheme-light dark:border-darkTheme-border'
        }
      >
        {/* Navigation */}
        <div className={'nav-bar overflow-y-auto gap-2 mt-5 h-3/4'}>
          {/* Content */}
          <div>
            {navigationList.userNavConfig.map((section, index) => (
              <NavList
                key={index}
                category={section.category}
                navItems={section.navItems}
                handleSelectItem={handleSelectItem}
              ></NavList>
            ))}
          </div>
          {
            charts.length >= 1 && <div>
                  <NavList category={'Charts'} navItems={[{
                    icon: <PieChart size={20}/>,
                    text: `Pie Charts: ${charts.length}`,
                    path: '',
                    isDisabled: false,
                    isSelected: false,
                  }]} handleSelectItem={handleShowPieChart}></NavList>
              </div>
          }

        </div>

        {/* Others */}
        <div className="nav-footer h-1/5">
          {navigationList.footerConfig.map((item, index) => (
            <NavList
              key={index}
              category={item.category}
              navItems={item.navItems}
              handleSelectItem={handleSelectItem}
            ></NavList>
          ))}
        </div>
        {/** todo */}
      </div>
    </>
  )
}
