import axios from 'axios'
import { API_URL } from '../config'

const api = axios.create({
  withCredentials: true
})

api.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('accestoken')}`
  return config
})

api.interceptors.response.use(
  config => {
    return config
  },
  async error => {
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      try {
        const originalReg = error.config

        originalReg._isRetry = true
        const response = await axios.get(API_URL + '/api/get/refresh', {
          withCredentials: true
        })

        localStorage.setItem('accestoken', response.data.accesToken)
        return api.request(originalReg)
      } catch (error) {
        console.log('Пользователь не авторизован')
      }
    }
    throw error
  }
)

export default api
