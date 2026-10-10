import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/features/case-study/CaseStudy";
import { allProjects, getDecisions, getProject } from "@/content/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} · Aqib Akinyele`, description: p.summary, type: "article" },
  };
}

export default async function WorkPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const list = allProjects.filter((p) => p.tier === project.tier);
  const i = list.findIndex((p) => p.slug === project.slug);
  return <CaseStudy project={project} decisions={getDecisions(project.decisions)} prev={list[i - 1]} next={list[i + 1]} />;
}
