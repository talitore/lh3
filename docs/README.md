# ignition

## Project Structure and Workflow Guide

This project uses a specific folder structure within the `docs/` directory to manage features from idea to completion. This system is designed to streamline the development process, especially when working with AI-assisted coding.

### Folder Structure Overview

```
docs/
├── 0_backlog/
│   └── feature-idea.md              # Raw ideas and feature requests start here
│
├── 1_planning/
│   ├── STAGE_GATE_PROMPT_PLAN.md    # Prompt to use when moving a feature INTO the planning stage
│   └── feature-x/                   # Directory for a specific feature being planned
│       ├── README.md                # Auto-populated by the planning prompt; contains open questions for feature feedback
│       ├── spec.md                  # Detailed specification, structure suggested by prompt
│       └── design.md                # Design document, structure suggested by prompt
│
├── 2_inprogress/
│   ├── STAGE_GATE_PROMPT_PROG.md    # Prompt to use when a feature moves INTO the in-progress stage
│   └── feature-x/                   # Directory for a specific feature being implemented
│       ├── README.md                # Potentially updated by the in-progress prompt (e.g., task list)
│       ├── spec.md                  # (from planning)
│       ├── design.md                # (from planning)
│       └── implementation_notes.md  # Notes related to implementation, guided by prompt
│
├── 3_completed/
│   ├── STAGE_GATE_PROMPT_COMPL.md   # Prompt to use when a feature moves INTO the completed stage
│   └── feature-x/                   # Directory for a specific feature that has been completed
│       ├── README.md                # (from in-progress)
│       ├── ... (final spec/design)  # Finalized versions of spec and design documents
│       └── summary.md               # Summary of the completed feature, potentially auto-generated
```

### Workflow

_Note: After files are moved in each step in the process, recommended to start a new chat/session and force a codebase index rebuild._

1.  **Idea**:

    - Add a new ideas to `docs/0_backlog/`. Name them something like `chart-feature-idea.md`.

2.  **Planning**:

    - **Move the idea file**: Move the idea file (e.g., `docs/0_backlog/chart-feature-idea.md`) into the feature planning folder (e.g., `docs/1_planning/chart-feature/chart-feature-idea.md`).
    - **Instruct the AI**: Attach the relevant files and the `STAGE_GATE_PROMPT` file. Send it.

      - For example:
        - Attach `docs/1_planning/STAGE_GATE_PROMPT_PLAN.md`
        - Attach `docs/1_planning/chart-feature/chart-feature-idea.md`

      ![alt text](plan.png)

    - The AI will create the following files: `README.md`, `spec.md`, and `design.md` within `docs/1_planning/your-feature-name/`.

      ![alt text](plan_after.png)

3.  **In Progress**:

    - **Move the feature folder**: Move the entire feature folder (e.g., `docs/1_planning/chart-feature/`) from the `1_planning` directory to the `2_inprogress/` directory. So it becomes `docs/2_inprogress/chart-feature/`.
    - **Instruct the AI**: Attach the relevant files and the `STAGE_GATE_PROMPT` file. Send it.

      - For example:
        - Attach `docs/2_inprogress/STAGE_GATE_PROMPT_PROG.md`
        - Attach all files from the feature's directory, e.g., `docs/2_inprogress/chart-feature/`.

    - The AI will help move/set up the feature in `docs/2_inprogress/your-feature-name/` and prepare it for coding (e.g., creating task lists, `implementation_notes.md`).

4.  **Completed**:
    - **Move the feature folder**: Manually move the entire feature folder (e.g., `docs/2_inprogress/chart-feature/`) from the `2_inprogress` directory to the `docs/3_completed/` directory. So it becomes `docs/3_completed/chart-feature/`.
    - **Instruct the AI**: In your AI assistant, attach the relevant files and provide instructions.
      - For example:
        - Attach `docs/3_completed/STAGE_GATE_PROMPT_COMPL.md`
        - Attach all files from the feature's directory, e.g., `docs/3_completed/chart-feature/`.
      - Then type:
      ```
      Implement the instructions in @STAGE_GATE_PROMPT_COMPL.md for the @chart-feature files.
      ```
    - The AI will generate a `summary.md`.

This system helps maintain clarity and context for each feature throughout its lifecycle. Remember to customize the `STAGE_GATE_PROMPT_*.md` files with prompts that best suit your workflow and AI assistant's capabilities.
