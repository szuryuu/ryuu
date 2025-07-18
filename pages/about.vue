<script setup lang="ts">
import { onMounted, nextTick } from "vue";
import { gsap, ScrollTrigger, ScrollToPlugin } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

onMounted(async () => {
  await nextTick();

  // Kill semua ScrollTrigger yang ada
  ScrollTrigger.killAll();

  const container = document.querySelector("#panel-container");
  const panels = gsap.utils.toArray(".panel");

  if (!container || panels.length === 0) return;

  // Set initial state
  gsap.set(panels, { xPercent: 0 });

  // Buat animasi horizontal scroll
  const horizontalScroll = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 2, // Lebih lambat untuk testing
      start: "top top",
      end: () => "+=" + (container.offsetWidth - window.innerWidth),
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Debug output
        if (self.progress > 0.9) {
          console.log("Mendekati akhir, progress:", self.progress);
        }
      },
    },
  });

  // Anchor navigation
  document.querySelectorAll(".anchor").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const href = e.target.getAttribute("href");
      if (!href) return;

      const targetElem = document.querySelector(href);
      if (!targetElem) return;

      let scrollToY = targetElem.offsetTop;

      // Jika target adalah panel, hitung posisi scroll yang tepat
      if (targetElem.classList.contains("panel")) {
        const panelIndex = panels.indexOf(targetElem);
        const totalScroll =
          horizontalScroll.scrollTrigger.end -
          horizontalScroll.scrollTrigger.start;
        const progress = panelIndex / (panels.length - 1);
        scrollToY =
          horizontalScroll.scrollTrigger.start + progress * totalScroll;
      }

      gsap.to(window, {
        scrollTo: scrollToY,
        duration: 1,
        ease: "power2.inOut",
      });
    });
  });

  // Refresh setelah semua setup
  ScrollTrigger.refresh();
});
</script>

<template>
  <div class="w-full">
    <section class="anchor min-h-screen flex justify-center items-center">
      anchor
    </section>
    <section id="panels">
      <div id="panel-container" class="flex h-screen overflow-hidden">
        <div
          id="panel-1"
          class="flex justify-center items-center h-full select-none panel min-w-full"
        >
          <div class="w-full md:px-12">
            <span>について</span>
            <div class="flex gap-4">
              <USeparator />
              <span>About</span>
            </div>
          </div>
        </div>
        <div
          id="panel-2"
          class="flex justify-center items-center h-full select-none panel min-w-full"
        >
          <div class="w-full md:px-12">
            <span>about</span>
            <div class="flex gap-4">
              <USeparator />
              <span>About</span>
            </div>
          </div>
        </div>
        <div
          id="panel-3"
          class="flex justify-center items-center h-full select-none panel min-w-full"
        >
          <div class="w-full md:px-12">
            <span>services</span>
            <div class="flex gap-4">
              <USeparator />
              <span>Services</span>
            </div>
          </div>
        </div>
        <div
          id="panel-4"
          class="flex justify-center items-center h-full select-none panel min-w-full"
        >
          <div class="w-full md:px-12">
            <span>about</span>
            <div class="flex gap-4">
              <USeparator />
              <span>About</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
