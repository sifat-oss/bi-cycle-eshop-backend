import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { bicycleSearchTerms } from './bicycle.constant'
import { TBicycle, TUpdateBicycleData } from './bicycle.interface'
import { Bicycle } from './bicycle.model'
import httpStatus from 'http-status'

// Create a Bicycle
const createBicycleIntoDB = async (payload: TBicycle) => {
  const isBicycleExist = await Bicycle.findOne({ name: payload?.name })

  if (
    isBicycleExist?.name === payload?.name &&
    isBicycleExist?.brand === payload?.brand &&
    isBicycleExist?.model === payload?.model
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Bicycle already exists, please update Bicycle quantity.',
    )
  } else {
    const result = await Bicycle.create(payload)
    if (!result) {
      throw new Error('Bicycle can not be created')
    }
    return result
  }
}

// Get All Bicycles
const getAllBicyclesFromDB = async (query: Record<string, unknown>) => {
  const bicycleQuery = new QueryBuilder(Bicycle.find(), query)
    .search(bicycleSearchTerms)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await bicycleQuery.modelQuery

  return result
}

// Get a specific Bicycle by id
const getSpecificBicycleFromDB = async (BicycleId: string) => {
  const result = await Bicycle.findById({ _id: BicycleId })
  if (!result) {
    throw new Error('Bicycle not found')
  }
  return result
}

// Update a Bicycle by id
const updateBicycleIntoDB = async (
  BicycleId: string,
  updateData: TUpdateBicycleData,
) => {
  if ((updateData?.quantity as number) > 0) {
    updateData.inStock = true
  }
  const result = await Bicycle.findByIdAndUpdate(
    { _id: BicycleId },
    { $set: updateData },
    { new: true },
  )
  if (!result) {
    throw new Error('Bicycle can not be updated')
  }
  return result
}

// Delete a Bicycle by
const deleteBicycleFromDB = async (BicycleId: string) => {
  const result = await Bicycle.deleteOne({ _id: BicycleId })
  if (!result) {
    throw new Error('Bicycle can not be deleted')
  }
  return result
}

export const BicycleServices = {
  createBicycleIntoDB,
  getAllBicyclesFromDB,
  getSpecificBicycleFromDB,
  updateBicycleIntoDB,
  deleteBicycleFromDB,
}
