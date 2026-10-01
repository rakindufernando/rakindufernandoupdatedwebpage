import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryExperience from "../../components/CategoryExperience";
import { categories, getCategory, getCover, getProjects } from "../../lib/portfolio";

import StructuredData from "../../components/StructuredData";
import { categoryGraph, pageMetadata } from "../../lib/seo";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return categories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return { title: "Category not found | Rakindu Fernando", robots: { index: false, follow: false } };
  const title = `${category.name} | Rakindu Fernando`;
  const description = `Explore ${category.name.toLowerCase()} by Rakindu Fernando. ${category.description} View the complete project collection.`;
  return pageMetadata(title, description, `/work/${category.slug}`);
}

export default async function CategoryPage({ params }: PageProps) {
  const category = getCategory((await params).category);
  if (!category) notFound();
  const index = categories.findIndex((item) => item.slug === category.slug);
  const next = categories[(index + 1) % categories.length];
  return <><StructuredData data={categoryGraph(category)} /><CategoryExperience category={category} projects={getProjects(category)} cover={getCover(category)} nextCategory={next} nextCount={getProjects(next).length} /></>;
}
