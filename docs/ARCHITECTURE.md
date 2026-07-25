# Architecture
**Version:** 1.0 (Draft)  
**Project:** ISC2_SSCP_Exam2  
**Status:** Draft

---

# 1. Purpose

This document defines the software architecture of the ISC2_SSCP_Exam2 application.

The architecture is designed to satisfy the following goals:

- Simple deployment on Cloudflare Pages
- No backend required
- Easy maintenance
- Domain-based question management
- Future scalability
- Mobile-friendly
- Offline-ready

---

# 2. Architecture Overview

```
Browser
    │
    ▼
index.html
    │
    ▼
app.js
    │
    ├── config.js
    ├── loader.js
    ├── quiz.js
    ├── review.js
    ├── score.js
    ├── storage.js
    ├── ui.js
    └── utils.js
                │
                ▼
        questions/*.json
```

The application is completely client-side.

No server-side logic is required.

---

# 3. Directory Structure

```
ISC2_SSCP_Exam2/

docs/

js/

questions/

assets/

css/

tools/

README.md

LICENSE
```

---

## docs/

Project documentation.

```
QuestionAuthoringGuide.md

JSON_SCHEMA.md

ARCHITECTURE.md

ROADMAP.md

CHANGELOG.md
```

---

## js/

Application source code.

```
app.js

config.js

loader.js

quiz.js

review.js

score.js

storage.js

ui.js

utils.js
```

Each module has one responsibility.

---

## questions/

Question database.

Development

```
questions/

d1/

d2/

d3/

...

mixed/
```

Release

```
questions/

d1.json

d2.json

...

mixedA.json

mixedB.json
```

---

## tools/

Developer tools.

```
validateQuestions.js

mergeQuestions.js

coverageReport.js

statistics.js
```

These are never loaded by the browser.

---

# 4. Module Responsibilities

## app.js

Application bootstrap.

Responsibilities

- initialize application
- load configuration
- start quiz
- route events

It should remain very small.

Target

< 150 lines

---

## config.js

Application settings.

Examples

```
QUESTIONS_PER_EXAM

PASS_SCORE

DEFAULT_DOMAIN

DEFAULT_LANGUAGE

ENABLE_TIMER
```

No application logic.

---

## loader.js

Question loading.

Responsibilities

- load JSON
- shuffle questions
- validate data
- select domain
- build mock exam

No UI code.

---

## quiz.js

Core quiz engine.

Responsibilities

- current question
- answer selection
- timer
- next question
- previous question
- finish exam

No HTML manipulation.

---

## review.js

Review mode.

Responsibilities

- incorrect questions
- bookmarked questions
- retry mode
- weak area review

Future

- spaced repetition

---

## score.js

Score calculation.

Responsibilities

- calculate score
- calculate percentage
- domain statistics
- objective statistics

No storage.

---

## storage.js

Persistent data.

Responsibilities

- localStorage
- IndexedDB (future)
- bookmarks
- history
- settings

Application should continue to work even if storage is unavailable.

---

## ui.js

Rendering only.

Responsibilities

- question display
- option display
- progress bar
- result screen
- review screen

No business logic.

---

## utils.js

Reusable utility functions.

Examples

```
shuffle()

random()

uuid()

formatTime()

escapeHtml()
```

---

# 5. Data Flow

```
Application Start

↓

config.js

↓

loader.js

↓

questions/*.json

↓

quiz.js

↓

ui.js

↓

User Answer

↓

score.js

↓

storage.js

↓

Result Screen
```

One-way data flow is preferred.

---

# 6. Question Loading

Supported modes

```
Single Domain

Mixed Exam

Incorrect Only

Bookmarks

Random

Future Adaptive
```

Questions are loaded asynchronously.

---

# 7. Event Flow

```
Start

↓

Load Questions

↓

Shuffle

↓

Display Question

↓

Answer

↓

Save

↓

Next

↓

Finish

↓

Review
```

---

# 8. State Management

Application state should remain centralized.

Example

```javascript
const quizState = {
    currentIndex: 0,
    questions: [],
    answers: [],
    score: 0,
    timer: 0,
    reviewMode: false
};
```

Avoid global variables whenever possible.

---

# 9. Error Handling

The application should never terminate unexpectedly.

Examples

Question JSON missing

↓

Display user-friendly error

Question validation failed

↓

Skip invalid question

Storage unavailable

↓

Continue without persistence

---

# 10. Performance Goals

Target

Initial load

< 2 sec

Question transition

< 100 ms

Answer recording

Immediate

No unnecessary redraws.

---

# 11. Browser Support

Minimum

- Chrome
- Edge
- Firefox
- Safari

Modern JavaScript only.

No legacy IE support.

---

# 12. Responsive Design

Supported devices

Desktop

Tablet

Smartphone

Minimum width

320 px

---

# 13. Accessibility

Goals

- keyboard navigation
- sufficient contrast
- readable font size
- screen reader compatibility

Future enhancement.

---

# 14. Security

Application stores no sensitive information.

No authentication required.

No personal information collected.

All processing occurs locally.

---

# 15. Cloudflare Pages

Deployment flow

```
GitHub Push

↓

GitHub Repository

↓

Cloudflare Pages

↓

Automatic Build

↓

Production
```

No manual deployment.

---

# 16. Build Process

Development

```
questions/d1/D1-001.json

...

questions/d7/D7-050.json
```

↓

```
mergeQuestions.js
```

↓

Release

```
questions/d1.json

questions/d2.json

...
```

---

# 17. Coding Standards

Use

```
const

let
```

Avoid

```
var
```

Prefer

```
===

!==
```

Use

```
async

await
```

instead of Promise chains.

---

# 18. Future Enhancements

Planned

- PWA
- Offline mode
- Dark mode
- English mode
- Adaptive learning
- Analytics dashboard
- CBK coverage report
- Learning history
- Study streak

Architecture should support these without major redesign.

---

# 19. Design Principles

The project follows these principles.

### Single Responsibility

Each module has one responsibility.

---

### Separation of Concerns

UI and business logic are separated.

---

### Data Driven

Questions exist only in JSON.

Application code never contains question text.

---

### Extensibility

Adding a new domain should require only new JSON files.

---

### Maintainability

Small modules

Readable code

Documented architecture

---

# 20. Architecture Roadmap

Current

```
Static HTML

↓

JavaScript Modules

↓

Cloudflare Pages
```

Future

```
PWA

↓

Offline Cache

↓

Analytics

↓

Adaptive Engine

↓

Multi-Certification Platform
```

---

# Appendix A

## Module Dependency

```
app.js

│

├── config.js

├── loader.js

├── quiz.js

├── review.js

├── score.js

├── storage.js

├── ui.js

└── utils.js
```

Dependencies should always point downward.

Circular dependencies are prohibited.

---

# Appendix B

## Development Philosophy

The application should remain

- Simple
- Fast
- Maintainable
- Offline-capable
- Easily extensible

The primary objective is to support high-quality SSCP learning rather than implementing unnecessary features.

---

**End of Document**