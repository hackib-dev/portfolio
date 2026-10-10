export type Experiment = {
  slug: string;
  title: string;
  summary: string;
  from: { project: string; slug: string };
  intro: string[];
  notes: string[];
  /** Heading over the notes. */
  notesTitle?: string;
};

export const experiments: Experiment[] = [
  {
    slug: "fault-lines",
    title: "Fault lines",
    summary:
      "State a product requirement and watch it run through the FIRS role rules: four role interfaces, the rules beneath them, and the faults that open where those rules stop agreeing. Then compile the same requirements under a different architecture.",
    from: { project: "FIRS Tax Management System", slug: "firs" },
    intro: [
      "The FIRS frontend decides what each role gets from three separate lists: navigation entries with the roles allowed to see them, a lookup from role to landing dashboard, and analysis coverage levels with their own role lists. The rules below are those lists, re-implemented from the source. Under the rules as shipped, every role is sound.",
      "Each column is a core through one role. The surface on top is the interface that role would get, built live from the rules. Beneath it are the three lists as beds. State a requirement and, where the lists stop agreeing, the beds slip along a fault. Switch the architecture to recompile the same requirements with navigation as the only source of truth.",
    ],
    notesTitle: "How it is built",
    notes: [
      "Requirements are an append-only log on top of the shipped rules. Undo, redo, rewinding and the link in the address bar are all just positions in that log. Switching the architecture never touches the log: the same requirements go through a different compiler, so whatever changes is the difference between the two designs.",
      "Three lists is the shape the FIRS code has, verified in source. It is explicit: every rule is written down and can be read in one place. The cost is that nothing makes the lists agree. A requirement written against one list can leave another pointing at a page the role cannot open.",
      "One source is my counterfactual, not what shipped. Landing becomes a preference resolved against navigation, and Analysis is offered exactly when a coverage level is, so faults cannot be expressed. The cost moves: a change to navigation can now move a role's landing page without anyone writing that down. The ledger marks those consequences as implicit, and an edit that would leave a role nowhere to land is refused rather than applied.",
      "The compiler keeps the identity of every role it did not change (structural sharing), and each core subscribes to its own role only. The readings count which cores actually committed for each action, from a layout effect, as in the state propagation experiment.",
      "The audit under each core is measured from the rendered surface after every commit: buttons and radio groups for tab stops, aria-current for the page a screen reader would announce, and the radios in the coverage group. A role that lands on a hidden page has no current page to announce. That is a real accessibility consequence of a rules fault, not a label.",
      "The surfaces are inert: they show the result, and the rules are edited in the beds or the table. Each core carries a text summary of its surface for screen readers, and the table view is the same experiment in plain HTML controls.",
    ],
  },
  {
    slug: "state-propagation",
    title: "State propagation",
    summary: "One store, six components, three ways to subscribe. Watch which components actually re-render when state changes.",
    from: { project: "FIRS Tax Management System", slug: "firs" },
    intro: [
      "This is the FIRS replica's own store, wired to six components that each read a few fields. Change the role, period, state or unit and every component that commits flashes and counts.",
      "Switch the subscription strategy to see the same action wake two components or all six. The FIRS dashboards kept their filters in React Context, so the third strategy is the shape the production code took.",
    ],
    notes: [
      "Commits are counted from a layout effect with no dependency list, which runs once after every commit in which that component rendered. The count is written straight to the DOM, so displaying it causes no render of its own.",
      "The log lists the components that committed between an action and the next task, after React has flushed the update. If a component did not commit, it is not listed.",
      "Context is not wrong. It is simple and it was enough for a filter bar and a few widgets. The cost is breadth: every consumer re-renders on every change, and that grows as a dashboard grows. Selectors trade a little wiring for precision.",
      "Render durations are not shown. React reports them only in its profiling build, which this production site does not ship.",
    ],
  },
];
