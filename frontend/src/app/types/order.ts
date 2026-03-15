export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'
export type PaymentMethod = 'stripe' | 'vnpay' | 'momo'
export type PaymentStatus = 'pending' | 'paid' | 'failed'

export interface OrderAddress {
  street: string
  city: string
  phone: string
  receiverName: string
}

export interface OrderItemResponse {
  foodId: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface PlaceOrderResponse {
  success: boolean
  order: OrderResponse
  paymentUrl: string
  message: string
}

export interface OrderResponse {
  _id: string
  userId: string
  items: OrderItemResponse[]
  feeShip: number
  totalAmount: number
  address: OrderAddress
  orderStatus: string
  paymentMethod: string
  paymentStatus: string
  transactionId: string
  createdAt: string
}
