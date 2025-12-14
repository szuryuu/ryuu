---
title: "GHA Follow Unfollow"
slug: "gha-follow-unfollow"
type: "Solo Project"
year: "2025"
description: "A serverless Go automation tool running on GitHub Actions to manage followers, maintaining a healthy follower ratio with automated sync and activity logging."
image: "/images/projects/github-actions.png"
tech: ["Go", "GitHub Actions", "GitHub API"]
github: "https://github.com/szuryuu/gha-follow-unfollow"
# live: ""
featured: false
order: 2
status: "Completed"
duration: "2 weeks"
# team_size: 4
# role: "Lead Full-Stack Developer"
---

## The Problem

Managing GitHub social connections manually is tedious. Many users employ "follow-for-follow" strategies only to quietly unfollow later, skewing follower ratios. Manually cross-referencing thousands of followers to find who isn't following back—and reciprocating valid follows—wastes valuable time that could be spent coding.

## My Solution

I built **GitHub Follow/Unfollow Bot**, a self-contained automation tool that runs entirely within the GitHub ecosystem, requiring zero external infrastructure or VPS costs.

-   **Serverless Architecture:** Leverages GitHub Actions Scheduled Workflows (CRON) to run maintenance tasks automatically twice a day.
-   **Smart Synchronization:** Automatically detects and follows back new supporters while cleaning up non-mutual connections.
-   **Anti-Abuse Mechanisms:** Implements random jitter and strict operational limits to mimic human behavior and comply with GitHub's API rate limits.
-   **Audit Logging:** Automatically commits execution logs back to the repository, creating a permanent history of actions without a database.

## Technical Deep Dive

### Architecture Decisions

**Why Go over Python/JS?**
-   **Type Safety:** Leveraging the `google/go-github` library ensures strict typing for API responses, preventing runtime errors when handling large follower lists.
-   **Single Binary Simplicity:** Although currently run via `go run`, the project is structured to be easily compiled into a single binary artifact for portability across different CI runners.

**Why GitHub Actions?**
-   **Cost Efficiency:** Replaces the need for a 24/7 server. The script only consumes compute minutes when it runs (approx. 2-5 minutes per run).
-   **Security:** Utilizing GitHub Secrets (`MY_PAT`) ensures high-privilege Personal Access Tokens are injected securely at runtime and never exposed in the codebase.

### Key Features I Built

#### 1. O(1) Lookup Strategy for Difference Calculation
To efficiently handle users with thousands of followers, I utilized Go Maps to implement set difference logic. This reduces the complexity of finding non-mutual followers from O(n²) (nested loops) to O(n).

```bash
# go
# Create a map for O(1) lookups
followingMap := make(map[string]bool)
for _, f := range following {
    followingMap[f.GetLogin()] = true
}

# Identify followers who aren't followed back (A - B)
var needFollow []string
for _, f := range followers {
    if !followingMap[f.GetLogin()] {
        needFollow = append(needFollow, f.GetLogin())
    }
}
```

#### 2. Human-Like Execution Throttling
To prevent the account from being flagged as a spam bot, I implemented artificial delays and strict limits. The bot creates a random sleep interval between actions and caps the total operations per run.

```bash
# go
const limit = 25 // Safety cap per run

// Random jitter between 2 to 5 seconds
sleepTime := time.Duration(2+rand.Intn(3)) * time.Second

for i, user := range needFollow {
    if i >= limit {
        log.Printf("Reached max follow limit (%d)...", limit)
        break
    }
    client.FollowPeople(ctx, user)
    time.Sleep(sleepTime) // Wait before next action
}
```
