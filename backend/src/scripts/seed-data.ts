import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const FoodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    isAvailable: { type: Boolean, default: true, index: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    tag: { type: String, default: null },
  },
  { timestamps: true },
);

const Category = mongoose.model('Category', CategorySchema, 'categories');
const Food = mongoose.model('Food', FoodSchema, 'foods');

const categoriesData = [
  { name: 'Mì Ý', icon: '🍝', image: 'https://images.unsplash.com/photo-1714611446679-6059b55d824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Salad', icon: '🥗', image: 'https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Burger', icon: '🍔', image: 'https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Sushi', icon: '🍣', image: 'https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
  { name: 'Tráng Miệng', icon: '🍰', image: 'https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400' },
];

interface FoodSeed {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  tag?: string;
}

const foodsData: FoodSeed[] = [
  // Mì Ý
  { name: 'Mì Spaghetti Carbonara', description: 'Sốt kem trứng béo ngậy với thịt xông khói giòn, tiêu đen và phô mai Pecorino Romano.', price: 129000, image: 'https://images.unsplash.com/photo-1764586119076-61711e8ed25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Mì Ý', rating: 4.8, reviews: 234, tag: 'Bán Chạy' },
  { name: 'Mì Penne Arrabiata', description: 'Sốt cà chua cay nồng với tỏi, ớt bột và lá húng quế tươi.', price: 109000, image: 'https://images.unsplash.com/photo-1714611446679-6059b55d824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Mì Ý', rating: 4.5, reviews: 178 },
  { name: 'Mì Fettuccine Alfredo', description: 'Sốt kem bơ Parmesan thơm lừng trộn cùng sợi mì fettuccine dẹt mềm mịn.', price: 119000, image: 'https://images.unsplash.com/photo-1764586119076-61711e8ed25a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Mì Ý', rating: 4.6, reviews: 189, tag: 'Đầu Bếp Chọn' },
  { name: 'Lasagna Bolognese', description: 'Nhiều lớp mì xếp chồng với sốt thịt bằm đậm đà, sốt béchamel và phô mai tan chảy.', price: 149000, image: 'https://images.unsplash.com/photo-1714611446679-6059b55d824e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Mì Ý', rating: 4.9, reviews: 312, tag: 'Phổ Biến' },

  // Salad
  { name: 'Salad Caesar', description: 'Rau xà lách romaine giòn, phô mai Parmesan bào, bánh mì nướng và sốt Caesar truyền thống.', price: 89000, image: 'https://images.unsplash.com/photo-1712746785117-6aec15c9f368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Salad', rating: 4.7, reviews: 201, tag: 'Bán Chạy' },
  { name: 'Salad Hy Lạp', description: 'Cà chua tươi, dưa chuột, ô liu, hành tím và phô mai feta trộn dầu ô liu.', price: 79000, image: 'https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Salad', rating: 4.5, reviews: 145 },
  { name: 'Bowl Bơ & Quinoa', description: 'Hạt quinoa dinh dưỡng kết hợp bơ, cà chua bi, bắp ngọt và sốt chanh tươi.', price: 119000, image: 'https://images.unsplash.com/photo-1712746785117-6aec15c9f368?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Salad', rating: 4.8, reviews: 167, tag: 'Tốt Cho Sức Khỏe' },
  { name: 'Salad Rau Bina & Dâu Tây', description: 'Rau bina non, dâu tây tươi, hạt óc chó caramel và sốt giấm balsamic.', price: 99000, image: 'https://images.unsplash.com/photo-1605034298551-baacf17591d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Salad', rating: 4.4, reviews: 98 },

  // Burger
  { name: 'Burger Smash Cổ Điển', description: 'Hai lớp thịt bò smash, phô mai Mỹ, dưa chua, hành và sốt đặc biệt.', price: 119000, image: 'https://images.unsplash.com/photo-1758604916266-e906aafe1416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Burger', rating: 4.9, reviews: 456, tag: 'Bán Chạy' },
  { name: 'Burger BBQ Thịt Xông Khói', description: 'Thịt bò mọng nước, thịt xông khói giòn, phô mai cheddar, sốt BBQ và hành chiên giòn.', price: 139000, image: 'https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Burger', rating: 4.8, reviews: 334, tag: 'Phổ Biến' },
  { name: 'Burger Chay', description: 'Patty từ thực vật với bơ, xà lách, cà chua và sốt mayo sriracha.', price: 109000, image: 'https://images.unsplash.com/photo-1758604916266-e906aafe1416?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Burger', rating: 4.5, reviews: 189, tag: 'Thuần Chay' },
  { name: 'Burger Nấm Phô Mai Thụy Sĩ', description: 'Thịt bò kèm nấm xào, phô mai Thụy Sĩ tan chảy và sốt tỏi aioli.', price: 129000, image: 'https://images.unsplash.com/photo-1659345737306-7022e0687e0d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Burger', rating: 4.6, reviews: 211 },

  // Pizza
  { name: 'Pizza Margherita', description: 'Sốt cà chua San Marzano, phô mai mozzarella tươi, lá húng quế và dầu ô liu nguyên chất.', price: 129000, image: 'https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Pizza', rating: 4.8, reviews: 389, tag: 'Cổ Điển' },
  { name: 'Pizza Pepperoni', description: 'Phủ đầy pepperoni hảo hạng, phô mai mozzarella kéo sợi và sốt cà chua.', price: 149000, image: 'https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Pizza', rating: 4.9, reviews: 512, tag: 'Bán Chạy' },
  { name: 'Pizza Nấm Truffle', description: 'Sốt truffle trắng, nấm rừng thập cẩm, phô mai mozzarella và lá thyme tươi.', price: 179000, image: 'https://images.unsplash.com/photo-1680405620826-83b0f0f61b28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Pizza', rating: 4.7, reviews: 244, tag: 'Cao Cấp' },

  // Sushi
  { name: 'Nigiri Cá Hồi (6 miếng)', description: 'Cá hồi Đại Tây Dương tươi đặt trên cơm trộn giấm nắm tay.', price: 149000, image: 'https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Sushi', rating: 4.9, reviews: 278, tag: 'Tươi Ngon' },
  { name: 'Cuộn Rồng', description: 'Tôm tempura bên trong, bơ phủ bên ngoài, sốt lươn và mè rang.', price: 169000, image: 'https://images.unsplash.com/photo-1752095809329-5addd009f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Sushi', rating: 4.8, reviews: 356, tag: 'Phổ Biến' },
  { name: 'Cá Hồi Nướng Teriyaki', description: 'Phi lê cá hồi nướng sốt teriyaki, ăn kèm cơm trắng và súp miso.', price: 189000, image: 'https://images.unsplash.com/photo-1704007573697-6a516da421ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Sushi', rating: 4.7, reviews: 198, tag: 'Đầu Bếp Chọn' },

  // Tráng Miệng
  { name: 'Bánh Chocolate Lava', description: 'Bánh chocolate nóng với nhân tan chảy, ăn kèm kem vani và sốt mâm xôi.', price: 79000, image: 'https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Tráng Miệng', rating: 4.9, reviews: 421, tag: 'Bán Chạy' },
  { name: 'Tiramisu', description: 'Món tráng miệng Ý truyền thống với bánh ladyfinger tẩm cà phê và kem mascarpone.', price: 69000, image: 'https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Tráng Miệng', rating: 4.8, reviews: 312 },
  { name: 'Kem Brûlée', description: 'Kem trứng vani mịn màng với lớp đường caramel giòn tan hoàn hảo.', price: 85000, image: 'https://images.unsplash.com/photo-1673551490243-f29547426841?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400', category: 'Tráng Miệng', rating: 4.7, reviews: 234, tag: 'Cao Cấp' },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI!);
  console.log('Connected.');

  // Clear existing data
  await Category.deleteMany({});
  await Food.deleteMany({});
  console.log('Cleared existing categories and foods.');

  // Insert categories
  const insertedCategories = await Category.insertMany(categoriesData);
  console.log(`Inserted ${insertedCategories.length} categories.`);

  // Build category name -> _id map
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of insertedCategories) {
    categoryMap.set(cat.name, cat._id as mongoose.Types.ObjectId);
  }

  // Insert foods with categoryId
  const foodDocs = foodsData.map((food) => ({
    name: food.name,
    description: food.description,
    price: food.price,
    image: food.image,
    categoryId: categoryMap.get(food.category),
    isAvailable: true,
    rating: food.rating,
    reviews: food.reviews,
    tag: food.tag || null,
  }));

  const insertedFoods = await Food.insertMany(foodDocs);
  console.log(`Inserted ${insertedFoods.length} foods.`);

  await mongoose.disconnect();
  console.log('Seed completed successfully!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
