<script setup lang="ts">
import { Smartphone, Star, Zap, Bell, MapPin, ChevronRight } from 'lucide-vue-next'
import { markRaw } from 'vue'

const APP_IMAGE = 'https://images.unsplash.com/photo-1729860649884-40ec104f9dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800'

const features = [
  { icon: markRaw(Zap), title: 'Lightning Fast', desc: 'Order in seconds with our streamlined checkout experience.' },
  { icon: markRaw(Bell), title: 'Real-time Tracking', desc: 'Track your order from kitchen to your door, live on the map.' },
  { icon: markRaw(MapPin), title: 'Live Delivery Map', desc: 'Watch your delivery rider in real time with precise GPS tracking.' },
  { icon: markRaw(Star), title: 'Exclusive App Deals', desc: 'Get exclusive discounts and loyalty rewards only on the mobile app.' },
]

</script>

<template>
  <main class="min-h-screen bg-white pt-20 lg:pt-24">
    <!-- Hero -->
    <section
      class="py-20 px-4 relative overflow-hidden"
      :style="{ background: 'linear-gradient(135deg, #0d2818 0%, #1a3d2b 35%, #2D6A4F 65%, #1f4d38 100%)' }"
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
      <div class="absolute top-32 right-1/3 w-3 h-3 rounded-full opacity-30 pointer-events-none" :style="{ background: '#74C69D' }" />
      <div class="absolute bottom-24 right-1/4 w-5 h-5 rounded-full opacity-20 pointer-events-none" :style="{ background: '#B7E4C7' }" />

      <div class="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
            :style="{ background: 'rgba(116,198,157,0.15)', border: '1px solid rgba(116,198,157,0.35)' }"
          >
            <Smartphone class="w-4 h-4" :style="{ color: '#74C69D' }" />
            <span class="text-sm" :style="{ fontWeight: 600, color: '#74C69D' }">Mealio Mobile App</span>
          </div>
          <h1 class="text-white text-4xl sm:text-5xl mb-5" :style="{ fontWeight: 800, lineHeight: 1.1 }">
            Order Food <br />
            On the Go
          </h1>
          <p class="text-lg mb-8 leading-relaxed max-w-md" :style="{ color: 'rgba(255,255,255,0.65)' }">
            Download the Mealio app and enjoy seamless food ordering, real-time delivery tracking, and exclusive mobile-only deals.
          </p>

          <!-- App ratings -->
          <div class="flex items-center gap-6 mb-8">
            <div class="text-center">
              <div class="flex items-center gap-1 justify-center mb-1">
                <Star v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </div>
              <p class="text-white text-sm" :style="{ fontWeight: 700 }">4.9 App Store</p>
            </div>
            <div class="w-px h-10 bg-white/20" />
            <div class="text-center">
              <div class="flex items-center gap-1 justify-center mb-1">
                <Star v-for="i in 5" :key="i" class="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </div>
              <p class="text-white text-sm" :style="{ fontWeight: 700 }">4.8 Google Play</p>
            </div>
          </div>

          <!-- Download buttons -->
          <div class="flex flex-wrap gap-4">
            <button class="flex items-center gap-3 px-6 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-900 active:scale-95 transition-all shadow-xl">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div class="text-left">
                <p class="text-xs opacity-75">Download on the</p>
                <p class="text-base" :style="{ fontWeight: 700 }">App Store</p>
              </div>
            </button>
            <button class="flex items-center gap-3 px-6 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-900 active:scale-95 transition-all shadow-xl">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.18 23.76c.3.17.64.24.99.2l12.29-7.08-2.76-2.76-10.52 9.64zM20.46 10.37L17.63 8.7l-3.08 3.08 3.08 3.08 2.83-1.67c.81-.47.81-1.35 0-1.82zM2.1.24C1.83.52 1.67.94 1.67 1.5v21c0 .56.16.98.43 1.26l.07.06 11.76-11.76v-.28L2.17.18 2.1.24zM16.53 15.96L4.24 23.04l-.06.05c-.35.2-.72.25-1.01.14l12.33-7.1 1.03-1.03v-.54l-1.03-1.03 1.03 1.03v.54l-1.03 1.03v-.18l1.03-1.0z" />
              </svg>
              <div class="text-left">
                <p class="text-xs opacity-75">Get it on</p>
                <p class="text-base" :style="{ fontWeight: 700 }">Google Play</p>
              </div>
            </button>
          </div>
        </div>

        <!-- App mockup -->
        <div class="flex justify-center">
          <div class="relative">
            <div class="w-64 sm:w-72 bg-gray-900 rounded-[3rem] p-3 shadow-2xl ring-4 ring-white/20">
              <div class="bg-gray-800 rounded-[2.5rem] overflow-hidden aspect-[9/19.5]">
                <img :src="APP_IMAGE" alt="Mealio App" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/50" />
              </div>
            </div>
            <div class="absolute -right-6 top-1/3 bg-white rounded-2xl shadow-xl p-4 text-center">
              <p class="text-green-600 text-2xl" :style="{ fontWeight: 800 }">1M+</p>
              <p class="text-gray-500 text-xs" :style="{ fontWeight: 500 }">Downloads</p>
            </div>
            <div class="absolute -left-6 bottom-1/4 bg-white rounded-2xl shadow-xl p-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-lg">🍔</span>
                </div>
                <div>
                  <p class="text-gray-900 text-xs" :style="{ fontWeight: 700 }">Order Delivered!</p>
                  <p class="text-gray-400 text-[10px]">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-20 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-14">
          <p class="text-green-600 text-sm mb-2" :style="{ fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }">
            App Features
          </p>
          <h2 class="text-gray-900 text-3xl sm:text-4xl" :style="{ fontWeight: 800 }">
            Everything You Need, In One App
          </h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="f in features" :key="f.title" class="p-6 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-all group text-center">
            <div class="w-12 h-12 bg-green-100 group-hover:bg-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto transition-colors duration-300">
              <component :is="f.icon" class="w-5 h-5 text-green-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 class="text-gray-900 mb-2" :style="{ fontWeight: 700 }">{{ f.title }}</h3>
            <p class="text-gray-500 text-sm leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="py-16 px-4 relative overflow-hidden"
      :style="{ background: 'linear-gradient(135deg, #0d2818 0%, #1a3d2b 35%, #2D6A4F 65%, #1f4d38 100%)' }"
    >
      <div
        class="absolute top-[-60px] right-[-60px] rounded-full pointer-events-none"
        :style="{ width: '320px', height: '320px', background: 'radial-gradient(circle, #40916C44 0%, transparent 70%)' }"
      />
      <div
        class="absolute bottom-[-40px] left-[-40px] rounded-full pointer-events-none"
        :style="{ width: '240px', height: '240px', background: 'radial-gradient(circle, #74C69D33 0%, transparent 70%)' }"
      />
      <div class="absolute top-12 right-1/4 w-3 h-3 rounded-full opacity-30 pointer-events-none" :style="{ background: '#74C69D' }" />
      <div class="absolute bottom-16 left-1/3 w-4 h-4 rounded-full opacity-20 pointer-events-none" :style="{ background: '#B7E4C7' }" />

      <div class="relative z-10 max-w-xl mx-auto text-center">
        <h2 class="text-white text-3xl mb-4" :style="{ fontWeight: 800 }">Ready to Order?</h2>
        <p class="mb-8" :style="{ color: 'rgba(255,255,255,0.65)' }">
          You can also order directly from our website. Browse our full menu right now!
        </p>
        <router-link
          to="/menu"
          class="inline-flex items-center gap-2 px-8 py-4 rounded-full active:scale-95 transition-all shadow-xl text-base"
          :style="{ background: '#40916C', color: '#fff', fontWeight: 700 }"
        >
          Browse Menu <ChevronRight class="w-5 h-5" />
        </router-link>
      </div>
    </section>
  </main>
</template>
