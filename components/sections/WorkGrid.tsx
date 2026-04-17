"use client";

import { projects } from "@/data/projects";

export default function WorkGrid() {
  return (
    <section className="px-6 py-24">
      <h2 className="mb-12 text-4xl font-semibold tracking-tight">Work</h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <div key={project.slug} className="aspect-video bg-foreground/5" />
        ))}
      </div>
    </section>
  );
}
