// TypeScript shapes for the Plan agent frontend.
//
// Mirrors ``agent/plan/state.py`` (PlanState) and
// ``tools/plan.py`` (Plan / StepStatus). Keep in sync — the AG-UI
// STATE_SNAPSHOT channel carries this shape verbatim to the chat panel.

export type PlanStage = "create" | "execute" | "adjust" | "done";

export type StepStatus = "not_started" | "in_progress" | "completed" | "blocked";

export interface PlanStepView {
  index: number;
  text: string;
  status: StepStatus;
  notes: string;
}

export interface PlanProgressView {
  total: number;
  completed: number;
  in_progress: number;
  blocked: number;
  not_started: number;
}

export interface PlanSnapshot {
  plan_id: string;
  title: string;
  steps: PlanStepView[];
  progress: PlanProgressView;
}

export interface PlanStepResult {
  agent: string;
  task: string;
  output: string;
}

export interface PlanAgentState {
  plan_id?: string;
  stage?: PlanStage;
  user_question?: string;
  subagent_rounds?: number;
  step_results?: PlanStepResult[];
  plan_snapshot?: PlanSnapshot | null;
}
