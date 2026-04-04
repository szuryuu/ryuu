---
title: "LaporCepat: AI-Powered Disaster Reporting"
type: "Solo Project"
year: "2025"
description: "A real-time emergency reporting system that replaces manual call centers with an AI pipeline (Groq Whisper STT + Gemini 2.5 Flash) for instant triage and live dispatch."
image: "/images/projects/nuxt.png"
tech:
  [
    "Nuxt 4",
    "Groq Whisper AI",
    "Google Gemini 2.5 Flash",
    "Firebase",
    "SSE",
    "Leaflet",
  ]
github: "https://github.com/szuryuu/lapor-cepat-bpbd"
live: "https://lapor-cepat.vercel.app"
featured: true
order: 3
status: "Completed"
duration: "3 weeks"
---

## The Problem

Indonesia is highly disaster-prone, yet existing emergency reporting systems heavily rely on manual phone calls to BPBD command centers. During mass casualty events, dispatchers are overwhelmed, communication is vague, and manual data entry is slow. When a citizen is panicked, forcing them to navigate a clunky web form or wait in a call queue costs critical response time and, ultimately, lives.

## My Solution

I engineered **LaporCepat**, a complete overhaul of the emergency reporting pipeline that uses artificial intelligence to completely eliminate form-filling for victims while providing perfect situational awareness for dispatchers.

- **Voice-First Triage Pipeline:** Citizens simply tap a button and speak. The audio is instantly transcribed using Groq Whisper Large V3.
- **Multimodal Extraction:** Google Gemini 2.5 Flash analyzes the text transcript alongside uploaded field photos to automatically extract disaster type, victim estimates, severity level (CRITICAL to LOW), and generate survival instructions.
- **Frictionless Geolocation:** Automatically captures exact GPS coordinates via browser APIs with an IP-based fallback, preventing location miscommunication.
- **Real-Time BPBD Dashboard:** An operations dashboard for dispatchers powered by Server-Sent Events (SSE) and Firebase `onSnapshot` that streams live reports onto a spatial map without requiring page reloads.

## Technical Deep Dive

### Architecture Decisions

**Why Voice-First Reporting (Groq Whisper)?**
Under severe psychological stress, fine motor skills degrade, making typing difficult. By leveraging Groq's insanely fast inference engine for Whisper Large V3, I allowed victims to simply describe their emergency verbally, converting chaotic audio into perfectly structured text in milliseconds.

**Why Upgrade to Nuxt 4?**
The project utilizes the bleeding-edge Nuxt 4 framework to leverage its improved module resolution and optimized Nitro server engine. This was crucial for handling the custom Server-Sent Events (SSE) endpoints efficiently on Vercel's serverless environment.

### Key Features I Built

#### 1. Zero-Latency Incident Streaming (SSE)

Instead of forcing the dispatcher dashboard to constantly poll the database or implementing heavy WebSockets, I built a lightweight Server-Sent Events (SSE) stream. The Nitro backend listens to Firebase Firestore mutations and pushes raw JSON chunks directly to the frontend's reactive state.

```typescript
// Real-time unidirectional feed using SSE over HTTP/2
export default defineEventHandler((event) => {
  setHeader(event, "Content-Type", "text/event-stream");
  setHeader(event, "Cache-Control", "no-cache");
  setHeader(event, "Connection", "keep-alive");

  const unsubscribe = db
    .collection("reports")
    .where("status", "==", "PENDING")
    .onSnapshot((snapshot) => {
      // Push live incident updates directly to the dispatcher's map
      event.node.res.write(`data: ${JSON.stringify(reports)}\n\n`);
    });
});
```

#### 2. Robust AI Fallback Mechanism

Emergency systems cannot afford downtime. I designed a failover mechanism in the AI pipeline. If the primary Google Gemini 2.5 Flash model hits a rate limit or exhausts its quota, the system autonomously degrades to Gemini 2.0 Flash to ensure triage continuity without interrupting the citizen's submission process.
