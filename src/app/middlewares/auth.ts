import config from '../config'
import AppError from '../errors/AppError'
import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../modules/user/user.model'
import { TUserRole } from '../modules/user/user.interface'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // checking if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { role, email } = decoded

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(email)

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
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

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
    }

    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
