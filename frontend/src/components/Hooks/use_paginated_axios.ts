import { useEffect, useState } from 'react'
import axiosInstance from './axios_instance'

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:3001/api'

export const usePaginatedDataService = () => {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async (url, pageData) => {
    await axiosInstance
      .post(API_HOST + url, pageData)
      .then((response) => {
        if (pageData.page === 1) {
          setData(response.data)
        } else {
          setData([...data, ...response.data])
        }

        if (response.data.next_page) {
          setHasMore(true)
        } else {
          setHasMore(false)
        }

        setIsLoading(false)
        setIsRefreshing(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
        setIsRefreshing(false)
      })
  }

  const postRequest = async (url, formData) => {
    setIsLoading(true)
    await axiosInstance
      .post(API_HOST + url, formData)
      .then((response) => {
        setData(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setIsLoading(false)
      })
  }

  return {
    data,
    isLoading,
    isRefreshing,
    setIsRefreshing,
    error,
    setError,
    fetchData,
    hasMore,
    setHasMore,
    postRequest,
  }
}
