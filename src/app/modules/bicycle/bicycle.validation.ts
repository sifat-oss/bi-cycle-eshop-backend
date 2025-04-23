import { z } from 'zod'

const createBicycleValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required.').trim(),
    brand: z.string().min(1, 'Brand is required.').trim(),
    model: z.string().min(1, 'Model is required.').trim(),
    description: z.string().min(1, 'Description is required.').trim(),
    type: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
      errorMap: () => ({
        message:
          'Type must be one of Mountain, Road, Hybrid, BMX, or Electric.',
      }),
    }),
    frame: z.object({
      material: z.string().min(1, 'Frame material is required.'),
      size: z.string().min(1, 'Frame size is required.'),
      color: z.string().min(1, 'Frame color is required.'),
    }),
    wheel: z
      .object({
        size: z
          .number()
          .min(10, 'Wheel size must be at least 10 inches.')
          .optional(),
        rim_material: z.string().optional(),
        tire_type: z.string().optional(),
      })
      .optional(),
    gear: z
      .object({
        shifters: z.string().optional(),
        derailleurs: z
          .object({
            front: z.string(),
            rear: z.string(),
          })
          .optional(),
        number_of_gears: z
          .number()
          .min(1, 'Number of gears must be at least 1.')
          .optional(),
      })
      .optional(),
    brakes: z.object({
      type: z.string().min(1, 'Brake type is required.'),
      brand: z.string().min(1, 'Brake brand is required.'),
    }),
    suspension: z.object({
      type: z.string().min(1, 'Suspension type is required.'),
      front_fork: z.string().min(1, 'Front fork information is required.'),
    }),
    handlebar: z.object({
      type: z.string().min(1, 'Handlebar type is required.'),
      material: z.string().min(1, 'Handlebar material is required.'),
      width: z.string().min(1, 'Handlebar width is required.'),
    }),
    saddle: z
      .object({
        type: z.string(),
        brand: z.string(),
      })
      .optional(),
    pedals: z.object({
      type: z.string().min(1, 'Pedal type is required.'),
      material: z.string().min(1, 'Pedal material is required.'),
    }),
    weight: z.string().min(1, 'Weight is required.'),
    accessories: z
      .object({
        bell: z.boolean().optional(),
        kickstand: z.boolean().optional(),
        rear_rack: z.boolean().optional(),
        fenders: z.boolean().optional(),
        lights: z
          .object({
            front: z.boolean().optional(),
            rear: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
    price: z.number().min(0, 'Price must be a positive number.'),
    quantity: z.number().min(1, 'Quantity must be at least 1.'),
    inStock: z.boolean().default(true),
    image: z.object({
      front_view: z.string().min(1, 'Front view image is required.'),
      side_view: z.string().optional(),
      back_view: z.string().optional(),
      rear_view: z.string().optional(),
      close_up_gears: z.string().optional(),
    }),
  }),
})
const updateBicycleValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required.').trim().optional(),
    brand: z.string().min(1, 'Brand is required.').trim().optional(),
    model: z.string().min(1, 'Model is required.').trim().optional(),
    description: z
      .string()
      .min(1, 'Description is required.')
      .trim()
      .optional(),
    type: z
      .enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric'], {
        errorMap: () => ({
          message:
            'Type must be one of Mountain, Road, Hybrid, BMX, or Electric.',
        }),
      })
      .optional(),
    frame: z
      .object({
        material: z.string().min(1, 'Frame material is required.').optional(),
        size: z.string().min(1, 'Frame size is required.').optional(),
        color: z.string().min(1, 'Frame color is required.').optional(),
      })
      .optional(),
    wheel: z
      .object({
        size: z
          .number()
          .min(10, 'Wheel size must be at least 10 inches.')
          .optional(),
        rim_material: z.string().optional(),
        tire_type: z.string().optional(),
      })
      .optional(),
    gear: z
      .object({
        shifters: z.string().optional(),
        derailleurs: z
          .object({
            front: z.string(),
            rear: z.string(),
          })
          .optional(),
        number_of_gears: z
          .number()
          .min(1, 'Number of gears must be at least 1.')
          .optional(),
      })
      .optional(),
    brakes: z
      .object({
        type: z.string().min(1, 'Brake type is required.').optional(),
        brand: z.string().min(1, 'Brake brand is required.').optional(),
      })
      .optional(),
    suspension: z
      .object({
        type: z.string().min(1, 'Suspension type is required.').optional(),
        front_fork: z
          .string()
          .min(1, 'Front fork information is required.')
          .optional(),
      })
      .optional(),
    handlebar: z
      .object({
        type: z.string().min(1, 'Handlebar type is required.').optional(),
        material: z
          .string()
          .min(1, 'Handlebar material is required.')
          .optional(),
        width: z.string().min(1, 'Handlebar width is required.').optional(),
      })
      .optional(),
    saddle: z
      .object({
        type: z.string().optional(),
        brand: z.string().optional(),
      })
      .optional(),
    pedals: z
      .object({
        type: z.string().min(1, 'Pedal type is required.').optional(),
        material: z.string().min(1, 'Pedal material is required.').optional(),
      })
      .optional(),
    weight: z.string().min(1, 'Weight is required.').optional(),
    accessories: z
      .object({
        bell: z.boolean().optional(),
        kickstand: z.boolean().optional(),
        rear_rack: z.boolean().optional(),
        fenders: z.boolean().optional(),
        lights: z
          .object({
            front: z.boolean().optional(),
            rear: z.boolean().optional(),
          })
          .optional(),
      })
      .optional(),
    price: z.number().min(0, 'Price must be a positive number.').optional(),
    inStock: z.boolean().default(true).optional(),
    image: z
      .object({
        front_view: z.string().min(1, 'Front view image is required.'),
        side_view: z.string().optional(),
        back_view: z.string().optional(),
        rear_view: z.string().optional(),
        close_up_gears: z.string().optional(),
      })
      .optional(),
  }),
})

export const BicycleValidation = {
  createBicycleValidationSchema,
  updateBicycleValidationSchema,
}
