<script setup lang="ts">
import { ref } from "vue";
import LoadingScreen from "~/components/LoadingScreen.vue";
import Circle from "~/components/Circle.vue";

const isLoading = ref(false);
const isClosing = ref(false);
const isInitialLoad = ref(false);
const router = useRouter();
const nuxtApp = useNuxtApp();

const curtainOpen = useState("curtainOpen", () => true);
const hasNavigated = useState("hasNavigated", () => false);

let resolveNavigation: (() => void) | null = null;

function onCloseDone() {
  if (resolveNavigation) {
    resolveNavigation();
    resolveNavigation = null;
  }
}

function onCurtainOpened() {
  isLoading.value = false;
  curtainOpen.value = true;
}

router.beforeEach(async (to, from) => {
  if (to.path === from.path) return;

  hasNavigated.value = true;
  curtainOpen.value = false;
  isLoading.value = true;
  isClosing.value = true;

  await new Promise<void>((resolve) => {
    resolveNavigation = resolve;
  });
});

nuxtApp.hook("page:finish", () => {
  setTimeout(() => {
    isClosing.value = false;
  }, 200);
});
</script>

<template>
  <UApp>
    <LoadingScreen
      :visible="isLoading"
      :closing="isClosing"
      :is-initial-load="isInitialLoad"
      @opened="onCurtainOpened"
      @close-done="onCloseDone"
    />

    <Circle class="fixed pointer-events-none -z-10" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
