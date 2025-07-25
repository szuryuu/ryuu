<script setup lang="ts">
const imgArray = [
  "https://sponsors.vuejs.org/images/vueschool.avif",
  "https://sponsors.vuejs.org/images/vehikl.avif",
  "https://sponsors.vuejs.org/images/dronahq.avif",
];

const avatarArray = [
  "https://avatars.dicebear.com/api/avataaars/1.svg",
  "https://avatars.dicebear.com/api/avataaars/2.svg",
  "https://avatars.dicebear.com/api/avataaars/3.svg",
];
</script>

<template>
  <client-only>
    <div class="h-96">
      <div class="grid grid-rows-3">
        <div class="row-span-2 items-center flex">
          <Vue3Marquee :pause-on-hover="true">
            <div class="card" v-for="avatar in avatarArray" :key="avatar">
              <img :src="avatar" />
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </Vue3Marquee>
        </div>
        <div class="row-span-1">
          <Vue3Marquee :clone="true" :duration="7" :direction="'reverse'">
            <img v-for="img in imgArray" :key="img" :src="img" />
          </Vue3Marquee>
        </div>
      </div>
    </div>
  </client-only>
</template>
