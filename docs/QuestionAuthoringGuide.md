# SSCP Question Authoring Guide
**Version:** 1.0 (Draft)  
**Project:** ISC2_SSCP_Exam2  
**Target Certification:** ISC² Systems Security Certified Practitioner (SSCP)  
**CBK Version:** SSCP CBK 2024  
**Document Status:** Draft

---

# 1. Purpose

## 1.1 Objective

This document defines the standards for creating, reviewing, maintaining, and publishing all questions used in the **ISC2_SSCP_Exam2** project.

The goals are:

- Produce questions that closely resemble the actual SSCP examination.
- Emphasize **security decision making**, not memorization.
- Maintain consistent quality across all domains.
- Enable future expansion without redesign.

This document is the authoritative reference for every question included in this repository.

---

## 1.2 Scope

This guide applies to:

- Domain Questions (D1–D7)
- Mock Exam A
- Mock Exam B
- Future Practice Exams
- Future Adaptive Exams

---

## 1.3 Out of Scope

This project does **NOT** attempt to:

- Reproduce actual ISC² exam questions.
- Copy Official Practice Tests.
- Copy LearnZapp questions.
- Copy PocketPrep questions.

All questions must be original.

---

# 2. Design Philosophy

The purpose of this project is **not** to create a question bank.

The purpose is to create an **SSCP Learning Platform**.

Questions must teach the candidate **how ISC² expects a security professional to think.**

---

## Learning Philosophy

Students should learn:

- Risk-based thinking
- Business-first decisions
- Security governance
- Operational security
- Practical administration
- Incident response
- Security lifecycle

NOT

- Pure memorization
- Trivia
- Vendor-specific knowledge

---

# 3. Question Philosophy

Every question must satisfy the following principles.

---

## Principle 1

Ask

> "What should the security administrator do?"

NOT

> "What is the definition of X?"

---

## Principle 2

Prefer scenario questions.

Good:

> A security administrator discovers...

Bad:

> What is RBAC?

---

## Principle 3

The candidate should need to think.

Avoid simple recall questions whenever possible.

---

## Principle 4

Every option should appear plausible.

Never include joke answers.

Never include obviously wrong answers.

---

## Principle 5

The correct answer should be

> BEST

not merely

> Correct.

---

# 4. Difficulty Model

Questions are classified into three levels.

| Level | Description | Target |
|--------|-------------|--------|
| Easy | Knowledge confirmation | 20% |
| Medium | Typical SSCP | 50% |
| Hard | Slightly harder than SSCP | 30% |

Hard does NOT mean obscure.

Hard means:

- multiple plausible answers
- longer scenarios
- BEST/FIRST decisions
- management vs technical choices

---

# 5. Translation Style

Because Japanese ISC² exams often resemble machine-translated English, this project intentionally uses three writing styles.

---

## Style A

Natural Japanese.

Used during learning.

Example

> 最初に実施すべき対応はどれか。

Target ratio

40%

---

## Style B

Official Guide style.

Slightly literal.

Example

> 最も適切なコントロールはどれか。

Target ratio

40%

---

## Style C

English-oriented translation.

Example

> リスクを減少するために最も適切であるコントロールはどれか。

Target ratio

20%

Purpose:

Train reading ability for actual Japanese ISC² exams.

---

# 6. ISC² Keywords

Questions should frequently use ISC² terminology.

Preferred words

- BEST
- FIRST
- MOST
- LEAST
- PRIMARY
- INITIAL
- NEXT
- MOST appropriate
- MOST effective

Avoid excessive use of

- ALWAYS
- NEVER

unless absolutely required.

---

# 7. Question Categories

Recommended ratio.

| Category | Target |
|-----------|-------:|
| Scenario | 80% |
| Knowledge | 20% |

Scenario questions should dominate.

---

# 8. Option Design

Every question must have exactly four options.

```
A
B
C
D
```

No True/False.

No "All of the above".

No "None of the above".

---

## Bad Example

A obvious

B obvious

C obvious

D correct

---

## Good Example

A technically correct

B operationally correct

C management correct

D BEST

Candidate must choose BEST.

---

# 9. Explanation Requirements

Every question must include:

- Correct Answer
- Why it is correct
- Why each incorrect option is wrong
- Exam Tip
- English Keywords

Minimum structure:

```
Correct Answer

Why Correct

Why Others

Exam Tip

Keywords
```

---

# 10. English Keywords

Every explanation should include important English terminology.

Example

```
Least Privilege

Need-to-Know

Due Care

Due Diligence

Compensating Control

Preventive Control

Detective Control

Corrective Control
```

Purpose:

Students should become familiar with official ISC² terminology.

---

# 11. Difficulty Guidelines

Easy questions

- Short
- One obvious answer
- Basic concepts

---

Medium questions

- Typical SSCP

Example

BEST

FIRST

MOST

---

Hard questions

Long scenario

Several reasonable answers

Need prioritization

Need judgment

---

# 12. Scenario Design

Preferred scenario length

100–250 Japanese characters.

Long scenarios

250–450 characters.

Avoid extremely long reading unless intentionally simulating the exam.

---

# 13. Review Checklist

Before approving a question:

- CBK objective matches
- English terminology correct
- Four options
- Only one BEST answer
- Explanation complete
- Exam Tip exists
- Keywords exist
- Difficulty assigned
- Translation style assigned
- JSON valid

All checks must pass before release.

---

# 14. Version Control

Question lifecycle

```
Draft

↓

Reviewed

↓

Approved

↓

Released
```

Revision examples

```
1.0

1.1

2.0
```

---

# 15. Naming Convention

Question IDs

```
D1-001

D1-002

...

D7-050
```

Mock Exams

```
MA-001

...

MA-100

MB-001

...

MB-100
```

---

# 16. Future Expansion

This project is designed to support:

- Adaptive Exams
- Weak Area Review
- Spaced Repetition
- Learning Analytics
- English Mode
- CISSP Migration
- CCSP Migration

without changing the question format.

---

# 17. Quality Standard

The target quality is:

```
LearnZapp
      ↓
Official Practice Tests
      ↓
ISC2_SSCP_Exam2
      ↓
Actual SSCP Exam
```

The question bank should be **slightly more difficult than the real examination**, so that candidates feel confident on exam day.

---

# Appendix A – Writing Rules

1. Avoid trick questions.
2. Never test grammar.
3. Test security judgment.
4. Prefer operational scenarios.
5. Avoid vendor-specific products.
6. Use internationally accepted terminology.
7. Keep explanations educational.
8. Every distractor must be plausible.

---

# Appendix B – Definition of "BEST"

Many options may be technically correct.

The candidate must identify:

- the safest
- the most practical
- the highest priority
- the most risk-reducing
- the ISC² answer

This distinction is the core philosophy of SSCP.

---

# Appendix C – Golden Rule

A candidate who consistently scores:

- **85% or higher** on this question bank

should feel prepared to pass the actual SSCP examination with confidence.

---

**End of Document**