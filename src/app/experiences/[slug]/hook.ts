import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { Experience } from "@/types";

export function useExperience() {
  const params = useParams();
  const { getExperiencesData } = useLanguage();
  const [experience, setExperience] = useState<Experience | undefined>();

  useEffect(() => {
    const slug = params?.slug as string;
    const foundExperience = getExperiencesData().find(
      (exp) => exp.slug === slug
    );

    if (foundExperience) {
      setExperience(foundExperience);
    } else if (getExperiencesData().length > 0) {
      notFound();
    }
  }, [params, getExperiencesData]);

  return { experience };
}
