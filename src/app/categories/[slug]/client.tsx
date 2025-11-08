"use client"


import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { Skill } from "@/types"
import { useCategory } from "./hook"

export default function CategoryClient() {
  const { t } = useLanguage()
  const { category } = useCategory()

  if (!category) {
    return <div className="container py-8">Loading...</div>
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 flex justify-center items-center min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <Link href="/#skills" className="text-primary hover:underline mb-2 sm:mb-4 inline-block text-sm sm:text-base">
            ← {t("skills.backToSkills")}
          </Link>
          <h1 className="text-2xl sm:text-4xl font-bold mb-1 sm:mb-2">{category.category}</h1>
          <p className="text-sm sm:text-base text-muted-foreground">{category.description}</p>
        </div>

        <Card className="mb-6 sm:mb-8">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">{t("categories.overview")}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
            <p className="whitespace-pre-line text-sm sm:text-base">{category.longDescription}</p>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">{t("categories.skillsInCategory")}</h2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            {category.items.map((skill: Skill) => (
              <Link href={`/skills/${skill.slug}`} key={skill.slug}>
                <Card className="h-full hover:shadow-md transition-all">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                      <Badge variant="outline">{skill.experience}</Badge>
                    </div>
                    <CardDescription className="text-xs sm:text-sm mt-1">{t("skills.clickToView")}</CardDescription>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0">
                    <p className="text-sm line-clamp-3">{skill.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
