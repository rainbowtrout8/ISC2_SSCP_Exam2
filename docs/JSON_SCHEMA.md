# JSON Schema
**Version:** 1.0 (Draft)  
**Project:** ISC2_SSCP_Exam2  
**Status:** Draft

---

# 1. Purpose

This document defines the official JSON schema used throughout the project.

Goals:

- Consistent question format
- Easy maintenance
- Automatic validation
- Future extensibility
- Separation of question content from application logic

Every question in this project SHALL follow this schema.

---

# 2. File Structure

```
questions/
    d1/
        D1-001.json
        D1-002.json
        ...
    d2/
        ...
    d3/
        ...
    d4/
        ...
    d5/
        ...
    d6/
        ...
    d7/
        ...

    mixed/
        MockA.json
        MockB.json
```

Release builds may merge them into

```
questions/

d1.json
d2.json
...
```

using build scripts.

---

# 3. Question Object

Every JSON file contains one Question object.

Example

```json
{
  "id": "D1-001",
  "uuid": "b6d46d0d-b4a5-4a59-bef5-8f38a8bbfb9d",
  "cbkVersion": "2024",
  "domain": "D1",
  "objective": "Security Governance",
  "difficulty": 220,
  "translationStyle": "A",
  "type": "scenario",
  "question": "...",
  "options": [
    "...",
    "...",
    "...",
    "..."
  ],
  "correctIndex": 1,
  "rationale": "...",
  "whyOthers": [
    "...",
    "...",
    "...",
    "..."
  ],
  "examTip": "...",
  "keywords": [
    "Governance",
    "Due Care"
  ],
  "hint": "...",
  "estimatedTime": 90,
  "status": "Approved",
  "revision": "1.0"
}
```

---

# 4. Property Definitions

| Property | Required | Description |
|----------|----------|-------------|
| id | Yes | Question ID |
| uuid | Yes | Internal unique identifier |
| cbkVersion | Yes | CBK version |
| domain | Yes | D1〜D7 |
| objective | Yes | CBK Objective |
| difficulty | Yes | Difficulty score |
| translationStyle | Yes | A/B/C |
| type | Yes | scenario / knowledge |
| question | Yes | Question text |
| options | Yes | Four answer choices |
| correctIndex | Yes | 0〜3 |
| rationale | Yes | Correct explanation |
| whyOthers | Yes | Four explanations |
| examTip | Yes | Exam advice |
| keywords | Yes | English keywords |
| hint | Optional | Learning hint |
| estimatedTime | Yes | Seconds |
| status | Yes | Draft/Reviewed/Approved |
| revision | Yes | Version |

---

# 5. Difficulty Score

Difficulty is represented numerically.

| Score | Meaning |
|-------:|---------|
|100–199|Easy|
|200–299|Medium|
|300–399|Hard|
|400–500|Expert (Future)|

Example

```
150

220

310

365
```

The application may later map these to labels.

---

# 6. Translation Style

| Value | Description |
|-------|-------------|
|A|Natural Japanese|
|B|Official Guide style|
|C|Machine-translated style|

Target distribution

| Style | Ratio |
|--------|------:|
|A|40%|
|B|40%|
|C|20%|

---

# 7. Question Type

Allowed values

```
scenario

knowledge
```

Target

| Type | Ratio |
|-------|------:|
|Scenario|80%|
|Knowledge|20%|

---

# 8. Option Rules

Exactly four options.

```
0

1

2

3
```

correctIndex must match one option.

---

# 9. whyOthers

Exactly four entries.

Each explanation corresponds to the same index.

Example

```
Option A

Option B

Option C

Option D
```

Even the correct answer receives an explanation.

This simplifies UI rendering.

---

# 10. Keywords

Keywords should always use official English terminology.

Example

```json
[
  "Least Privilege",
  "Need-to-Know",
  "RBAC"
]
```

Avoid Japanese translations.

The UI will translate them if necessary.

---

# 11. Estimated Time

Measured in seconds.

Recommended values

| Question | Time |
|----------|-----:|
|Easy|60|
|Medium|90|
|Hard|120|

---

# 12. Status

Allowed values

```
Draft

Reviewed

Approved

Released
```

Workflow

```
Draft

↓

Reviewed

↓

Approved

↓

Released
```

---

# 13. Revision

Examples

```
1.0

1.1

1.2

2.0
```

Minor revisions

- typo
- wording
- explanation

Major revisions

- new scenario
- changed answer

---

# 14. Objective

Examples

```
Security Governance

Policies

Standards

Guidelines

Asset Management

Data Classification

Identity Management

Authentication

Authorization

Business Continuity

Incident Response

Cryptography
```

Must match CBK terminology.

---

# 15. Naming Rules

Question ID

```
D1-001

D1-002

...

D7-050
```

Mock

```
MA-001

MB-001
```

Never reuse IDs.

UUID never changes.

---

# 16. Validation Rules

Every question must satisfy:

✓ Valid JSON

✓ Four options

✓ Four whyOthers

✓ correctIndex = 0〜3

✓ rationale exists

✓ examTip exists

✓ keywords not empty

✓ difficulty assigned

✓ objective assigned

✓ translationStyle assigned

✓ estimatedTime assigned

✓ status assigned

✓ revision assigned

---

# 17. Future Fields

Reserved for future use.

```
statistics

correctRate

reviewCount

favorite

lastReviewed

nextReview

spacedRepetition

aiRecommendation
```

Applications should ignore unknown fields.

---

# 18. Backward Compatibility

Future versions MUST remain compatible.

New properties may be added.

Existing property names should never change.

---

# 19. Example (Complete)

```json
{
  "id":"D1-001",
  "uuid":"3a7f9a11-f47b-4d41-b9aa-4f30c39c9871",
  "cbkVersion":"2024",
  "domain":"D1",
  "objective":"Security Governance",
  "difficulty":240,
  "translationStyle":"B",
  "type":"scenario",
  "question":"A company is reviewing its information security program...",
  "options":[
    "Implement MFA",
    "Establish security policies",
    "Purchase a firewall",
    "Encrypt all laptops"
  ],
  "correctIndex":1,
  "rationale":"Security governance begins with establishing policies approved by management.",
  "whyOthers":[
    "MFA is important but follows policy.",
    "Correct.",
    "Technical controls should support governance.",
    "Encryption is a safeguard, not governance."
  ],
  "examTip":"Governance always precedes implementation.",
  "keywords":[
    "Governance",
    "Policy"
  ],
  "hint":"Think management before technology.",
  "estimatedTime":90,
  "status":"Approved",
  "revision":"1.0"
}
```

---

# Appendix A

## Schema Philosophy

The schema is intentionally verbose.

Reasons

- Easier maintenance
- Easier review
- Better analytics
- Future AI support
- Objective tracking
- Learning statistics

Storage efficiency is NOT a design goal.

Readability and maintainability take priority.

---

**End of Document**