# Practice Module

## Purpose

The Practice module manages everything related to a doctor's practice configuration.

---

## Folder Structure

```text
practice/

components/
    today/
    vacation/
    pause/
    working-hours/
    insights/

constants/

hooks/

services/

utils/

pages/

index.js
```

---

## Architecture

```text
UI Components
      │
      ▼
usePractice()
      │
      ▼
practiceService
      │
      ▼
NestJS Backend
```

---

## Responsibilities

### Components

UI only.

No API calls.

No business logic.

---

### Hooks

Business logic.

State management.

Reusable across pages.

---

### Services

Axios communication.

One place for backend APIs.

---

### Constants

Static values.

Days.

Templates.

Reasons.

---

### Utils

Formatting.

Time calculations.

Reusable helper functions.

---

## Rules

* Never call Axios inside UI components.
* Keep components presentational.
* Put API logic in services.
* Put state/business logic in hooks.
* Reuse TryDoc UI Kit.
* Use `@` imports whenever possible.
* Keep files focused and easy to understand.

---

## Future

* Practice Rules
* Bulk Schedule
* Holiday Templates
* Analytics
* Calendar Improvements
* Drag & Drop Scheduling
