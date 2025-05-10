Since the primary focus of "Phase 2.5 Data Modeling Schema Idea" is backend schema definition (`prisma/schema.prisma`), traditional UI generation prompts for UX Pilot are less directly applicable to the core task. The UI for this phase is the code editor for the schema file and terminal commands.

However, if we were to generate prompts for a conceptual _admin panel UI_ to manage the data defined by this schema (as discussed in `spec.md`), here are some examples:

### Prompts for a "User Management" Screen (Admin Panel - Table-Based)

1.  **Prompt for User Table View:**
    "Generate a responsive admin panel screen for User Management. It should feature a main content area with a table displaying a list of users. Columns should include: User ID (cuid), Name, Email (unique), and Image URL (optional). Include pagination, a search bar to filter users by name or email, and a prominent 'Add New User' button. Each row in the table should have action buttons for 'Edit' and 'Delete'. Use a clean, modern aesthetic with clear typography."

2.  **Prompt for "Add/Edit User" Modal/Form:**
    "Design a modal form for adding or editing a user within an admin panel. The form should have fields for: Name (text input, required), Email (email input, required, with validation), and Image URL (text input, optional). Include 'Save' and 'Cancel' buttons. Ensure proper spacing and intuitive layout for the form fields."

### Prompts for a "Run Management" Screen (Admin Panel - Table-Based)

1.  **Prompt for Run Table View:**
    "Create an admin panel screen for Run Management. Display runs in a table with columns for: Run ID (cuid), Run Number (integer, unique), Descriptor (string), Date & Time, Address, and Organizer ID (linking to User). Implement sorting for each column, pagination, and a search filter for Descriptor or Address. Include an 'Add New Run' button. Row actions should be 'Edit' and 'View Details' (which could navigate to a detailed run view with RSVPs and Photos)."

2.  **Prompt for "Add/Edit Run" Form:**
    "Develop a form for creating or editing a run. Fields: Run Number (integer, required, unique), Descriptor (text area, required), Date & Time (datetime picker, required), Address (text input, required), Latitude (number input, optional), Longitude (number input, optional), Intro Link (URL input, optional). Add a searchable dropdown or auto-complete field to select an existing User as the Organizer. Provide 'Save' and 'Cancel' buttons."

### Prompts for Conceptual Data Visualization (ERD-Like View - if built)

1.  **Prompt for ERD Visualization Canvas:**
    "Design a UI screen that visualizes a database schema as an Entity-Relationship Diagram. Each entity (User, Run, RSVP, Photo) should be represented as a draggable box displaying its field names and types. Relationships between entities should be drawn as connecting lines, clearly indicating cardinality (e.g., one-to-many). Allow users to zoom and pan the canvas. Clicking an entity box should highlight it and its direct relationships."

2.  **Prompt for Entity Detail Inspector (on ERD click):**
    "When an entity is selected on the ERD visualization canvas, display a sidebar or modal acting as an 'Inspector'. This inspector should show the selected entity's full definition (all fields, types, constraints like 'unique', 'optional', 'default value'). If possible, include a section to show a few sample data entries for that entity or basic statistics (e.g., 'Total Users: 150')."

These prompts target hypothetical UIs for _interacting_ with the data, rather than the schema definition process itself.
