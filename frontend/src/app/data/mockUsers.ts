export type UserRole = "user" | "admin";

export interface MockUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  address: string;
  joinDate: string;
  initials: string;
  avatarColor: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    name: "John Doe",
    email: "user@mealio.com",
    password: "password123",
    role: "user",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Avenue, Food City, FC 10002",
    joinDate: "2024-03-15",
    initials: "JD",
    avatarColor: "bg-blue-500",
  },
  {
    id: 2,
    name: "Admin User",
    email: "admin@mealio.com",
    password: "admin123",
    role: "admin",
    phone: "+1 (555) 987-6543",
    address: "789 Admin Blvd, Food City, FC 10003",
    joinDate: "2023-01-10",
    initials: "AU",
    avatarColor: "bg-purple-500",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    password: "sarah123",
    role: "user",
    phone: "+1 (555) 345-6789",
    address: "321 Maple St, Food City, FC 10004",
    joinDate: "2024-06-20",
    initials: "SJ",
    avatarColor: "bg-pink-500",
  },
  {
    id: 4,
    name: "Mike Chen",
    email: "mike@example.com",
    password: "mike123",
    role: "user",
    phone: "+1 (555) 456-7890",
    address: "654 Birch Rd, Food City, FC 10005",
    joinDate: "2024-09-01",
    initials: "MC",
    avatarColor: "bg-amber-500",
  },
];
