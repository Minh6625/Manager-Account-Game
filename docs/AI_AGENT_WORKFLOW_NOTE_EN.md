# AI AGENT CODE WORKFLOW NOTE

## Mindset

AI Agent does not replace Engineer. Engineers must:

- AI Agent does not replace Engineer's responsibility.
- Engineer must understand Requirements before creating Prompts.
- Engineer must control Scope.
- Engineer must Review Code before Accept.
- Engineer must Test/Build before marking Done.
- Engineer must be able to explain changes Agent made.
- Update progress clearly, report blockers early, coordinate with team.
- Work according to AI Agent Code workflow.
- Do not Merge or Handoff without understanding changes.

## 10-Step Flow

**Step 1**: Clarify requirements.  
**Step 2**: Transform requirements into a clear Plan.  
**Step 3**: Break the plan into small tasks (30-90 minutes each).  
**Step 4**: Create `prompt.xml` following exact scope (no feature expansion beyond plan) for each task.  
**Step 5**: Review Prompt before giving to Agent.  
**Step 6**: Let Agent read and understand architecture and source before coding to ensure Agent codes according to planned architecture.  
**Step 7**: Agent codes following prompt.  
**Step 8**: Engineer reviews results.  
**Step 9**: Test / Build.  
**Step 10**: Report changes, results, and risks for each task.

## Task Breakdown Standards

Each task must have:

- Clear Task Name.
- Specific objective.
- Allowed scope.
- Forbidden scope.
- Required output.
- Acceptance Criteria.
- Test Plan.
- Time estimate (30-90 minutes).

**Do not create vague tasks:**

- Build User module
- Fix entire UI
- Optimize system
- Refactor Source

**Convert to small tasks:**

- Validate and update Table Columns according to API Response.
- Create Guard to check POS Page access permissions.
- Extract Filter Component in Report screen.
- Fix Schedule Data Mapping by `employee_id` and `date`.

## prompt.xml Format Requirements

Prompt must include at minimum:

- `meta`
- `goal`
- `frsReference` / `requirementReference`
- `planReference`
- `taskUnit`
- `context`
- `scope`
- `hardRules`
- `tasks`
- `constraints`
- `acceptanceCriteria`
- `testPlan`
- `outputRequired`

Prompt must be clear enough for Agent to know:

**Clean code:**

- Follow existing patterns: Read current code, follow existing style
- Naming: camelCase (functions/vars), PascalCase (Components/Types), UPPER_SNAKE_CASE (constants)
- Stdlib does it? → use it (Array.map, Object.keys, etc.)
- Native platform feature? → use it (fetch, async/await, optional chaining)
- Installed dependency? → use it (React hooks, Prisma methods, Zod schemas)
- One line? → one line (arrow functions, ternary operators)
- Only then: the minimum that works
- No unnecessary abstraction: Don't create utils/helpers if used only once
- No premature optimization: Code working > code perfect

**What to do.**  
**Which files to read.**  
**Which parts not to modify.**  
**What is the final output.**  
**How to verify results.**  
**What needs to be reported.**

## Answering the Questions

### 1. Why not assign large tasks directly to Agent?

Large task → vague scope → Agent guesses → wrong implementation  
Difficult to review when too many changes at once

### 2. Why should each Prompt be in 30-90 minute range?

Small enough to focus and control scope easily  
Quick review, fast feedback and bug fixes  
Fix as you go - detect errors early, minimal impact

### 3. Why need FRS/Requirement before creating Prompt?

FRS is the foundation document for subsequent steps  
Without clear requirements Agent won't know what's correct, leading to wrong direction, wasting tokens and time.

### 4. Why does Agent need to read architecture/Source before Coding?

Understand current architecture/source to code and create files following project structure → helps Engineer maintain control  
When Agent understands architecture/Source it creates cleaner code, no duplicate code, doesn't break existing code. Knows which files to modify, which files are off-limits

### 5. Why must Engineer still Review, Test, Build after Agent Codes?

AI is not perfect, may create hidden bugs  
Engineer bears final responsibility for code - Should not trust AI completely.  
Engineer reviews, tests, builds to ensure task works correctly as required and finds hidden bugs during testing

### 6. Why report changes, results, and risks after each task?

Helps team track real progress  
Capture risks and issues  
Have documentation for future maintenance
