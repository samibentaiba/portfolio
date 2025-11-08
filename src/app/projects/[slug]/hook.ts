import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Project } from "@/types";

export function useProject() {
  const params = useParams();
  const { getProjectsData } = useLanguage();
  const [project, setProject] = useState<Project | undefined>();

  useEffect(() => {
    const slug = params?.slug as string;
    const foundProject = getProjectsData().find((p) => p.slug === slug);

    if (foundProject) {
      setProject(foundProject);
    } else if (getProjectsData().length > 0) {
      notFound();
    }
  }, [params, getProjectsData]);

  return { project };
}
