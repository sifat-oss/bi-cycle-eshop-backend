/* eslint-disable @typescript-eslint/no-explicit-any */
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { userSearchTerm } from './user.constant'
import { User } from './user.model'
import httpStatus from 'http-status'

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(userSearchTerm)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await userQuery.modelQuery
  return result
}

const getSingleUserFromDB = async (id: string) => {
  const result = await User.findById(id)

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Your account was already deleted!',
    )
  }
  return result
}

const getSingleUserByEmailFromDB = async (email: string) => {
  const result = await User.findOne({ email: email })
  return result
}

interface UpdateUserPayload {
  email?: string
  password?: string
  _id?: string
  [key: string]: any
}

const updateUserIntoDB = async ({
  id,
  payload,
}: {
  id: string
  payload: UpdateUserPayload
}) => {
  const { email, password, _id, role, ...updateData } = payload

  if (email || password || role || _id) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid update field!')
  }

  const result = await User.findByIdAndUpdate(id, updateData, { new: true })
  return result
}

const changeUserRoleIntoDB = async (id: string, role: 'admin' | 'customer') => {
  const result = await User.findByIdAndUpdate(id, { role }, { new: true })
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!')
  }
  return result
}

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndUpdate(id, { isDeleted: true })
  return result
}

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getSingleUserByEmailFromDB,
  deleteUserFromDB,
  updateUserIntoDB,
  changeUserRoleIntoDB,
}
