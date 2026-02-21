---
title: "Building a Dokku Plugin from Scratch"
slug: "building-dokku-plugin"
description: "How I built a custom Nginx path-routing plugin for Dokku during my internship — the architecture decisions, the gotchas, and what I learned."
date: "2025-07-14"
tags: ["DevOps", "Go", "Nginx"]
cover: "/images/projects/dokku.png"
featured: true
order: 1
---

## Why This Existed

Standard Dokku forces subdomain routing. Every app gets `app.domain.com`. That's fine until you want `domain.com/app` — then you're fighting the entire proxy layer.

## The Architecture

The plugin hooks into three Dokku lifecycle events...
