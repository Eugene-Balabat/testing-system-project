import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { API_URL } from '../config'
import api from '../http'

export default class Store {
  isAuth = null

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(value) {
    this.isAuth = value
  }

  async logout() {
    try {
      await api.post(API_URL + '/api/post/logout', {
        iduser: localStorage.getItem('userid')
      })
    } catch (error) {
      error.response
        ? console.log(error.response.data.message)
        : console.log(error.message)
    } finally {
      this.setAuth(false)
      localStorage.removeItem('accestoken')
      localStorage.removeItem('userid')
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get(API_URL + '/api/get/refresh', {
        withCredentials: true
      })

      this.setAuth(true)

      localStorage.setItem('accestoken', response.data.accesToken)
    } catch (error) {
      error.response.status === 401
        ? await this.logout()
        : console.log(error.message)
    }
  }
}
