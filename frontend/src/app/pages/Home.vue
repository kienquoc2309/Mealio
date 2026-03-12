<script setup lang="ts">
import { ArrowRight, Star, Clock, Truck, ShieldCheck, ChevronRight } from 'lucide-vue-next'
import { categories } from '../data/menuData'
import { markRaw } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const DELIVERY_IMG =
  'https://images.unsplash.com/photo-1659353739926-4c7df1a645a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBtYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc3MzExNjc1OHww&ixlib=rb-4.1.0&q=80&w=1080'

const RESTAURANT_IMAGE =
  'https://images.unsplash.com/photo-1769867863357-790b6150e3b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800'

const stats = [
  { label: 'Happy Customers', value: '50K+' },
  { label: 'Dishes Available', value: '200+' },
  { label: 'Cities Served', value: '30+' },
  { label: 'Years of Taste', value: '8+' },
]

const features = [
  { icon: markRaw(Clock), title: 'Fast Delivery', desc: 'Get your food delivered in under 30 minutes, hot and fresh every time.' },
  { icon: markRaw(Star), title: 'Top Rated Dishes', desc: 'Every dish is crafted by our expert chefs using only the freshest ingredients.' },
  { icon: markRaw(Truck), title: 'Free Delivery', desc: 'Enjoy free delivery on all orders above $25. No hidden fees, ever.' },
  { icon: markRaw(ShieldCheck), title: 'Safe & Hygienic', desc: 'We maintain the highest hygiene standards from kitchen to your door.' },
]

</script>

<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <section
      class="relative overflow-hidden flex flex-col"
      :style="{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d2818 0%, #1a3d2b 35%, #2D6A4F 65%, #1f4d38 100%)' }"
    >
      <!-- Decorative blobs -->
      <div
        class="absolute top-[-80px] right-[-80px] rounded-full pointer-events-none"
        :style="{ width: '420px', height: '420px', background: 'radial-gradient(circle, #40916C44 0%, transparent 70%)' }"
      />
      <div
        class="absolute bottom-[-60px] left-[-60px] rounded-full pointer-events-none"
        :style="{ width: '320px', height: '320px', background: 'radial-gradient(circle, #74C69D33 0%, transparent 70%)' }"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        :style="{ width: '700px', height: '500px', background: 'radial-gradient(ellipse, #2D6A4F55 0%, transparent 70%)' }"
      />
      <svg class="absolute top-24 left-8 opacity-10 pointer-events-none" width="80" height="80" viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="40" rx="35" ry="20" fill="#74C69D" transform="rotate(-30 40 40)" />
        <line x1="40" y1="40" x2="70" y2="30" stroke="#74C69D" stroke-width="2" />
      </svg>
      <div class="absolute top-32 right-1/3 w-3 h-3 rounded-full opacity-30 pointer-events-none" :style="{ background: '#74C69D' }" />
      <div class="absolute bottom-24 right-1/4 w-5 h-5 rounded-full opacity-20 pointer-events-none" :style="{ background: '#B7E4C7' }" />
      <div class="absolute top-1/2 left-1/4 w-2 h-2 rounded-full opacity-25 pointer-events-none" :style="{ background: '#74C69D' }" />

      <!-- Hero content -->
      <div class="relative z-10 flex-1 flex items-center px-6 md:px-12 pt-24 pb-8">
        <div class="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

          <!-- Left: text -->
          <div class="flex flex-col gap-6">
            <!-- Badge -->
            <div
              class="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-sm"
              :style="{ background: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.35)', color: '#74C69D' }"
            >
              <span class="w-2 h-2 rounded-full animate-pulse" :style="{ background: '#74C69D' }" />
              Now Delivering to Your Area
            </div>

            <!-- Headline -->
            <h1 :style="{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff' }">
              Taste the Best<br />
              <span :style="{ color: '#74C69D' }">Food Delivered</span><br />
              Right to Your Door
            </h1>

            <!-- Subtitle -->
            <p :style="{ color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', lineHeight: 1.7, maxWidth: '420px' }">
              Welcome to <span :style="{ color: '#74C69D', fontWeight: 500 }">Mealio</span> — where every meal is crafted with passion.
              Explore our diverse menu and enjoy restaurant-quality food from the comfort of your home.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-3">
              <router-link
                to="/menu"
                class="flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all hover:opacity-90 active:scale-95"
                :style="{ background: '#40916C', color: '#fff', fontWeight: 600 }"
              >
                View Menu
                <ArrowRight class="w-4 h-4" />
              </router-link>
              <a
                href="#about"
                class="px-6 py-3 rounded-full text-sm transition-all hover:bg-white/10 active:scale-95"
                :style="{ border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff', fontWeight: 500, backdropFilter: 'blur(8px)' }"
              >
                Learn More
              </a>
            </div>

            <!-- Stats -->
            <div class="flex flex-wrap gap-6 pt-4" :style="{ borderTop: '1px solid rgba(255,255,255,0.1)' }">
              <div v-for="s in stats" :key="s.label" class="flex flex-col">
                <span :style="{ color: '#fff', fontWeight: 700, fontSize: '1.4rem' }">{{ s.value }}</span>
                <span :style="{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }">{{ s.label }}</span>
              </div>
            </div>
          </div>

          <!-- Right: image with frame -->
          <div class="relative flex justify-center md:justify-end">
            <!-- Glow behind image -->
            <div
              class="absolute inset-0 rounded-3xl pointer-events-none"
              :style="{ background: 'radial-gradient(ellipse at center, #40916C55 0%, transparent 70%)', transform: 'scale(1.1)' }"
            />
            <!-- Decorative rings -->
            <div
              class="absolute rounded-full pointer-events-none"
              :style="{
                width: '380px', height: '380px',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1.5px dashed rgba(116,198,157,0.25)',
              }"
            />
            <div
              class="absolute rounded-full pointer-events-none"
              :style="{
                width: '460px', height: '460px',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                border: '1px dashed rgba(116,198,157,0.12)',
              }"
            />

            <!-- Image -->
            <div class="relative z-10" :style="{ width: 'min(100%, 420px)' }">
              <img
                :src="DELIVERY_IMG"
                alt="Mealio delivery"
                class="w-full object-cover"
                :style="{
                  borderRadius: '40% 40% 50% 50% / 30% 30% 50% 50%',
                  maxHeight: '480px',
                  objectPosition: 'top center',
                  filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.5))',
                }"
              />

              <!-- Floating card: delivery time -->
              <div
                class="absolute flex items-center gap-3 px-4 py-3 rounded-2xl"
                :style="{
                  bottom: '60px', left: '-20px',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                  minWidth: '160px',
                }"
              >
                <div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ background: '#e8f7f0' }">
                  <Clock class="w-[18px] h-[18px]" :style="{ color: '#2D6A4F' }" />
                </div>
                <div>
                  <p :style="{ color: '#1a2e1a', fontWeight: 700, fontSize: '0.85rem' }">30 min</p>
                  <p :style="{ color: '#6b7280', fontSize: '0.7rem' }">Avg. Delivery Time</p>
                </div>
              </div>

              <!-- Floating card: rating -->
              <div
                class="absolute flex items-center gap-2 px-3 py-2 rounded-2xl"
                :style="{
                  top: '30px', right: '-10px',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                }"
              >
                <span :style="{ fontSize: '1rem' }">⭐</span>
                <div>
                  <p :style="{ color: '#1a2e1a', fontWeight: 700, fontSize: '0.85rem' }">4.9/5</p>
                  <p :style="{ color: '#6b7280', fontSize: '0.7rem' }">2.4k Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="relative z-10 flex justify-center pb-8">
        <div class="flex flex-col items-center gap-1 animate-bounce" :style="{ color: 'rgba(255,255,255,0.4)' }">
          <div
            class="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            :style="{ border: '1.5px solid rgba(255,255,255,0.25)' }"
          >
            <div class="w-1 h-2 rounded-full" :style="{ background: 'rgba(255,255,255,0.5)' }" />
          </div>
        </div>
      </div>

      <!-- Bottom wave divider -->
      <div class="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" :style="{ display: 'block', width: '100%', height: '60px' }">
          <path d="M0 60 Q360 0 720 30 Q1080 60 1440 10 L1440 60 Z" :fill="auth.theme === 'dark' ? '#0a1a0f' : '#ffffff'" />
        </svg>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 bg-white dark:bg-[#0a1a0f]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14">
          <p class="text-green-600 text-sm mb-2" :style="{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }">
            Why Choose Us
          </p>
          <h2 class="text-gray-900 dark:text-[#e8f5ee] text-3xl sm:text-4xl" :style="{ fontWeight: 800 }">
            We Make Food Delivery Easy
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="f in features"
            :key="f.title"
            class="group p-6 rounded-2xl border border-gray-100 dark:border-[rgba(82,183,136,0.15)] hover:border-green-100 dark:hover:border-[rgba(82,183,136,0.3)] hover:bg-green-50/50 dark:hover:bg-[#112318] transition-all duration-300"
          >
            <div class="w-12 h-12 bg-green-100 group-hover:bg-green-600 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
              <component :is="f.icon" class="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 class="text-gray-900 dark:text-[#e8f5ee] mb-2 text-base" :style="{ fontWeight: 700 }">{{ f.title }}</h3>
            <p class="text-gray-500 dark:text-[#7aad90] text-sm leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About / Restaurant Section -->
    <section id="about" class="py-20 bg-[#f7fff9] dark:bg-[#112318]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <div class="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
              <img :src="RESTAURANT_IMAGE" alt="Mealio Restaurant" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div class="absolute -bottom-5 -right-5 sm:right-8 bg-white dark:bg-[#0d2818] rounded-2xl shadow-xl dark:shadow-[0_4px_32px_rgba(0,0,0,0.4)] p-5 flex items-center gap-4">
              <div class="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Star class="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <p class="text-gray-900 dark:text-[#e8f5ee] text-xl" :style="{ fontWeight: 800 }">4.9/5</p>
                <p class="text-gray-500 dark:text-[#4d7a60] text-xs" :style="{ fontWeight: 500 }">From 12,000+ Reviews</p>
              </div>
            </div>
          </div>

          <div class="pt-6 lg:pt-0">
            <p class="text-green-600 text-sm mb-2" :style="{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }">
              Our Story
            </p>
            <h2 class="text-gray-900 dark:text-[#e8f5ee] text-3xl sm:text-4xl mb-6" :style="{ fontWeight: 800 }">
              A Restaurant Born from a Love of Good Food
            </h2>
            <p class="text-gray-500 dark:text-[#7aad90] mb-5 leading-relaxed">
              Founded in 2018, Mealio started with a simple dream: to bring the comfort of a home-cooked meal with the quality of a five-star restaurant, delivered right to your doorstep. Our team of passionate chefs sources only the freshest, locally-grown ingredients to craft every dish.
            </p>
            <p class="text-gray-500 dark:text-[#7aad90] mb-8 leading-relaxed">
              From our signature pasta dishes to our handcrafted burgers, every bite tells a story of dedication and flavor. We serve over 50,000 happy customers across 30+ cities, and we're just getting started.
            </p>
            <router-link
              to="/menu"
              class="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-md shadow-green-200 text-sm"
              :style="{ fontWeight: 700 }"
            >
              Explore Our Menu
              <ChevronRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-20 bg-white dark:bg-[#0a1a0f]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-green-600 dark:text-[#52b788] text-sm mb-2" :style="{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }">
              Browse by Category
            </p>
            <h2 class="text-gray-900 dark:text-[#e8f5ee] text-3xl sm:text-4xl" :style="{ fontWeight: 800 }">
              What Are You Craving?
            </h2>
          </div>
          <router-link
            to="/menu"
            class="hidden sm:inline-flex items-center gap-1.5 text-green-600 text-sm hover:text-green-700 transition-colors"
            :style="{ fontWeight: 600 }"
          >
            See All <ArrowRight class="w-4 h-4" />
          </router-link>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <router-link
            v-for="cat in categories"
            :key="cat.id"
            :to="`/menu?category=${cat.id}`"
            class="group flex flex-col items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 dark:border-[rgba(82,183,136,0.15)] hover:border-green-300 dark:hover:border-[rgba(82,183,136,0.3)] hover:bg-green-50 dark:hover:bg-[#112318] transition-all duration-300"
          >
            <div class="w-16 h-16 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover" />
            </div>
            <div class="text-2xl">{{ cat.icon }}</div>
            <span class="text-gray-800 dark:text-[#e8f5ee] text-sm text-center" :style="{ fontWeight: 600 }">
              {{ cat.name }}
            </span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section
      class="py-20 relative overflow-hidden"
      :style="{ background: 'linear-gradient(135deg, #0d2818 0%, #1a3d2b 35%, #2D6A4F 65%, #1f4d38 100%)' }"
    >
      <!-- Decorative blobs -->
      <div
        class="absolute top-[-60px] right-[-60px] rounded-full pointer-events-none"
        :style="{ width: '320px', height: '320px', background: 'radial-gradient(circle, #40916C44 0%, transparent 70%)' }"
      />
      <div
        class="absolute bottom-[-40px] left-[-40px] rounded-full pointer-events-none"
        :style="{ width: '240px', height: '240px', background: 'radial-gradient(circle, #74C69D33 0%, transparent 70%)' }"
      />
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        :style="{ width: '500px', height: '300px', background: 'radial-gradient(ellipse, #2D6A4F55 0%, transparent 70%)' }"
      />
      <div class="absolute top-12 right-1/4 w-3 h-3 rounded-full opacity-30 pointer-events-none" :style="{ background: '#74C69D' }" />
      <div class="absolute bottom-16 left-1/3 w-4 h-4 rounded-full opacity-20 pointer-events-none" :style="{ background: '#B7E4C7' }" />

      <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-white text-3xl sm:text-4xl mb-4" :style="{ fontWeight: 800 }">
          Ready to Taste Something Amazing?
        </h2>
        <p class="text-lg mb-8 max-w-xl mx-auto" :style="{ color: 'rgba(255,255,255,0.65)' }">
          Browse our full menu, add your favorites to the cart, and enjoy a meal delivered with love.
        </p>
        <router-link
          to="/menu"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-full active:scale-95 transition-all shadow-xl text-base"
          :style="{ background: '#40916C', color: '#fff', fontWeight: 700 }"
        >
          Order Now
          <ArrowRight class="w-5 h-5" />
        </router-link>
      </div>
    </section>
  </main>
</template>
