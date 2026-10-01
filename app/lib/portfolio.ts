import archiveProjects from "../portfolio-data.json";

export type Project = (typeof archiveProjects)[number];
export const projects: readonly Project[] = archiveProjects;

export const categories = [
  { slug: "ui-ux-design", value: "UI/UX Design", name: "UI UX Design", lines: ["UI UX", "Design"], number: "01", personality: "interface", coverId: "project-01", caption: "Clarity in every interaction", description: "Thoughtful interfaces that make the everyday feel effortless.", introduction: "From the first wireframe to the final interaction. Exploring useful, intuitive digital experiences with people at the centre." },
  { slug: "software-development", value: "Software Development", name: "Software Development", lines: ["Software", "Development"], number: "02", personality: "technical", coverId: "project-09", caption: "Ideas, engineered", description: "Practical systems shaped by clean code and clear thinking.", introduction: "Turning real problems into working software. A closer look at the structure, interfaces and decisions behind the build." },
  { slug: "graphic-design", value: "Graphic Design", name: "Graphic Design", lines: ["Graphic", "Design"], number: "03", personality: "editorial", coverId: "project-24", caption: "A strong visual voice", description: "Identity, composition and colour with something to say.", introduction: "A collection of identities, print work and visual experiments. Different formats, connected by a love of composition and detail." },
  { slug: "videography", value: "Videography", name: "Videography", lines: ["Video", "graphy"], number: "04", personality: "cinematic", coverId: "project-25", caption: "Stories in motion", description: "People, places and moments brought to life through film.", introduction: "The atmosphere of a place. The energy of a celebration. Moving images that keep a moment alive long after it has passed." },
  { slug: "photography", value: "Photography", name: "Photography", lines: ["Photo", "graphy"], number: "05", personality: "photographic", coverId: "project-26", caption: "A moment, held", description: "A closer look at the people and stories around us.", introduction: "Finding the extraordinary in a passing moment. Portraits, celebrations and visual stories, collected through my lens." },
] as const;

export type Category = (typeof categories)[number];
export const getCategory = (slug: string) => categories.find((category) => category.slug === slug);
export const getProjects = (category: Category) => projects.filter((project) => project.category === category.value);
export const getCover = (category: Category) => getProjects(category).find((project) => project.id === category.coverId) ?? getProjects(category)[0];
export { projectCount } from "./format";
