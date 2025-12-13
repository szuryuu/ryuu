---
title: "E Press"
slug: "e-press"
type: "Team Project"
year: "2024"
description: "Multi-vendor marketplace handling 1000+ concurrent users with real-time inventory sync and payment gateway integration"
image: "/projects/tokopedia-hero.jpg"
tech: ["Vue 3", "Nuxt", "Laravel", "Redis", "PostgreSQL", "Midtrans", "WebSocket"]
github: "https://github.com/yourusername/tokopedia-clone"
live: "https://demo-tokopedia.vercel.app"
featured: true
order: 1
status: "Completed"
duration: "3 months"
team_size: 4
role: "Lead Full-Stack Developer"
---

## 🎯 The Problem

Local SMEs in Yogyakarta struggled to compete with established marketplaces due to high commission fees (15-20%) and complex onboarding processes. They needed an affordable alternative that could handle their scale without enterprise-level costs.

## 💡 My Solution

Built a custom multi-vendor marketplace inspired by Tokopedia's UX, optimized for Indonesian SMEs with:

- **Zero commission** for first 100 transactions per vendor
- **5-minute vendor onboarding** (vs industry average 2-3 days)
- **Local payment methods** (Bank Transfer, QRIS, E-Wallet)
- **Real-time inventory sync** across multiple vendor stores

## 🛠️ Technical Deep Dive

### Architecture Decisions

**Why Nuxt over plain Vue?**
- SSR for SEO (organic traffic = 60% of user acquisition)
- Static generation for product pages (load time: 0.8s vs 2.3s SPA)
- Built-in routing reduced boilerplate by ~40%

**Why Redis for caching?**
- Product catalog caching reduced DB queries by **73%**
- Session management for 1000+ concurrent users
- Real-time inventory updates via Pub/Sub pattern

**Why PostgreSQL over MySQL?**
- JSONB columns for flexible product attributes (electronics vs fashion have different specs)
- Full-text search outperformed MySQL by **2.1x** in our benchmarks
- Better handling of concurrent transactions (critical for inventory management)

### Key Features I Built

#### 1. Real-Time Inventory Management
```javascript
