---
title: "Notori - Notes App"
slug: "notori"
type: "Solo Project"
year: "2025"
description: "A lightweight, modular note-taking application engineered with Native Web Components and Webpack to demonstrate framework-agnostic component architecture."
image: "/images/projects/javascript.png"
tech: ["JavaScript", "Webpack", "Anime.js"]
github: "https://github.com/shfwnz/notori"
live: "https://notori.vercel.app/"
featured: false
order: 6
status: "Completed"
duration: "2 months"
# team_size: 4
# role: "Lead Full-Stack Developer"
---

## The Problem

Building complex user interfaces with "Vanilla" JavaScript often results in unmaintainable "spaghetti code" and global CSS conflicts. Developers need a way to encapsulate logic, templates, and styles strictly without the overhead of heavy frameworks like React or Vue for smaller applications.

## My Solution

I developed **Notori**, a Single Page Application (SPA) that leverages the browser's native **Custom Elements API** and **Shadow DOM** to create truly encapsulated UI components.

-   **Component-Based Architecture:** Broken down into reusable custom elements like `<notes-list>` and `<notes-item>`, ensuring style isolation and reusability.
-   **Modern Tooling Pipeline:** Configured a custom **Webpack** environment from scratch to handle asset bundling, CSS extraction, and ES6+ transpilation via Babel.
-   **Interactive UX:** Integrated **SweetAlert2** for modal dialogs and **Anime.js** for fluid micro-interactions, enhancing the native feel of the app.
-   **Robust Data Layer:** Implemented a dedicated API service layer to handle asynchronous CRUD operations with the backend.

## Technical Deep Dive

### Architecture Decisions

**Why Web Components over React?**
-   **Native Performance:** By using `HTMLElement` and `attachShadow({ mode: "open" })`, the app runs directly on browser standards with zero runtime overhead from a virtual DOM.
-   **Scoped Styling:** Each component, such as the note list, injects its own `<style>` tag into its Shadow Root. This guarantees that CSS written for the list grid never leaks out to affect other parts of the application.

**Why Custom Webpack Config?**
-   **Control:** Instead of using tools like CRA or Vite, I manually configured Webpack to understand the compilation process deeply—managing loaders for CSS, images, and Javascript modules explicitly.

### Key Features I Built

#### 1. Encapsulated Grid Layout (Shadow DOM)
I implemented a responsive grid system that adapts its column count based on attributes, isolated entirely within the Shadow DOM.

```bash
# javacript
# src/script/components/notes-list.js
class NotesList extends HTMLElement {
  constructor() {
    super();
    # Create a shadow root for style isolation
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  render() {
    # Dynamic grid template based on 'column' property
    this._style.textContent = `
      .list {
        display: grid;
        grid-template-columns: ${"1fr ".repeat(this._column).trim()};
        gap: ${this._gutter}px;
      }
    `;
    # ...
  }
}
customElements.define("notes-list", NotesList);
```

#### 2. Service Layer Pattern
To keep the UI components clean, I separated all network logic into a dedicated service module. This module handles error parsing and JSON serialization for the external Notes API.

```bash
# javascript
# src/script/data/notes-data-api.js
const addNotes = async (note) => {
  try {
    const response = await fetch(`${baseUrl}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    # Centralized error handling
    if (!response.ok) throw new Error(responseJson.message);
    return responseJson.data;
  } catch (error) {
    console.error("Failed to add data:", error);
  }
};
```
