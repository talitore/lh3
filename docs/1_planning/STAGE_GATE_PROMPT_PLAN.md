Context: A feature has been moved into the planning stage and the idea file
has been referenced using @filename.md in this chat.

Instructions:

Gain Context:

- Review the reference docs to understand the context of repo.
  - [Architecture](../_reference/architecture.md)
  - [Completed Features Log](../_reference/completed_features_log.md)
- Review each completed feature's summary.md to determine if it's relevant to the current feature. If it is, read the rest of the feature's docs to gain context.
  - [Completed Features](../3_completed/)
  - [Package JSON](../../package.json)
  - [Prisma Schema](../../prisma/schema.prisma)
  - [OpenAPI Spec](../../openapi.yaml)

Read the Referenced File: Review the contents of the feature file that was
referenced using @ (e.g., @chart-feature.md) to understand the feature idea
and its intended goal.

Determine Feature Name: Extract a short, clear name for the feature based
on the file or content (e.g., chart-feature.md → "Chart Feature").

Create Folder: Inside docs/1_planning/, create a new folder named after the
feature (e.g., docs/1_planning/chart-feature/). If a phase number is included in the feature name, prefix the folder name with 'phase-' and the number. (e.g., docs/1_planning/phase-1-chart-feature/).

Create Standard Files: Within this folder, generate the following files:

- README.md
- spec.md
- design.md
- uxpilot_prompts.md

Populate README.md:

- Extract and include the Goal of the feature.
- Populate the following sections using your best judgement based on the
  file contents:

Key Requirements — List the core functional or technical requirements implied
or stated in the idea.

Target Audience — Define who this feature is for (e.g., developers, analysts,
end users).

Open Questions — List any specific clarifying questions that would need to be
answered if you have them and if things are still confusing.

Populate spec.md:

- Outline the feature's intended functionality and technical scope.
- Include 2–3 different UI treatments or layout options for how this feature
  could be visually presented or interacted with in the product
  (e.g., tabs vs. dropdown, modal vs. sidebar, chart styles, etc.).

  - Search the web to update your knowledge on best practices and documentation for all dependencies. Ensure you cross-reference the documentation for the specific installation or configuration.

- Highlight trade-offs or use cases that might make one design better than
  another.

- Include a place for the user to make a decision on the best option.

Populate design.md:

Add any architectural thoughts, visual sketches (as markdown code or descriptions),
component interactions, or other design considerations worth capturing early. Ensure we're adopting the principles of SLC (Simple, Lovable, and Complete), which can be researched @ https://longform.asmartbear.com/slc/.

Populate uxpilot_prompts.md:

- Based on the feature idea, requirements, and the UI treatments identified in spec.md, generate 2-3 detailed text prompts for each key screen or component suitable for an AI UI generation tool like UX Pilot.
- These prompts should describe the desired layout, core elements, and overall style.

When completed, direct the user to which file they should review next and what their objective for reviewing it is.
