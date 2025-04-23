import { Request, Response } from 'express'
import { BicycleServices } from './bicycle.service'

// create Bicycle
const createBicycle = async (req: Request, res: Response) => {
  try {
    const BicycleData = req.body
    const data = await BicycleServices.createBicycleIntoDB(BicycleData)

    res.status(200).json({
      message: 'Bicycle created successfully',
      success: true,
      data: data,
    })
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

// get all Bicycles
const getAllBicycles = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query
    const data = await BicycleServices.getAllBicyclesFromDB(searchTerm)

    res.status(200).json({
      message: 'Bicycles retrieved successfully',
      status: true,
      data: data,
    })
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

// get a specific Bicycle by id
const getSpecificBicycle = async (req: Request, res: Response) => {
  try {
    const { bicycleId } = req.params
    const data = await BicycleServices.getSpecificBicycleFromDB(bicycleId)

    res.status(200).json({
      message: 'Bicycle retrieved successfully',
      status: true,
      data: data,
    })
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

// update a specific Bicycle by id
const updateBicycle = async (req: Request, res: Response) => {
  try {
    const { bicycleId } = req.params;
    const updateData = req.body;
    const result = await BicycleServices.updateBicycleIntoDB(bicycleId, updateData);

    res.status(200).json({
      message: 'Bicycle updated successfully',
      status: true,
      data: result,
    })
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

// delete Bicycle by id
const deleteBicycle = async (req: Request, res: Response) => {
  try {
    const { bicycleId } = req.params
    const data = await BicycleServices.deleteBicycleFromDB(bicycleId)

    res.status(200).json({
      message: 'Bicycle deleted successfully',
      status: true,
      data: data,
    })
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        message: error.message || 'Something went wrong',
        success: false,
        error: error,
        stack: error.stack,
      })
    }
  }
}

export const BicycleController = {
  createBicycle,
  getAllBicycles,
  getSpecificBicycle,
  updateBicycle,
  deleteBicycle
}
