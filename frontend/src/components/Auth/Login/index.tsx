import { Input } from 'components/UI/input'
import { PasswordInput } from 'components/UI/password_input'
import { Button } from 'components/UI/button'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { actions, useAppDispatch } from 'redux/provider'
import { Role } from 'types'
import { useFetchDataService } from 'components/Hooks/use_axios'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { useToast } from 'components/UI/use_toast'
import axiosInstance from 'components/Hooks/axios_instance'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showCheck, setShowCheck] = useState(false)

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {toast} = useToast()

  //TODO: auth with backend
  async function login(e) {
    e.preventDefault()
    if (!username || !password) return

    axiosInstance
      .request({
        method: 'post',
        url: 'http://localhost:3001/api/login',
        data: {
          username: username,
          password: password,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => {
        const data = res.data
        if (data && data['token']) {
          const loggedinUser = jwtDecode(data['token'])
          const currentUser = {
            isAuthenticated: true,
            user: {
              role_name:
                loggedinUser['role_name'] === 'Admin' ? Role.Admin : Role.User,
              ...loggedinUser,
            },
            loading: false,
            token: data['token'],
          }

          if (currentUser.user.role_name === Role.Admin) {
            dispatch(actions.setUserAuthInfo(currentUser))
            navigate('/admin/user')
          } else {
            dispatch(actions.setUserAuthInfo(currentUser))
            navigate('/user/search')
          }
        }
      })
      .catch((error) => {
        toast({
          title: 'something went wrong!',
          description: error.data.message
        })
      })
  }

  return (
    <div className="flex h-screen w-screen bg-white-100">
      <div className="w-1/2 bg-black p-12 text-darkTheme-white flex flex-col justify-between">
        <div>
          <GaugeIcon className="h-8 w-8 text-darkTheme-white" />
          <h1 className="mt-4 text-3xl font-semibold text-darkTheme-white">
            Acme Inc
          </h1>
        </div>
        <div>
          <blockquote>
            "This library has saved me countless hours of work and helped me
            deliver stunning designs to my clients faster than ever before."
          </blockquote>
          <p className="mt-4">Sofia Davis</p>
        </div>
      </div>
      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          <div className="bg-white-100 py-8 px-6 shadow rounded-lg sm:px-10">
            <form className="mb-0 space-y-6">
              <div>
                <Input
                  id="username"
                  className='text-neutral-900'
                  placeholder="jone001"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <PasswordInput
                  id="password"
                  className='text-neutral-900'
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <Button
                  className="w-full bg-[#bd1e59] text-white"
                  onClick={(e) => {
                    login(e)
                  }}
                >
                  Log In
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

function GaugeIcon(props) {
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
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  )
}
