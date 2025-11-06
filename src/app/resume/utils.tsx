import { Separator } from "@/components/ui/separator";
import type { ReactNode } from "react";

// Component for rendering resume sections with title and separator
interface ResumeSectionProps {
  title?: string;
  children: ReactNode;
}

export function ResumeSection({ title, children }: ResumeSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Separator />
      <div className="space-y-4">{children}</div>
    </section>
  );
}