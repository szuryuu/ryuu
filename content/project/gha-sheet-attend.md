---
title: "GHA Sheet Attendance"
slug: "gha-sheet-attend"
type: "Solo Project"
year: "2025"
description: "A serverless attendance logging system that leverages GitHub Actions to automate daily reporting into Google Sheets with programmatic formatting and secure credential handling."
image: "/images/projects/github-actions.png"
tech: ["Go", "GitHub Actions", "Google Sheets API"]
github: "https://github.com/szuryuu/gha-sheet-attend"
# live: ""
featured: false
order: 3
status: "Completed"
duration: "2 weeks"
# team_size: 4
# role: "Lead Full-Stack Developer"
---

## The Problem

Internships and remote work often require daily attendance logging or "logbooks." Doing this manually in a spreadsheet is repetitive, and maintaining consistent formatting (borders, alignment) across hundreds of rows becomes tedious. Forgetting to log a day can lead to administrative issues at the end of the month.

## My Solution

I developed **GHA Sheet Attend**, a "set-and-forget" automation tool that turns a GitHub Actions workflow into a structured data entry interface.

-   **Serverless Data Entry:** Users can log attendance via a simple form in the GitHub Actions tab (or let it run on autopilot via CRON).
-   **Intelligent Formatting:** The script doesn't just dump text; it acts as a layout engine, automatically drawing borders and formatting cells for each new entry using the Google Sheets BatchUpdate API.
-   **Smart Defaults:** Automatically detects weekends or "Libur" (Holiday) statuses to clear start/end times, preventing invalid data entry.
-   **Secure Integration:** Uses Google Service Account authentication stored in GitHub Secrets, ensuring no credentials are ever exposed in the client-side code.

## Technical Deep Dive

### Architecture Decisions

**Why Go for a Scripting Task?**
-   **Strict Typing for API Payloads:** The Google Sheets API has nested, complex JSON structures for formatting requests (like `UpdateBordersRequest`). Go's struct-based typing makes constructing these payloads significantly less error-prone than untyped languages like JavaScript/Python.
-   **Execution Speed:** The compiled binary runs instantly on the CI runner, keeping billable action minutes to a minimum (usually under 30 seconds).

**Handling Timezones in CI/CD**
-   GitHub Actions runners default to UTC. To ensure the "Today" date in the spreadsheet matches the user's local context (Indonesia), I implemented explicit timezone loading:
    ```bash
    # go
    loc, _ := time.LoadLocation("Asia/Jakarta")
    today := time.Now().In(loc)
    ```

### Key Features I Built

#### 1. Programmatic Layout Engine
Instead of relying on the spreadsheet's conditional formatting (which can break), I engineered the bot to "draw" its own table borders after every write operation. It calculates the specific grid range of the newly added row and sends a batch update command.

```bash
# go
# Calculate the exact range of the newly added row
newRowNumber, _ := strconv.Atoi(matches[1])
rowIndex := int64(newRowNumber - 1)

$ Send a BatchUpdate request to draw solid borders
UpdateBorders: &sheets.UpdateBordersRequest{
    Range: &sheets.GridRange{
        StartRowIndex: rowIndex,
        EndRowIndex:   rowIndex + 1,
        # ...
    },
    Top: &sheets.Border{Style: "SOLID"},
    # ...
}
```

#### 2. Dynamic Sequence Generation
The system treats the spreadsheet as a database. Before writing, it performs a read operation (Values.Get) to find the last sequence number in Column A, casts it to an integer, and increments it. This ensures the numbering remains sequential (1, 2, 3...) even if rows are manually deleted or modified in between runs.
