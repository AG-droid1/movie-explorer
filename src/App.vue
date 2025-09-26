<template>
  <div class="bg-gray-800 min-h-screen text-white">
    <AppHeader/>
    <router-view />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue';
</script>