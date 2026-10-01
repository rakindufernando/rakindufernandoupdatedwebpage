export const projectCount = (count: number) => `${String(count).padStart(2, "0")} ${count === 1 ? "project" : "projects"}`;
