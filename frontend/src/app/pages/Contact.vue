<script setup lang="ts">
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-vue-next'
</script>

<template>
  <main class="min-h-screen bg-gray-50 pt-20 lg:pt-24 pb-16">
    <!-- Hero -->
    <div
      class="py-14 px-4 relative overflow-hidden"
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
      <div class="absolute top-8 right-1/4 w-3 h-3 rounded-full opacity-30 pointer-events-none" :style="{ background: '#74C69D' }" />
      <div class="absolute bottom-10 left-1/3 w-4 h-4 rounded-full opacity-20 pointer-events-none" :style="{ background: '#B7E4C7' }" />
      <div class="relative z-10 max-w-7xl mx-auto text-center">
        <h1 class="text-white text-3xl sm:text-4xl mb-3" :style="{ fontWeight: 800 }">Contact Us</h1>
        <p class="text-base max-w-md mx-auto" :style="{ color: 'rgba(255,255,255,0.65)' }">
          We'd love to hear from you. Get in touch with our team.
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid lg:grid-cols-2 gap-10">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div>
            <h2 class="text-gray-900 text-xl mb-4" :style="{ fontWeight: 700 }">Get In Touch</h2>
            <p class="text-gray-500 text-sm leading-relaxed">
              Have a question, feedback, or just want to say hello? We're here to help. Reach out to us through any of the channels below or fill out the contact form.
            </p>
          </div>

          <div class="space-y-4">
            <div class="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">Address</p>
                <p class="text-gray-500 text-sm">123 Flavor Street, Food City, FC 10001</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">Phone</p>
                <p class="text-gray-500 text-sm">+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">Email</p>
                <p class="text-gray-500 text-sm">hello@mealio.com</p>
              </div>
            </div>
            <div class="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100">
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock class="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p class="text-gray-900 text-sm" :style="{ fontWeight: 700 }">Hours</p>
                <p class="text-gray-500 text-sm">Mon - Sun: 10:00 AM - 11:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 class="text-gray-900 text-xl mb-6" :style="{ fontWeight: 700 }">Send a Message</h2>
          <form class="space-y-5" @submit.prevent>
            <div class="grid sm:grid-cols-2 gap-5">
              <div>
                <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Name</label>
                <input type="text" placeholder="Your name" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 placeholder-gray-400" />
              </div>
              <div>
                <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Email</label>
                <input type="email" placeholder="you@example.com" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 placeholder-gray-400" />
              </div>
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Subject</label>
              <input type="text" placeholder="How can we help?" class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 placeholder-gray-400" />
            </div>
            <div>
              <label class="block text-xs text-gray-600 mb-1.5" :style="{ fontWeight: 600 }">Message</label>
              <textarea rows="5" placeholder="Write your message..." class="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 placeholder-gray-400 resize-none"></textarea>
            </div>
            <button
              type="submit"
              class="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 active:scale-95 transition-all shadow-sm text-sm"
              :style="{ fontWeight: 700 }"
            >
              <Send class="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>
