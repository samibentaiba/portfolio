"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { useLanguage } from "@/components/language-provider";
import { LanguageToggleMobile } from "@/components/language-toggle-mobile";
import { ThemeToggleMobile } from "@/components/theme-toggle-mobile";
import { Separator } from "@/components/ui/separator";
import { LuGithub } from "react-icons/lu";
import { LuLinkedin } from "react-icons/lu";
import Link from "next/link";

interface MenuDropProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (state: boolean) => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export const MenuDrop: React.FC<MenuDropProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  buttonRef,
}) => {
  const pathname = usePathname();
  const { scrollToSection } = useScroll();
  const { t } = useLanguage();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (section: string) => {
    scrollToSection(section);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen, setMobileMenuOpen, buttonRef]);

  return (
    <>
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden flex flex-col justify-center items-center max-w-[500px] px-6"
        >
          <Separator className="w-screen flex justify-center items-center" />
          <nav className="container flex flex-col py-4 px-6">
            <button
              onClick={() => handleNavClick("skills")}
              className={cn(
                "flex py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground text-left",
                pathname === "/#skills" && "text-foreground"
              )}
            >
              {t("navigation.skills")}
            </button>
            <button
              onClick={() => handleNavClick("experiences")}
              className={cn(
                "flex py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground text-left",
                pathname === "/#experiences" && "text-foreground"
              )}
            >
              {t("navigation.experiences")}
            </button>
            <button
              onClick={() => handleNavClick("projects")}
              className={cn(
                "flex py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground text-left",
                pathname === "/#projects" && "text-foreground"
              )}
            >
              {t("navigation.projects")}
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={cn(
                "flex py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground text-left",
                pathname === "/#contact" && "text-foreground"
              )}
            >
              {t("navigation.contact")}
            </button>
          </nav>

          <Separator className="w-screen flex justify-center items-center" />

          <div className="container px-6 py-2">
            <LanguageToggleMobile />
            <ThemeToggleMobile />
          </div>

          <Separator className="w-screen flex justify-center items-center" />

          <footer className="w-full flex items-center justify-center py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 sm:px-6">
              <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
                © {new Date().getFullYear()} Sami Bentaiba. {t("footer.rights")}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LuGithub className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com"
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
        </div>
      )}
    </>
  );
};

export default MenuDrop;
