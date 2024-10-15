import { useEffect, useState } from 'react'
import { getScreenSize } from './utils'
import { actions, useAppDispatch } from './redux/provider'
import { Role } from 'types'
import { Route, Routes } from 'react-router-dom'

import Chat from './components/Dashboard/components/SearchPanel'
import Login from './components/Auth/Login'
import { Dashboard } from './components/Dashboard'
import { AdminUserPanel } from './components/Dashboard/components/AdminUserPanel'
import { HelpPanel } from './components/Dashboard/components/HelpPanel'
import { PrivateRoute } from './components/Routes/auth_route'
import { ErrorPage } from './components/Routes/error_path'

const App = () => {
  const dispatch = useAppDispatch()
  const [screenSize, setScreenSize] = useState(getScreenSize())

  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    document.documentElement.classList.toggle(savedTheme)
  }

  useEffect(() => {
    function handleResize() {
      const newScreenSize = getScreenSize()
      if (newScreenSize !== screenSize) {
        dispatch(actions.setScreenSize(newScreenSize))
        setScreenSize(newScreenSize)
      }
    }

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Initial call to set the correct screen size on mount
    handleResize()

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [screenSize])

  return (
    <div className="flex flex-row min-h-screen h-full overflow-x-hidden dark:bg-darkTheme-dark bg-lightTheme-background">
      <Routes>
        <Route path={`/`} element={<Login />} />
        <Route
          path={`/user`}
          element={
            <PrivateRoute roles={[Role.User]}>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path={`search`} element={<Chat />} />
        </Route>
        <Route
          path={`/admin`}
          element={
            <PrivateRoute roles={[Role.Admin]}>
              <Dashboard />
            </PrivateRoute>
          }
        >
          <Route path={`user`} element={<AdminUserPanel />} />
        </Route>
        <Route
          path={`/help`}
          element={<Dashboard panel={<HelpPanel />} />}
        ></Route>
        <Route path={`/setting`}></Route>
        <Route path={'*'} element={<ErrorPage />} />
      </Routes>
    </div>
  )
}

export default App
