export type Stage = {
  name: string;
  ok: boolean;
  out: string;
};

export type Report = {
  input: string;
  stages: Stage[];
};

export function summarize(report: Report): string {
  const passed = report.stages.filter((stage) => stage.ok).length;
  return `${passed}/${report.stages.length} stages`;
}
