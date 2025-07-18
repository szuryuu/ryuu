<script setup lang="ts">
import { onMounted } from "vue";
import { gsap, ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  let panelsSection = document.querySelector(".panel"),
    panelsContainer = document.querySelector(".panel-container"),
    tween;
  document.querySelectorAll(".anchor").forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      let targetElem = document.querySelector(e.target.getAttribute("href")),
        y = targetElem;
      if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
        let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
          totalMovement = (panels.length - 1) * targetElem.offsetWidth;
        y = Math.round(
          tween.scrollTrigger.start +
            (targetElem.offsetLeft / totalMovement) * totalScroll,
        );
      }
      gsap.to(window, {
        scrollTo: {
          y: y,
          autoKill: false,
        },
        duration: 1,
      });
    });
  });

  /* Panels */
  const panels = gsap.utils.toArray(".panel-container .panel");
  tween = gsap.to(panels, {
    xPercent: -100 * (panels.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: ".panel-container",
      pin: true,
      start: "top top",
      scrub: 0.5,
      snap: {
        snapTo: (value) => {
          const panelIndex = Math.round(value * (panels.length - 1));
          return panelIndex / (panels.length - 1);
        },
      },
      end: () => "+=" + (panelsContainer.offsetWidth - innerWidth),
    },
  });
});
</script>

<template>
  <div class="w-full">
    <div class="anchor min-h-screen flex justify-center items-center">
      anchor
    </div>
    <div class="panel-container flex h-screen overflow-hidden">
      <div
        id="panel1"
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
        id="panel2"
        class="flex justify-center items-center h-full select-none panel min-w-full"
      >
        <div class="w-full md:px-12">
          <span>about</span>
          <div class="flex gap-4">
            <USeparator />
            <span>about</span>
          </div>
        </div>
      </div>
      <div
        id="panel3"
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
        id="panel4"
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
  </div>
</template>
