import axios, { AxiosInstance, AxiosResponse } from 'axios'

let axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_HOST || 'http://localhost:3001/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded',
  },
})

// axios interceptors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.headers.authorization) {
      localStorage.setItem('token', response.headers.authorization)
    } else {
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token)
      }
    }

    return response
  },
  // request error
  (error: any) => {
    const { response } = error
    if (response) {
      return Promise.reject(response)
    } else {
      console.log('connection error')
    }
  }
)

// axios interceptors
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    config.headers['Content-Type'] = 'application/json'
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  }
)

export default axiosInstance
