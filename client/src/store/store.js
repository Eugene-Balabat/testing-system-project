import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { API_URL } from '../config'
import api from '../http'

export default class Store {
  toasts = { main: null, auth: null, report: null }
  user = { id: null, roles: [], personalinfo: null }
  isAuth = null

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(value) {
    this.isAuth = value
  }

  setToastMain(main = null) {
    this.toasts = {
      ...this.toasts,
      main
    }
  }

  setToastReport(report = null) {
    this.toasts = {
      ...this.toasts,
      report
    }
  }

  setToastAuth(auth = null) {
    this.toasts = {
      ...this.toasts,
      auth
    }
  }

  setUser(userdata = { id: null, roles: [], info: null }) {
    this.user = {
      ...this.user,
      id: userdata.id,
      roles: [...userdata.roles],
      personalinfo: { ...userdata.info }
    }
  }

  clearUserData() {
    this.setAuth(false)
    this.setUser()
    localStorage.removeItem('accestoken')
    localStorage.removeItem('userid')
    localStorage.removeItem('mainlistvalue')
  }

  async logout() {
    try {
      await api.post(API_URL + '/api/post/logout')

      this.clearUserData()
    } catch (error) {
      error.response
        ? console.log(error.response.data.message)
        : console.log(error.message)
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get(API_URL + '/api/get/refresh', {
        withCredentials: true
      })

      this.setUser(response.data.user)
      this.setAuth(true)

      localStorage.setItem('accestoken', response.data.accesToken)
      localStorage.setItem('userid', response.data.user.id)
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          this.setToastAuth({
            data: 'Возникла ошибка с данными авторизации, пожалуйста авторизуйтесь повторно.'
          })
          await this.logout()
        } else console.log(error.message)
      } else console.log(error)
    }
  }
}
