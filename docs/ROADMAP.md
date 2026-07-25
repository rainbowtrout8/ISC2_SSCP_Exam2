# ROADMAP
**Version:** 1.0 (Draft)  
**Project:** ISC2_SSCP_Exam2  
**Target Certification:** ISC² SSCP (CBK 2024)

---

# 1. Vision

Create the highest-quality Japanese SSCP practice platform by emphasizing:

- ISC² thinking
- Security decision-making
- Practical administration
- Long-term maintainability
- Continuous improvement

The project is intended to become more than a practice question bank.

It will evolve into a complete learning platform.

---

# 2. Project Goals

Primary goals

- Produce realistic SSCP questions
- Improve reasoning skills
- Cover every CBK objective
- Support long-term learning
- Enable future certification expansion

Success criteria

- Candidate consistently scores 85%+
- Candidate feels the actual exam is easier
- Questions remain maintainable for years

---

# 3. Release Plan

## Phase 1

Foundation

- Documentation
- Architecture
- JSON Schema
- Coding Standards

Status

✅ In Progress

---

## Phase 2

Application Refactoring

Deliverables

- Modular JavaScript
- Question Loader
- Storage Layer
- UI Layer
- Review Engine

Target Version

v0.5

---

## Phase 3

Domain 1

Security Concepts and Organizational Operations

Deliverables

- Blueprint
- 50 Questions
- Review
- Final Release

Target Version

v1.0

---

## Phase 4

Domain 2

Access Controls

Deliverables

- Blueprint
- 50 Questions
- Review

Target Version

v2.0

---

## Phase 5

Domain 3

Risk Identification, Monitoring and Analysis

Deliverables

- Blueprint
- 50 Questions
- Review

Target Version

v3.0

---

## Phase 6

Domain 4

Incident Response and Recovery

Deliverables

- Blueprint
- 50 Questions
- Review

Target Version

v4.0

---

## Phase 7

Domain 5

Cryptography

Deliverables

- Blueprint
- 50 Questions
- Review

Target Version

v5.0

---

## Phase 8

Domain 6

Network and Communications Security

Deliverables

- Blueprint
- 50 Questions
- Review

Target Version

v6.0

---

## Phase 9

Domain 7

Systems and Application Security

Deliverables

- Blueprint
- 50 Questions
- Review

Target Version

v7.0

---

## Phase 10

Mock Exam A

100 Questions

Characteristics

- Official exam level
- Balanced CBK coverage
- Normal Japanese

Target Version

v8.0

---

## Phase 11

Mock Exam B

100 Questions

Characteristics

- Slightly harder
- Longer scenarios
- Translation Style B/C included
- Higher decision-making difficulty

Target Version

v9.0

---

# 4. Milestones

| Version | Milestone |
|----------|-----------|
|0.1|Documentation|
|0.5|Application Refactoring|
|1.0|Domain 1 Complete|
|2.0|Domain 2 Complete|
|3.0|Domain 3 Complete|
|4.0|Domain 4 Complete|
|5.0|Domain 5 Complete|
|6.0|Domain 6 Complete|
|7.0|Domain 7 Complete|
|8.0|Mock Exam A|
|9.0|Mock Exam B|
|10.0|Learning Platform|

---

# 5. Quality Roadmap

Every release improves:

- Question quality
- Explanation quality
- UI
- Analytics
- Maintainability

No feature should reduce question quality.

---

# 6. Question Development Workflow

```
Blueprint

↓

Draft

↓

Self Review

↓

Technical Review

↓

User Review

↓

Revision

↓

Approved

↓

Release
```

Questions never skip review.

---

# 7. Application Roadmap

Current

```
Quiz

↓

Score

↓

Review
```

Future

```
Bookmarks

↓

Study History

↓

Weak Domain Analysis

↓

Adaptive Learning

↓

Spaced Repetition

↓

Learning Dashboard
```

---

# 8. Planned Features

## Learning

- Bookmark questions
- Retry incorrect answers
- Domain practice
- Mock exams
- Timed mode
- Untimed mode

---

## Statistics

- Overall score
- Domain score
- Objective score
- Correct answer rate
- Study history
- Time per question

---

## Review

- Incorrect questions
- Bookmarked questions
- Weak domains
- Weak objectives

---

## Analytics

- Difficulty distribution
- Coverage report
- Progress tracking

---

# 9. Future Enhancements

Planned

- PWA
- Offline mode
- Dark mode
- English interface
- Adaptive testing
- AI study recommendations
- Cloud synchronization (optional)

---

# 10. Repository Roadmap

```
docs/

js/

css/

questions/

tools/

assets/

tests/
```

Future additions

```
scripts/

.github/

examples/

samples/
```

---

# 11. Tooling Roadmap

Developer tools

```
validateQuestions.js

coverageReport.js

mergeQuestions.js

statistics.js

buildMock.js
```

Future

```
questionLinter.js

translationChecker.js

duplicateDetector.js
```

---

# 12. Testing Roadmap

Application testing

- JSON validation
- UI testing
- Browser testing
- Mobile testing

Question testing

- Objective coverage
- Difficulty balance
- Translation consistency
- Explanation completeness

---

# 13. Long-Term Vision

This architecture should support additional certifications without major redesign.

Examples

- ISC² CC
- ISC² CCSP
- ISC² CISSP
- CompTIA Security+
- AWS Security Specialty

Questions remain independent of the application.

Only question data changes.

---

# 14. Definition of Done

A sprint is complete when:

- Documentation updated
- JSON validated
- Application builds successfully
- Cloudflare deployment successful
- Manual review completed

---

# 15. Success Metrics

Project quality will be measured by:

- CBK coverage (100%)
- Explanation completeness (100%)
- JSON validation (100%)
- Review completion (100%)
- Stable deployment (100%)

Learning effectiveness will be evaluated separately based on user feedback.

---

# 16. Change Management

Every release must update:

- CHANGELOG.md
- Version number
- Revision history

Major revisions require review before release.

---

# 17. Next Sprint

Sprint 2 begins implementation.

Deliverables

```
js/

config.js

loader.js

storage.js

utils.js

app.js (refactored)
```

These modules establish the application foundation before introducing the new D1 question set.

---

# Appendix A

## Development Principles

1. Questions first.
2. Maintainability over cleverness.
3. Readability over brevity.
4. Data-driven architecture.
5. Continuous review.
6. Incremental improvement.
7. Backward compatibility whenever practical.

---

# Appendix B

## Project Motto

> **Train beyond the exam.  
> Make the real SSCP feel easier than practice.**

---

**End of Document**