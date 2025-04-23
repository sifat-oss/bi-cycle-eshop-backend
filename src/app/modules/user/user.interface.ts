/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  email: string
  name: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt?: Date
  role: 'admin' | 'customer'
  gender?: 'male' | 'female' | 'others'
  dateOfBirth?: string
  contactNo?: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress?: string
  permanentAddress?: string
  profileImg?: string
  Orders: Types.ObjectId[]
  isBlocked: boolean
  isDeleted: boolean
}

export type TUserResponse = {
  _id: string
  email: string
  role: string
  name: string
  Orders: Types.ObjectId[]
  needsPasswordChange: boolean
  gender?: 'male' | 'female' | 'others'
  dateOfBirth?: string
  contactNo?: string
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  presentAddress?: string
  permanentAddress?: string
  profileImg?: string
  isBlocked: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}

export interface UserModel extends Model<TUser> {
  // instance method for user exist
  // eslint-disable-next-line no-unused-vars
  isUserExistsByEmail(email: string): Promise<TUser>

  // instance method for user id
  // eslint-disable-next-line no-unused-vars
  isUserExistById(id: string): Promise<TUser>

  // instance method for check password is matched
  // eslint-disable-next-line no-unused-vars
  isPasswordMatched(plainTextPassword: string, hashedPassword: string): boolean

  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE
