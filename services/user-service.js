import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Role from '../models/Role.js'
import tokenService from './token-service.js'
import UserDto from '../dtos/user-dto.js'
import ApiError from '../exceptions/api-error.js'
import nodemailer from 'nodemailer'
import config from '../config/default.json' assert { type: 'json' }
import mongoose from 'mongoose'

//const bcrypt = require('bcryptjs/dist/bcrypt')

class UserService {
  async login(email, password, remember) {
    const user = await User.findOne({ email })

    const roles = []

    if (!user)
      throw ApiError.Conflict('Ползователь с таким email не существует.')

    const isMatchPasswords = await bcrypt.compare(password, user.password)
    if (!isMatchPasswords) throw ApiError.BadRequest('Неверный пароль.')

    for (const id of user.roles) {
      const candidat = await Role.findById(id)
      if (candidat) roles.push(candidat.value)
    }

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto,
      remember
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: { id: userDto.id, roles: [...roles] } }
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.UnauthorizedError()

    const userData = tokenService.validationRefreshToken(refreshToken)

    const dbToken = tokenService.findToken(refreshToken)
    const roles = []

    if (!userData || !dbToken) throw ApiError.UnauthorizedError()

    const user = await User.findById(userData.payload.id)

    if (!user) throw ApiError.UnauthorizedError()

    for (const id of user.roles) {
      const candidat = await Role.findById(id)
      if (candidat) roles.push(candidat.value)
    }

    const userDto = new UserDto(user) // id, email
    const tokens = tokenService.generateTokens({
      ...userDto,
      remember: userData.payload.remember
    })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: {
        roles: [...roles],
        id: userDto.id,
        info: {
          name: user.username,
          surname: user.surname,
          patronymic: user.patronymic
        }
      }
    }
  }

  async sendMail(email, password) {
    let transporter = nodemailer.createTransport({
      host: config.smtp_host,
      port: config.smtp_port,
      secure: false,
      auth: {
        user: config.email,
        pass: config.password
      }
    })

    await transporter.sendMail(
      {
        from: config.email,
        to: email,
        subject: `Данные зарегистрированного пользователя на ресурсе ${config.api_url}`,
        text: 'Пожалуйста сохраните данные логин и пароль, прежде чем удалять это сообщение.',
        html: `<div>
          <p>Логин: ${email}</p>
          <p>Пароль: ${password}</p>
          <a href=${config.api_host}>Ссылка для авторизации</a>
        </div>`
      },
      error => {
        if (error) console.log('error')
      }
    )
  }
}

export default new UserService()
