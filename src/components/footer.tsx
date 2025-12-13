"use client";

import { useLanguage } from "@/components/language-provider";
import { useRTL } from "@/hooks/use-rtl";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { LuGithub, LuLinkedin } from "react-icons/lu";

export function Footer() {
  const { t } = useLanguage();
  const { isRtl } = useRTL();

  return (
    <footer className="w-full hidden md:flex items-center justify-center border-t py-6 md:py-0">
      <div
        className={cn(
          "container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-6",
          isRtl && "md:flex-row-reverse"
        )}
      >
        <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} Sami Bentaiba. {t("footer.rights")}
        </p>
        <div
          className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}
        >
          <Link
            href={"https://www.linkedin.com/in/samibentaiba"}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <LuGithub className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={"https://github.com/samibentaiba"}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <LuLinkedin className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
