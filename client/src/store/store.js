import axios from 'axios'
import { makeAutoObservable } from 'mobx'
import { API_URL } from '../config'
import api from '../http'

export default class Store {
  user = { roles: [] }
  isAuth = null

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(value) {
    this.isAuth = value
  }

  setUser(value = []) {
    this.user = { ...this.user, roles: [...value] }
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
      this.setUser()
      localStorage.removeItem('accestoken')
      localStorage.removeItem('userid')
      localStorage.removeItem('mainlistvalue')
    }
  }

  async checkAuth() {
    try {
      const response = await axios.get(API_URL + '/api/get/refresh', {
        withCredentials: true
      })

      this.setUser(response.data.user.roles)
      this.setAuth(true)

      localStorage.setItem('accestoken', response.data.accesToken)
      localStorage.setItem('userid', response.data.user.id)
    } catch (error) {
      if (error.response) {
        error.response.status === 401
          ? await this.logout()
          : console.log(error.message)
      } else console.log(error)
    }
  }
}