import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import { useLanguage } from "@/components/language-provider";
import { SkillCategory } from "@/types";

export function useCategory() {
  const params = useParams();
  const { getSkillsData } = useLanguage();
  const [category, setCategory] = useState<SkillCategory | undefined>();

  useEffect(() => {
    const slug = params?.slug as string;
    const foundCategory = getSkillsData().find((cat) => cat.slug === slug);

    if (foundCategory) {
      setCategory(foundCategory);
    } else if (getSkillsData().length > 0) {
      notFound();
    }
  }, [params, getSkillsData]);

  return { category };
}
