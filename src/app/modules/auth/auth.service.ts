import AppError from '../../errors/AppError'
import { TLoginUser, TRegisterUser } from './auth.interface'
import httpStatus from 'http-status'
import { createToken, verifyToken } from './auth.utils'
import config from '../../config'
import { User } from '../user/user.model'
import bcrypt from 'bcrypt'
import { JwtPayload } from 'jsonwebtoken'

const loginUser = async (payload: TLoginUser) => {
  const user = await User.isUserExistsByEmail(payload.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid credentials')
  }

  // check the user already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!')
  }

  // check the user already blocked
  const userStatus = user?.isBlocked
  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  // checking if the password is correct
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  )

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials')
  }

  // create token and sent to the client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  }

  const token = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    token,
    refreshToken,
  }
}

const registrationUser = async (payload: TRegisterUser) => {
  const user = await User.isUserExistsByEmail(payload.email)

  if (user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This user is already exists!')
  }

  const { email, name } = await User.create(payload)

  return {
    email,
    name,
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByEmail(userData.email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }
  // checking if the user is already deleted

  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
  }

  // checking if the user is blocked

  const userStatus = user?.isBlocked

  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !')
  }

  //checking if the password is correct

  if (!(await User.isPasswordMatched(payload.oldPassword, user?.password)))
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched')

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string)

  const { email, iat } = decoded

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
  }

  // checking if the user is blocked
  const userStatus = user?.isBlocked

  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !')
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !')
  }

  const jwtPayload = {
    email: user.email,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}

// const forgetPassword = async (userEmail: string) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByEmail(userEmail)

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted

//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
//   }

//   // checking if the user is blocked
//   const userStatus = user?.isBlocked

//   if (userStatus) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !')
//   }

//   const jwtPayload = {
//     email: user.email,
//     role: user.role,
//   }

//   const resetToken = createToken(
//     jwtPayload,
//     config.jwt_access_secret as string,
//     '10m',
//   )

//   const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `

//   sendEmail(user.email, resetUILink)

//   console.log(resetUILink)
// }

// const resetPassword = async (
//   payload: { id: string; newPassword: string },
//   token: string,
// ) => {
//   // checking if the user is exist
//   const user = await User.isUserExistsByCustomId(payload?.id)

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !')
//   }
//   // checking if the user is already deleted
//   const isDeleted = user?.isDeleted

//   if (isDeleted) {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !')
//   }

//   // checking if the user is blocked
//   const userStatus = user?.status

//   if (userStatus === 'blocked') {
//     throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !')
//   }

//   const decoded = jwt.verify(
//     token,
//     config.jwt_access_secret as string,
//   ) as JwtPayload

//   //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

//   if (payload.id !== decoded.userId) {
//     throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!')
//   }

//   //hash new password
//   const newHashedPassword = await bcrypt.hash(
//     payload.newPassword,
//     Number(config.bcrypt_salt_rounds),
//   )

//   await User.findOneAndUpdate(
//     {
//       id: decoded.userId,
//       role: decoded.role,
//     },
//     {
//       password: newHashedPassword,
//       needsPasswordChange: false,
//       passwordChangedAt: new Date(),
//     },
//   )
// }

// TODO: Change password

export const AuthServices = {
  loginUser,
  registrationUser,
  changePassword,
  refreshToken,
}
