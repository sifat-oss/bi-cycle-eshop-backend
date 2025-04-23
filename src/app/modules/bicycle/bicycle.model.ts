import { model, Schema } from 'mongoose'
import { TBicycle } from './bicycle.interface'

// Bicycle schema
const BicycleSchema = new Schema<TBicycle>(
  {
    name: {
      type: String,
      required: [true, 'Bicycle name is required.'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required.'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required.'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required.'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Bicycle type is required.'],
      enum: {
        values: ['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'],
        message:
          'Type must be one of Mountain, Road, Hybrid, BMX, or Electric.',
      },
    },
    frame: {
      material: {
        type: String,
        required: [true, 'Frame material is required.'],
      },
      size: { type: String, required: [true, 'Frame size is required.'] },
      color: { type: String, required: [true, 'Frame color is required.'] },
    },
    wheel: {
      size: {
        type: Number,
        min: [10, 'Wheel size must be at least 10 inches.'],
      },
      rim_material: { type: String },
      tire_type: { type: String },
    },
    gear: {
      shifters: { type: String },
      derailleurs: {
        front: { type: String },
        rear: { type: String },
      },
      number_of_gears: {
        type: Number,
        min: [1, 'Number of gears must be at least 1.'],
      },
    },
    brakes: {
      type: { type: String, required: [true, 'Brake type is required.'] },
      brand: { type: String, required: [true, 'Brake brand is required.'] },
    },
    suspension: {
      type: { type: String, required: [true, 'Suspension type is required.'] },
      front_fork: {
        type: String,
        required: [true, 'Front fork information is required.'],
      },
    },
    handlebar: {
      type: { type: String, required: [true, 'Handlebar type is required.'] },
      material: {
        type: String,
        required: [true, 'Handlebar material is required.'],
      },
      width: { type: String, required: [true, 'Handlebar width is required.'] },
    },
    saddle: {
      type: { type: String },
      brand: { type: String },
    },
    pedals: {
      type: { type: String, required: [true, 'Pedal type is required.'] },
      material: {
        type: String,
        required: [true, 'Pedal material is required.'],
      },
    },
    weight: {
      type: String,
      required: [true, 'Weight is required.'],
    },
    accessories: {
      bell: { type: Boolean },
      kickstand: { type: Boolean },
      rear_rack: { type: Boolean },
      fenders: { type: Boolean },
      lights: {
        front: { type: Boolean },
        rear: { type: Boolean },
      },
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price must be a positive number.'],
    },
    quantity: Number,
    inStock: {
      type: Boolean,
      required: [true, 'Stock status is required.'],
      default: true,
    },
    image: {
      front_view: {
        type: String,
        required: [true, 'Front view image is required.'],
      },
      side_view: { type: String },
      back_view: { type: String },
      rear_view: { type: String },
      close_up_gears: { type: String },
    },
  },
  {
    timestamps: true,
  },
)

// Creating the Mongoose model
export const Bicycle = model<TBicycle>('Bicycle', BicycleSchema)
