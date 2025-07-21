<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { useTimeline } from "~/composables/useTimeline";

const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});
</script>

<template>
  <div
    class="w-full min-h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  >
    <section
      class="h-full snap-start snap-always flex items-center justify-center"
      v-gsap.timeline.pinned
    >
      <div
        class="flex flex-col w-full items-center justify-center"
        v-gsap.add.to="{ opacity: 0, y: -32 }"
      >
        <div class="w-full md:px-12">
          <span>プロジェクト</span>
          <div class="flex gap-4">
            <USeparator />
            <span>Project</span>
          </div>
        </div>
      </div>
      <div
        class="flex flex-col w-full items-center justify-center"
        v-gsap.add.fromTo="[
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0 },
        ]"
        v-gsap.add.to="{ opacity: 0, y: -32 }"
      >
        <div class="flex flex-col px-12">hallo</div>
      </div>

      <div
        class="flex flex-col w-full items-center justify-center"
        v-gsap.add.withPrevious.fromTo="[
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0 },
        ]"
        v-gsap.add.to="{ opacity: 0, y: -32 }"
      >
        <div class="flex flex-col px-12">hallo</div>
      </div>
    </section>

    <section
      class="h-full snap-start snap-always flex items-center justify-center w-full"
      v-gsap.timeline.pinned
    >
      <div class="grid grid-cols-2 gap-4 w-full">
        <div class="flex justify-center items-center px-12 relative">
          <!-- Layout 1 (Aktif) -->
          <div class="absolute w-52 h-60 mx-auto hidden" id="layout1">
            <img
              src="https://picsum.photos/200"
              alt="Card Back"
              class="w-48 h-52 rounded-md absolute -top-5 left-28 z-10 border"
            />
            <img
              src="https://picsum.photos/200"
              alt="Card Middle"
              class="w-48 h-52 rounded-md absolute -top-8 -left-28 z-20 border border-red-500"
            />
            <img
              src="https://picsum.photos/200"
              alt="Card Front"
              class="w-48 h-52 rounded-md absolute top-0 left-0 z-30 border border-yellow-500"
            />
          </div>

          <!-- Layout 2 (Hidden awal) -->
          <div class="absolute w-52 h-60 mx-auto" id="layout2">
            <img
              src="https://picsum.photos/200"
              alt="Card Left"
              class="w-48 h-52 rounded-md absolute top-2 -left-20 z-20 border border-green-500"
            />
            <img
              src="https://picsum.photos/200"
              alt="Card Center"
              class="w-48 h-52 rounded-md absolute top-0 left-0 z-30 border border-blue-500"
            />
            <img
              src="https://picsum.photos/200"
              alt="Card Right"
              class="w-48 h-52 rounded-md absolute top-4 left-24 z-10 border border-pink-500"
            />
          </div>

          <!-- Layout 3 (Hidden awal) -->
          <div class="absolute w-52 h-60 mx-auto hidden" id="layout3">
            <img
              src="https://picsum.photos/200"
              alt="Bottom Card"
              class="w-48 h-52 rounded-md absolute top-16 left-0 z-10 border border-purple-500"
            />
            <img
              src="https://picsum.photos/200"
              alt="Middle Card"
              class="w-48 h-52 rounded-md absolute top-8 left-4 z-20 border border-orange-500"
            />
            <img
              src="https://picsum.photos/200"
              alt="Top Card"
              class="w-48 h-52 rounded-md absolute top-0 left-8 z-30 border border-yellow-500"
            />
          </div>
        </div>

        <div class="flex justify-center items-center">
          <UTimeline
            :items="items"
            :ui="{
              item: 'even:flex-row-reverse even:-translate-x-[calc(100%-2rem)] even:text-right',
            }"
            class="translate-x-[calc(50%-1rem)]"
          />
        </div>
      </div>
    </section>
  </div>
</template>
