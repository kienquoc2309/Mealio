export type OrderStatus =
  | "Pending"
  | "Preparing"
  | "On the Way"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: number;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  date: string;
  address: string;
}

export const mockOrders: Order[] = [
  {
    id: "ORD-2026-001",
    userId: 1,
    items: [
      {
        id: 9,
        name: "Classic Smash Burger",
        price: 13.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1758604916266-e906aafe1416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        id: 19,
        name: "Chocolate Lava Cake",
        price: 8.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 36.97,
    deliveryFee: 0,
    tax: 2.96,
    total: 39.93,
    status: "Delivered",
    date: "2026-03-05T14:30:00",
    address: "456 Oak Avenue, Food City, FC 10002",
  },
  {
    id: "ORD-2026-002",
    userId: 1,
    items: [
      {
        id: 14,
        name: "Pepperoni Pizza",
        price: 16.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        id: 5,
        name: "Caesar Salad",
        price: 10.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1712746785117-6aec15c9f368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 27.98,
    deliveryFee: 0,
    tax: 2.24,
    total: 30.22,
    status: "On the Way",
    date: "2026-03-07T19:15:00",
    address: "456 Oak Avenue, Food City, FC 10002",
  },
  {
    id: "ORD-2026-003",
    userId: 1,
    items: [
      {
        id: 17,
        name: "Dragon Roll",
        price: 18.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 37.98,
    deliveryFee: 0,
    tax: 3.04,
    total: 41.02,
    status: "Preparing",
    date: "2026-03-08T12:00:00",
    address: "456 Oak Avenue, Food City, FC 10002",
  },
  {
    id: "ORD-2026-004",
    userId: 3,
    items: [
      {
        id: 1,
        name: "Spaghetti Carbonara",
        price: 14.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1764586119076-61711e8ed25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
      {
        id: 20,
        name: "Tiramisu",
        price: 7.99,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 30.97,
    deliveryFee: 3.99,
    tax: 2.48,
    total: 37.44,
    status: "Delivered",
    date: "2026-03-04T20:00:00",
    address: "321 Maple St, Food City, FC 10004",
  },
  {
    id: "ORD-2026-005",
    userId: 4,
    items: [
      {
        id: 10,
        name: "BBQ Bacon Burger",
        price: 15.99,
        quantity: 3,
        image:
          "https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 47.97,
    deliveryFee: 0,
    tax: 3.84,
    total: 51.81,
    status: "Pending",
    date: "2026-03-08T13:45:00",
    address: "654 Birch Rd, Food City, FC 10005",
  },
  {
    id: "ORD-2026-006",
    userId: 3,
    items: [
      {
        id: 16,
        name: "Salmon Nigiri (6 pcs)",
        price: 16.99,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200",
      },
    ],
    subtotal: 16.99,
    deliveryFee: 3.99,
    tax: 1.36,
    total: 22.34,
    status: "Cancelled",
    date: "2026-03-03T11:00:00",
    address: "321 Maple St, Food City, FC 10004",
  },
];
