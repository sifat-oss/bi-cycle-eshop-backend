export type TBicycleType = {
  Mountain: 'Mountain'
  Road: 'Road'
  Hybrid: 'Hybrid'
  BMX: 'BMX'
  Electric: 'Electric'
}

// Bicycle type
export type TBicycle = {
  name: string
  brand: string
  model: string
  description: string
  type: TBicycleType[keyof TBicycleType]
  frame: {
    material: string
    size: string
    color: string
  }
  wheel?: {
    size?: number
    rim_material?: string
    tire_type?: string
  }
  gear?: {
    shifters?: string
    derailleurs?: {
      front: string
      rear: string
    }
    number_of_gears?: number
  }
  brakes: {
    type: string
    brand: string
  }
  suspension: {
    type: string
    front_fork: string
  }
  handlebar: {
    type: string
    material: string
    width: string
  }
  saddle?: {
    type: string
    brand: string
  }
  pedals: {
    type: string
    material: string
  }
  weight: string
  accessories?: {
    bell?: boolean
    kickstand?: boolean
    rear_rack?: boolean
    fenders?: boolean
    lights?: {
      front?: boolean
      rear?: boolean
    }
  }
  price: number
  quantity: number
  inStock: boolean
  image: {
    front_view: string
    side_view?: string
    back_view?: string
    rear_view?: string
    close_up_gears?: string
  }
}

// Update Bicycle Type
export type TUpdateBicycleData = {
  name?: string
  brand?: string
  model?: string
  description?: string
  type?: TBicycleType[keyof TBicycleType]
  frame?: {
    material?: string
    size?: string
    color?: string
  }
  wheel?: {
    size?: number
    rim_material?: string
    tire_type?: string
  }
  gear?: {
    shifters?: string
    derailleurs?: {
      front: string
      rear: string
    }
    number_of_gears?: number
  }
  brakes?: {
    type: string
    brand: string
  }
  suspension?: {
    type: string
    front_fork: string
  }
  handlebar?: {
    type: string
    material: string
    width: string
  }
  saddle?: {
    type: string
    brand: string
  }
  pedals?: {
    type: string
    material: string
  }
  weight?: string
  accessories?: {
    bell?: boolean
    kickstand?: boolean
    rear_rack?: boolean
    fenders?: boolean
    lights?: {
      front?: boolean
      rear?: boolean
    }
  }
  price?: number
  inStock?: boolean
  quantity?: number
  image?: {
    front_view: string
    side_view?: string
    back_view?: string
    rear_view?: string
    close_up_gears?: string
  }
}
