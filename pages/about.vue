<script setup lang="ts">
import { onMounted, nextTick, computed } from "vue";
import { useTimeline } from "~/composables/useTimeline";
import ImageLayoutOne from "~/components/about/ImageLayoutOne.vue";
import ImageLayoutTwo from "~/components/about/ImageLayoutTwo.vue";
import ImageLayoutThree from "~/components/about/ImageLayoutThree.vue";

const { timeline } = useTimeline();

const items = computed(() => {
  return timeline.value.map((item) => ({
    ...item,
    title: item.title.toUpperCase(),
  }));
});

onMounted(async () => {
  await nextTick();
});
</script>

<template>
  <div
    class="w-full min-h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
  >
    <section
      class="h-full snap-start snap-always flex items-center justify-center"
    >
      <div class="flex flex-col w-full items-center justify-center">
        <div class="w-full md:px-12">
          <span>プロジェクト</span>
          <div class="flex gap-4">
            <USeparator />
            <span>Project</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col w-full items-center justify-center">
        <div class="flex flex-col px-12">hallo</div>
      </div>
    </section>

    <section
      class="h-full snap-start snap-always flex items-center justify-center w-full"
    >
      <div class="grid grid-cols-2 gap-4 w-full">
        <div class="flex justify-center items-center px-12 relative">
          <!-- Layout 1 -->
          <ImageLayoutOne
            class="opacity-0"
            v-gsap.whenVisible.to="{ opacity: 1, duration: 1 }"
          />

          <!-- Layout 2 -->
          <ImageLayoutTwo class="hidden" />
          <!-- Layout 3 -->
          <ImageLayoutThree class="hidden" />
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
