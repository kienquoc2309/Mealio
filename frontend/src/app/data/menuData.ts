export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  tag?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: "pasta",
    name: "Pasta",
    icon: "🍝",
    image: "https://images.unsplash.com/photo-1714611446679-6059b55d824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "salad",
    name: "Salad",
    icon: "🥗",
    image: "https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "burger",
    name: "Burger",
    icon: "🍔",
    image: "https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "pizza",
    name: "Pizza",
    icon: "🍕",
    image: "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "sushi",
    name: "Sushi",
    icon: "🍣",
    image: "https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
  {
    id: "dessert",
    name: "Dessert",
    icon: "🍰",
    image: "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  },
];

export const dishes: Dish[] = [
  // Pasta
  {
    id: 1,
    name: "Spaghetti Carbonara",
    description: "Creamy egg-based sauce with crispy pancetta, black pepper, and Pecorino Romano.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1764586119076-61711e8ed25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pasta",
    rating: 4.8,
    reviews: 234,
    tag: "Best Seller",
  },
  {
    id: 2,
    name: "Penne Arrabiata",
    description: "Spicy tomato sauce with garlic, red chili flakes, and fresh basil.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1714611446679-6059b55d824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pasta",
    rating: 4.5,
    reviews: 178,
  },
  {
    id: 3,
    name: "Fettuccine Alfredo",
    description: "Rich butter and Parmesan cream sauce tossed with wide fettuccine noodles.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1764586119076-61711e8ed25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pasta",
    rating: 4.6,
    reviews: 189,
    tag: "Chef's Pick",
  },
  {
    id: 4,
    name: "Lasagna Bolognese",
    description: "Layers of pasta, rich meat sauce, béchamel, and melted cheese.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1714611446679-6059b55d824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pasta",
    rating: 4.9,
    reviews: 312,
    tag: "Popular",
  },

  // Salad
  {
    id: 5,
    name: "Caesar Salad",
    description: "Crispy romaine lettuce, parmesan shavings, croutons, and classic Caesar dressing.",
    price: 10.99,
    image: "https://images.unsplash.com/photo-1712746785117-6aec15c9f368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "salad",
    rating: 4.7,
    reviews: 201,
    tag: "Best Seller",
  },
  {
    id: 6,
    name: "Greek Salad",
    description: "Fresh tomatoes, cucumber, olives, red onion, and feta cheese with olive oil.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "salad",
    rating: 4.5,
    reviews: 145,
  },
  {
    id: 7,
    name: "Avocado & Quinoa Bowl",
    description: "Nutritious quinoa base with avocado, cherry tomatoes, corn, and lime vinaigrette.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1712746785117-6aec15c9f368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "salad",
    rating: 4.8,
    reviews: 167,
    tag: "Healthy",
  },
  {
    id: 8,
    name: "Spinach & Strawberry Salad",
    description: "Baby spinach, fresh strawberries, candied walnuts, and balsamic glaze.",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "salad",
    rating: 4.4,
    reviews: 98,
  },

  // Burger
  {
    id: 9,
    name: "Classic Smash Burger",
    description: "Double smash patties, American cheese, pickles, onions, and secret sauce.",
    price: 13.99,
    image: "https://images.unsplash.com/photo-1758604916266-e906aafe1416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "burger",
    rating: 4.9,
    reviews: 456,
    tag: "Best Seller",
  },
  {
    id: 10,
    name: "BBQ Bacon Burger",
    description: "Juicy beef patty, crispy bacon, cheddar cheese, BBQ sauce, and onion rings.",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "burger",
    rating: 4.8,
    reviews: 334,
    tag: "Popular",
  },
  {
    id: 11,
    name: "Veggie Burger",
    description: "Plant-based patty with avocado, lettuce, tomato, and sriracha mayo.",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1758604916266-e906aafe1416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "burger",
    rating: 4.5,
    reviews: 189,
    tag: "Vegan",
  },
  {
    id: 12,
    name: "Mushroom Swiss Burger",
    description: "Beef patty topped with sautéed mushrooms, Swiss cheese, and garlic aioli.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "burger",
    rating: 4.6,
    reviews: 211,
  },

  // Pizza
  {
    id: 13,
    name: "Margherita Pizza",
    description: "San Marzano tomatoes, fresh mozzarella, basil, and extra virgin olive oil.",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pizza",
    rating: 4.8,
    reviews: 389,
    tag: "Classic",
  },
  {
    id: 14,
    name: "Pepperoni Pizza",
    description: "Loaded with premium pepperoni, mozzarella, and tomato sauce.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pizza",
    rating: 4.9,
    reviews: 512,
    tag: "Best Seller",
  },
  {
    id: 15,
    name: "Truffle Mushroom Pizza",
    description: "White truffle sauce, wild mushrooms, mozzarella, and fresh thyme.",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "pizza",
    rating: 4.7,
    reviews: 244,
    tag: "Premium",
  },

  // Sushi
  {
    id: 16,
    name: "Salmon Nigiri (6 pcs)",
    description: "Fresh Atlantic salmon over hand-pressed seasoned rice.",
    price: 16.99,
    image: "https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "sushi",
    rating: 4.9,
    reviews: 278,
    tag: "Fresh",
  },
  {
    id: 17,
    name: "Dragon Roll",
    description: "Shrimp tempura inside, avocado on top, with eel sauce and sesame seeds.",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "sushi",
    rating: 4.8,
    reviews: 356,
    tag: "Popular",
  },
  {
    id: 18,
    name: "Grilled Salmon Plate",
    description: "Teriyaki-glazed salmon fillet with steamed rice and miso soup.",
    price: 21.99,
    image: "https://images.unsplash.com/photo-1704007573697-6a516da421ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "sushi",
    rating: 4.7,
    reviews: 198,
    tag: "Chef's Pick",
  },

  // Dessert
  {
    id: 19,
    name: "Chocolate Lava Cake",
    description: "Warm molten chocolate cake served with vanilla ice cream and raspberry sauce.",
    price: 8.99,
    image: "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "dessert",
    rating: 4.9,
    reviews: 421,
    tag: "Best Seller",
  },
  {
    id: 20,
    name: "Tiramisu",
    description: "Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream.",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "dessert",
    rating: 4.8,
    reviews: 312,
  },
  {
    id: 21,
    name: "Crème Brûlée",
    description: "Silky vanilla custard with a perfectly caramelized sugar crust.",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    category: "dessert",
    rating: 4.7,
    reviews: 234,
    tag: "Premium",
  },
];
