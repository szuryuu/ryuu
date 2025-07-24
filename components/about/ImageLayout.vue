<script setup lang="ts">
import gsap from "gsap";
import { onMounted, nextTick, watch, inject, type Ref } from "vue";

const images = [
  {
    src: "https://picsum.photos/400/500?random=1",
    alt: "Profile Back",
    class: "w-64 h-80 rounded-2xl shadow-2xl",
  },
  {
    src: "https://picsum.photos/400/500?random=2",
    alt: "Profile Middle",
    class: "w-64 h-80 rounded-2xl shadow-2xl",
  },
  {
    src: "https://picsum.photos/400/500?random=3",
    alt: "Profile Front",
    class: "w-64 h-80 rounded-2xl shadow-2xl",
  },
];

const shouldAnimate = inject<Ref<boolean>>("shouldAnimate");

let inTimeline: gsap.core.Timeline;
let outTimeline: gsap.core.Timeline;

onMounted(async () => {
  await nextTick();

  // Set initial positions for 3D stack effect
  gsap.set("#image-0", {
    rotationY: -15,
    z: -100,
    x: -40,
    scale: 0.9,
    opacity: 0.7,
  });
  gsap.set("#image-1", {
    rotationY: 15,
    z: -50,
    x: 40,
    scale: 0.95,
    opacity: 0.8,
  });
  gsap.set("#image-2", {
    rotationY: 0,
    z: 0,
    x: 0,
    scale: 1,
    opacity: 1,
  });

  // In Animation Timeline
  inTimeline = gsap.timeline({ paused: true });

  // Reset to hidden state
  inTimeline.set([".card-container"], {
    perspective: "1000px",
    transformStyle: "preserve-3d",
  });

  inTimeline
    .from("#image-0", {
      autoAlpha: 0,
      rotationY: -45,
      z: -200,
      x: -80,
      scale: 0.7,
      duration: 1.2,
      ease: "back.out(1.7)",
    })
    .from(
      "#image-1",
      {
        autoAlpha: 0,
        rotationY: 45,
        z: -150,
        x: 80,
        scale: 0.7,
        duration: 1.2,
        ease: "back.out(1.7)",
      },
      "-=0.8",
    )
    .from(
      "#image-2",
      {
        autoAlpha: 0,
        rotationY: 0,
        z: -100,
        scale: 0.5,
        duration: 1.2,
        ease: "back.out(1.7)",
      },
      "-=0.8",
    )
    .to(
      [".card-container"],
      {
        rotationY: 5,
        duration: 2,
        ease: "power2.inOut",
        yoyo: true,
        repeat: -1,
      },
      "-=0.5",
    );

  // Out Animation Timeline
  outTimeline = gsap.timeline({ paused: true });
  outTimeline
    .to("#image-2", {
      autoAlpha: 0,
      rotationY: 180,
      z: 100,
      scale: 0.5,
      duration: 0.6,
      ease: "power2.in",
    })
    .to(
      "#image-1",
      {
        autoAlpha: 0,
        rotationY: -180,
        z: 150,
        x: -100,
        scale: 0.5,
        duration: 0.6,
        ease: "power2.in",
      },
      "-=0.4",
    )
    .to(
      "#image-0",
      {
        autoAlpha: 0,
        rotationY: 180,
        z: 200,
        x: 100,
        scale: 0.5,
        duration: 0.6,
        ease: "power2.in",
      },
      "-=0.4",
    );
});

watch(
  () => shouldAnimate?.value,
  (val) => {
    if (!inTimeline || !outTimeline) return;

    if (val) {
      // Reset to initial hidden state
      gsap.set("#image-0", {
        autoAlpha: 0,
        rotationY: -45,
        z: -200,
        x: -80,
        scale: 0.7,
      });
      gsap.set("#image-1", {
        autoAlpha: 0,
        rotationY: 45,
        z: -150,
        x: 80,
        scale: 0.7,
      });
      gsap.set("#image-2", {
        autoAlpha: 0,
        rotationY: 0,
        z: -100,
        scale: 0.5,
      });

      outTimeline.pause(0);
      inTimeline.restart();
    } else {
      inTimeline.pause(0);
      outTimeline.restart();
    }
  },
);
</script>

<template>
  <div
    class="card-container relative w-80 h-96 flex items-center justify-center"
    style="perspective: 1000px; transform-style: preserve-3d"
  >
    <!-- Ambient Lighting Effects -->
    <div
      class="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 rounded-2xl blur-xl"
    ></div>
    <div
      class="absolute inset-0 bg-gradient-to-bl from-pink-500/10 via-transparent to-blue-500/10 rounded-2xl blur-2xl"
    ></div>

    <!-- Card Stack -->
    <div class="absolute inset-0 flex items-center justify-center">
      <img
        v-for="(img, i) in images"
        :id="`image-${i}`"
        :key="i"
        :src="img.src"
        :alt="img.alt"
        :class="img.class"
        class="absolute object-cover border-4 border-white/20 backdrop-blur-sm hover:border-white/40 transition-all duration-300"
        :style="{
          filter: i === 2 ? 'none' : 'brightness(0.8) saturate(1.2)',
          boxShadow:
            i === 2
              ? '0 25px 50px rgba(0,0,0,0.5), 0 0 50px rgba(139,92,246,0.3)'
              : '0 15px 30px rgba(0,0,0,0.3)',
        }"
      />
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 pointer-events-none">
      <div
        v-for="i in 6"
        :key="i"
        class="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
        :style="{
          top: Math.random() * 100 + '%',
          left: Math.random() * 100 + '%',
          animationDelay: Math.random() * 2 + 's',
          animationDuration: 2 + Math.random() * 3 + 's',
        }"
      ></div>
    </div>

    <!-- Interactive Glow Ring -->
    <div
      class="absolute inset-0 rounded-2xl border border-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 pointer-events-none animate-pulse"
    ></div>
  </div>
</template>

<style scoped>
.card-container {
  transform-style: preserve-3d;
}

.card-container img {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* Floating animation for particles */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
</style>
