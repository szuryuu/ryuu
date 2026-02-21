<template>
  <UApp>
    <LoadingScreen
      :visible="isLoading"
      :closing="isClosing"
      :is-initial-load="isInitialLoad"
      @opened="onCurtainOpened"
      @close-done="onCloseDone"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LoadingScreen from "~/components/LoadingScreen.vue";

const isLoading = ref(true);
const isClosing = ref(false);
const isInitialLoad = ref(true);
const router = useRouter();

const curtainOpen = useState("curtainOpen", () => false);

let resolveNavigation: (() => void) | null = null;

// Handles the completion of the loading screen closing animation.
function onCloseDone() {
  if (resolveNavigation) {
    resolveNavigation();
    resolveNavigation = null;
  }
}

// Handles the event when the loading curtain is fully opened.
function onCurtainOpened() {
  isLoading.value = false;
  isInitialLoad.value = false;
  curtainOpen.value = true;
}

// Runs logic when the component is mounted.
onMounted(() => {});

// Runs before each route navigation to trigger loading screen.
router.beforeEach(async (to, from) => {
  if (to.path === from.path) return;

  curtainOpen.value = false;

  isLoading.value = true;
  isClosing.value = true;

  await new Promise<void>((resolve) => {
    resolveNavigation = resolve;
  });
});

// Runs after each route navigation to finish loading screen animation.
router.afterEach(() => {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      isClosing.value = false;
    });
  });
});
</script>
