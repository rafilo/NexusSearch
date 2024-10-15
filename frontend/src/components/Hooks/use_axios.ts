import { useCallback, useEffect, useState } from 'react'
import axiosInstance from './axios_instance'

const API_HOST = process.env.REACT_APP_API_HOST || 'http://localhost:3001/api'

export const useFetchDataService = (initialUrl = '') => {
  const [data, setData] = useState(null)
  const [disabledSubmit, setDisabledSubmit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async (url) => {
    setLoading(true)
    await axiosInstance
      .get(API_HOST + url)
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        //console.log('error:' + error);
        setError(error.message)
        setLoading(false)
      })
  }, [])

  const postRequest = useCallback(async (url, formData) => {
    setDisabledSubmit(true)
    setLoading(true)
    await axiosInstance
      .post(API_HOST + url, formData)
      .then((response) => {
        setData(response.data)
        setLoading(false)
      })
      .catch((error) => {
        setError(error.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (initialUrl) {
      fetchData(initialUrl);
    }
  }, [initialUrl, fetchData]);



  return {
    data,
    disabledSubmit,
    loading,
    error,
    setError,
    fetchData,
    postRequest,
  }
}
