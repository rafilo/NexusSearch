import { useEffect, useState } from 'react'
import { Sun, SunMoon } from 'lucide-react'
import { Input } from 'components/UI/input'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from 'components/UI/dropdown_menu'
import { Button } from 'components/UI/button'
import { userMenuItems } from 'components/Config/header_config'
import { useNavigate } from 'react-router-dom'
import { actions, useAppDispatch } from 'redux/provider'

export const Header = () => {
  const [theme, setTheme] = useState('light')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    // disable toggle theme for current stage
    return
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark')
  }

  const Logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token')
    }
    navigate('/')
    dispatch(actions.reset())
  }
  return (
    <header className="flex h-[50px] items-center bg-inherit px-4 shadow-sm md:px-6 sticky top-0 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">nexusSearch Dashboard</span>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-4">
        {theme === 'dark' ? (
          <Sun
            className="hover:cursor-not-allowed text-gray-300"
            onClick={() => {
              toggleTheme()
            }}
          />
        ) : (
          <SunMoon
            className="hover:cursor-not-allowed text-gray-300"
            onClick={() => {
              toggleTheme()
            }}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-blue-300 hover:bg-blue-100"
            >
              U<span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {userMenuItems.map((item, index) => (
              <DropdownMenuItem key={index} disabled={item.isDisabled}>
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                Logout()
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}
