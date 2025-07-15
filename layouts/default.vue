<template>
  <div class="container mx-auto">
    <nav class="flex justify-between p-4">
      <h1 class="text-4xl font-display">Szuryuu</h1>
      <UButton
        color="neutral"
        variant="outline"
        class="rounded-3xl font-display text-xs px-4 uppercase border-1 hover:bg-white hover:text-white duration-300 transform transform-fill"
        >Menu 🞄</UButton
      >
    </nav>
    <slot />
  </div>
</template>
