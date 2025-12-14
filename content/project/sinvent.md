---
title: "Sinvent - Inventory System"
slug: "sinvent"
type: "Solo Project"
year: "2025"
description: "A modern, decoupled inventory management system featuring secure JWT authentication, role-based access control, and interactive data visualization for real-time stock tracking."
image: "/images/projects/laravel.png"
tech: ["Laravel 12", "Vue 3", "MySQL", "Tailwind CSS", "Shadcn"]
github: "https://github.com/szuryuu/sinvent"
# live: ""
featured: true
order: 5
status: "Completed"
duration: "5 days"
# team_size: 4
# role: "Lead Full-Stack Developer"
---

## The Problem

Small to medium enterprises often struggle with disjointed inventory tracking methods—relying on spreadsheets that are prone to human error and lack real-time synchronization. They need a secure, scalable solution to manage products, monitor stock levels, and handle staff access without the complexity of enterprise ERP software.

## My Solution

I built **Sinvent**, a robust Full-Stack application designed to bridge the gap between usability and complex data management.

-   **Decoupled Architecture:** Built with a **Laravel 12** REST API backend and a **Vue 3** Single Page Application (SPA) frontend, allowing for independent scaling and maintenance.
-   **Secure Authentication:** Implemented stateless authentication using **JWT (JSON Web Tokens)** via `tymon/jwt-auth`, ensuring secure and scalable session management across devices.
-   **Modern UI/UX:** Crafted a responsive interface using **Tailwind CSS v4** and **Shadcn Vue** components, prioritizing accessibility and ease of use.
-   **Data Visualization:** Integrated **Chart.js** to transform raw inventory data into actionable visual insights for administrators.

## Technical Deep Dive

### Architecture Decisions

**Why Laravel 12 over Node.js?**
-   **Rapid API Development:** Laravel's Eloquent ORM and API Resource classes allowed me to quickly scaffold complex relationships between `Products`, `Inventories`, and `Members`.
-   **Stability:** Leveraging Laravel 12's strict typing and built-in security features (like Sanctum/JWT integration) reduced the boilerplate needed for secure endpoints.

**Why Vue 3 & Tailwind v4?**
-   **Composition API:** I utilized Vue 3's Composition API to create reusable logic hooks for data fetching and state management, keeping components like `InventoryView.vue` clean.
-   **Performance:** Tailwind v4 brings a unified toolchain with faster compilation times, essential for maintaining a swift developer feedback loop.

### Key Features I Built

#### 1. Secure API Routes & Resource Mapping
I designed the backend to expose a clean, RESTful API. The routes are protected by a custom `auth:api` middleware group, ensuring that sensitive operations like inventory adjustments are restricted to authenticated users only.

```bash
# php
# be/routes/api.php
Route::middleware("auth:api")->group(function () {
    Route::apiResource("/products", ProductController::class);
    Route::apiResource("/members", MemberController::class);
    Route::apiResource("/inventories", InventoryController::class);
    
    # Custom endpoints for aggregated data
    Route::get("/products/all", [ProductController::class, "all"]);
});
```

#### 2. Reusable Component Library
Instead of hardcoding UI elements, I built a library of atomic components (e.g., BaseTable, BaseCard, BaseAdd) in the frontend. This promotes consistency and drastically reduces code duplication across different views like MemberView and ProductView.

```bash
# javascript
# Example structure from fe/src/components
import BaseTable from '@/components/BaseTable.vue'
import BaseCard from '@/components/BaseCard.vue'

# Used dynamically across views to render data grids
<BaseTable :data="inventoryData" :columns="tableColumns" />
```
