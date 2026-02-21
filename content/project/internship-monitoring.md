---
title: "Internship Monitoring"
type: "Exam Project"
year: "2025"
description: "A centralized platform for managing vocational school internships, featuring a robust Admin Dashboard built with Filament PHP and RESTful APIs for student mobile apps."
image: "/images/projects/laravel.png"
tech: ["Laravel 11", "Filament PHP", "MySQL", "Vue.js"]
github: "https://github.com/szuryuu/internship-monitoring-laravel"
# live: ""
featured: false
order: 9
status: "Completed"
duration: "2 months"
# team_size: 1
# role: "Backend Engineer"
---

## The Problem

Vocational schools (SMK) and universities face logistical nightmares when managing hundreds of students scattered across different companies for internships (PKL). Tracking attendance, grading, and administrative approval manually via paper logbooks is inefficient and prone to data loss.

## My Solution

I developed the **Internship Monitoring System**, a web-based solution that digitizes the entire internship lifecycle.

-   **Rapid Admin Development:** Leveraged **Filament PHP** to build a feature-rich admin panel in record time, allowing teachers to manage Students, Industries, and Internship placements effortlessly.
-   **API-Ready Architecture:** Unlike a traditional monolith, I exposed a comprehensive set of RESTful APIs (`app/Http/Controllers/Api`) to allow future integration with student mobile applications for logbook entry.
-   **Automated State Management:** Implemented database triggers to handle complex status changes automatically, ensuring data consistency without heavy application-level logic.
-   **Role-Based Access Control:** Utilized **Filament Shield** to manage granular permissions between Admins, Teachers, and Staff.

## Technical Deep Dive

### Architecture Decisions

**Why Filament PHP?**
-   **TALL Stack Efficiency:** Filament is built on the TALL stack (Tailwind, Alpine, Laravel, Livewire). This allowed me to create reactive, modern UI components for the dashboard (like the *Internship Stats Overview* widget) without writing separate frontend code.
-   **Resource Management:** Filament's "Resource" pattern (`app/Filament/Admin/Resources`) drastically reduced boilerplate for CRUD operations on models like `BusinessField`, `Industry`, and `Student`.

**Database-Level Logic (Triggers)**
-   To ensure data integrity regardless of whether data is modified via the API or Admin Panel, I moved critical status logic to the database layer.
-   I wrote a custom migration `2025_05_20_143053_internship_triggers` that installs SQL triggers. These triggers automatically update a student's status (e.g., from 'Active' to 'Interning') whenever a new internship record is created or completed.

### Key Features I Built

#### 1. Hybrid Controller Architecture
The system serves two masters: the web admin panel and mobile clients. I structured the backend to handle both gracefully.

```bash
# php
# app/Http/Controllers/Api/InternshipController.php
public function index(Request $request)
{
    # JSON response for Mobile Apps
    return InternshipResource::collection(Internship::all());
}

# app/Filament/Admin/Resources/InternshipResource.php
public static function form(Form $form): Form
{
    # Reactive Form UI for Admin Panel
    return $form->schema([
        Select::make('student_id')->relationship('student', 'name'),
        # ...
    ]);
}
```

#### 2. Complex Relationship Management
The system handles a web of relationships: Students belong to Departments, apply to Industries, and are supervised by Teachers. I modeled this using Laravel's Eloquent relationships and enforced constraints at the schema level to prevent orphaned records.

```bash
# php
# app/Models/Internship.php
public function industry()
{
    return $this->belongsTo(Industry::class);
}

public function teacher()
{
    return $this->belongsTo(Teacher::class);
}
```
