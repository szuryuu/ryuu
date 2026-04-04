---
title: "BodyLog: Serverless Fitness Tracker"
type: "Solo Project"
year: "2026"
description: "A brutalist, serverless progressive overload tracker built with Nuxt 4, utilizing Google Sheets API as a zero-cost headless database for 100% data ownership."
image: "/images/projects/nuxt.png"
tech: ["Nuxt 4", "Vue 3", "Tailwind CSS v4", "Google Sheets API", "Serverless"]
github: "https://github.com/szuryuu/bodylog"
featured: false
order: 5
status: "Completed"
duration: "1 week"
---

## The Problem

The fitness app market is heavily saturated, yet fundamentally flawed. Most mainstream workout trackers lock users into expensive monthly subscriptions, hide their own workout data behind proprietary walled gardens, and feature bloated, overly complex interfaces that slow down logging mid-workout. Users need a system focused entirely on progressive overload, speed, and absolute data ownership.

## My Solution

I engineered **BodyLog**, a high-contrast, brutalist web application that completely bypasses traditional databases in favor of a zero-cost, fully sovereign data architecture.

- **Zero-DB Architecture:** Integrated the Google Sheets v4 API via Google Cloud Service Accounts. Every set, rep, and weigh-in is instantly written to a private Google Sheet owned by the user, ensuring data is never trapped in a proprietary ecosystem.
- **Dynamic Program Modes:** Engineered a unified interface that seamlessly switches between Gym (barbell/machine focus) and Calisthenics (bodyweight progression) tracking states.
- **AI Coach Integration:** Implemented a data-export pipeline that compiles weekly workout telemetry into a highly structured prompt, allowing users to leverage LLMs (like Gemini) for personalized progressive overload analysis and nutrition coaching.
- **Automated Sheet Formatting:** Wrote low-level API batch updates to automatically style, color-code, and format the raw Google Sheet whenever new weekly modules are generated.

## Technical Deep Dive

### Architecture Decisions

**Why Google Sheets as a Database?**
For a personal tracking application, deploying a managed PostgreSQL instance is architectural overkill and incurs unnecessary cloud costs. Google Sheets natively supports tabular data (which perfectly matches set/rep logs), provides a free visual GUI for manual edits, and costs exactly $0 to run. By communicating securely via server-side Nitro API routes, the Google Service Account credentials remain completely hidden from the client.

**Why Nuxt 4 & Serverless?**
To achieve an instantaneous, native-app feel on mobile browsers, the application requires heavy hydration and optimized chunking. Nuxt 4 paired with TailwindCSS v4 provides a blazing-fast frontend, while its integrated Nitro engine allows the backend API routes (which execute the Google Sheets payload) to be deployed seamlessly to Vercel as highly efficient Serverless Functions.

### Key Features I Built

#### 1. Automated Sheet Orchestration

Writing raw strings to a spreadsheet is trivial, but keeping the sheet highly readable for the user is complex. I built a backend utility that intercepts the save event and sends a batch of `userEnteredFormat` and `addBanding` requests to the Google Sheets API. This automatically resizes columns, adds borders, and applies alternating row colors dynamically without the user ever opening the sheet application.

```typescript
// server/utils/sheets.ts - Automating spreadsheet UI via API
requests.push({
  addBanding: {
    bandedRange: {
      range: {
        sheetId,
        startRowIndex: 0,
        endRowIndex: totalRows,
        startColumnIndex: 0,
        endColumnIndex: 10,
      },
      rowProperties: {
        headerColor: { red: 0.13, green: 0.59, blue: 0.6 },
        firstBandColor: { red: 1, green: 1, blue: 1 },
        secondBandColor: { red: 0.95, green: 0.98, blue: 0.98 },
      },
    },
  },
});
await sheets.spreadsheets.batchUpdate({
  spreadsheetId,
  requestBody: { requests },
});
```

#### 2. Cross-Program Mode Switching

To handle different fitness regimens, I utilized Vue 3 Composables to manage global state dynamically. The UI and the underlying data schema adapt instantly depending on whether the user is tracking heavy barbell lifts or bodyweight static holds.

```typescript
// app/composables/useMode.ts - Global state management for workout modalities
export const useMode = () => {
  const currentMode = useState<"gym" | "calist" | null>(
    "workout_mode",
    () => null,
  );

  const setMode = (mode: "gym" | "calist") => {
    currentMode.value = mode;
    localStorage.setItem("workout_mode", mode);
  };

  return {
    currentMode,
    isGym: computed(() => currentMode.value === "gym"),
    isCalist: computed(() => currentMode.value === "calist"),
    setMode,
  };
};
```
