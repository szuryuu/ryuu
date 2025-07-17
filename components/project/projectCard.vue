<script setup lang="ts">
import LinkButton from "~/components/linkButton.vue";
import { Github } from "lucide-vue-next";
</script>

<template>
  <UCard variant="subtle">
    <div class="flex gap-2">
      <div class="flex gap-6">
        <USeparator orientation="vertical" color="primary" type="solid" />
        <img
          src="https://picsum.photos/200/300"
          alt="Project Image"
          class="w-40 h-40"
        />
      </div>
      <div class="flex justify-between items-center [writing-mode:vertical-lr]">
        <span class="uppercase text-xs">team project</span>
        <span class="text-xs">2025</span>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between items-center">
        <div class="">simPKL</div>
        <div class="flex gap-1">
          <LinkButton to="#" aria-label="Open Live Demo">
            Live Demo
          </LinkButton>
          <LinkButton to="#" aria-label="Open GitHub">
            <Github class="w-4 h-4" />
          </LinkButton>
        </div>
      </div>
    </template>
  </UCard>
</template>
