"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import recommendationsEn from "@/data/recommendations.json";
import recommendationsFr from "@/data/translations/recommendations-fr.json";
import recommendationsAr from "@/data/translations/recommendations-ar.json";
import { Recommendation } from "@/types";
import { Quote } from "lucide-react";

export default function Recommendations() {
  const { language, t } = useLanguage();

  const recommendations: Recommendation[] =
    language === "fr"
      ? recommendationsFr
      : language === "ar"
      ? recommendationsAr
      : recommendationsEn;

  return (
    <section id="recommendations" className="w-full mb-6 p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="space-y-12"
      >
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {t("recommendations.title") || "Recommendations"}
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {t("recommendations.subtitle") || "What people say about working with me."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col p-6 space-y-4 border rounded-xl bg-card text-card-foreground shadow-sm"
            >
              <Quote className="w-8 h-8 text-primary/40" />
              <p className="flex-1 text-muted-foreground italic">&quot;{rec.text}&quot;</p>
              
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={rec.image}
                    alt={rec.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{rec.name}</h3>
                    {rec.linkedin && (
                      <a
                        href={rec.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-linkedin"
                        >
                          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                          <rect width="4" height="12" x="2" y="9" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec.role} {rec.company && `@ ${rec.company}`}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
