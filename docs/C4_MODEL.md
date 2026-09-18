# Architecture: ExamUdaan C4 Model

## System Context (Level 1)
Shows how ExamUdaan fits into the world, interacting with users and external sources.

```mermaid
C4Context
    title System Context Diagram for ExamUdaan
    
    Person(student, "Student", "A user looking for government job updates")
    Person(admin, "Admin", "ExamUdaan team member managing content")
    
    System(examudaan, "ExamUdaan Platform", "Aggregates and displays government job notifications, admit cards, and results.")
    
    System_Ext(gov_sites, "Government Websites", "Official sources like SSC, UPSC, RRB")
    
    Rel(student, examudaan, "Views jobs and sets alerts")
    Rel(admin, examudaan, "Manages jobs and views scraper logs")
    Rel(examudaan, gov_sites, "Scrapes data from")
```

## Container Diagram (Level 2)
Shows the high-level technical containers that make up ExamUdaan.

```mermaid
C4Container
    title Container Diagram for ExamUdaan
    
    Person(student, "Student", "A user looking for government job updates")
    Person(admin, "Admin", "ExamUdaan team member managing content")
    
    System_Boundary(examudaan, "ExamUdaan") {
        Container(web_app, "Next.js Web Application", "React, Next.js App Router", "Delivers the user interface for students and admins")
        Container(scraper, "Scrapy Spiders", "Python, Scrapy", "Automated scripts that crawl government websites")
        ContainerDb(database, "Supabase (PostgreSQL)", "PostgreSQL", "Stores jobs, users, payments, and scraper logs")
    }
    
    System_Ext(gov_sites, "Government Websites", "Official sources like SSC, UPSC, RRB")
    
    Rel(student, web_app, "Visits", "HTTPS")
    Rel(admin, web_app, "Manages", "HTTPS")
    Rel(web_app, database, "Reads/Writes", "Supabase JS Client")
    Rel(scraper, database, "Writes scraped data", "SQL/REST")
    Rel(scraper, gov_sites, "Crawls HTML", "HTTPS")
```

## Component Diagram (Level 3) - Web App
Shows the internal components of the Next.js Web App.

```mermaid
C4Component
    title Component Diagram for Next.js Web App
    
    Container_Boundary(web_app, "Next.js Web Application") {
        Component(pages, "Route Handlers (Pages)", "Next.js Server Components", "Renders the UI (Home, Jobs, Admin)")
        Component(api, "API Routes", "Next.js API", "Secure endpoints for admin actions")
        Component(auth, "Auth Middleware", "Next.js HOC", "Secures admin routes using JWT")
        Component(ui, "UI Components", "React Client Components", "Reusable UI (JobCard, FilterChips, TickerBar)")
    }
    
    ContainerDb(database, "Supabase (PostgreSQL)", "PostgreSQL", "Stores data")
    
    Rel(pages, ui, "Uses")
    Rel(pages, database, "Fetches data (Server-side)")
    Rel(ui, api, "Calls (Client-side)")
    Rel(api, auth, "Uses for security")
    Rel(api, database, "Mutates data")
```
