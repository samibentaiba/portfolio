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
  activeSection?: string | null;
}

export const MenuDrop: React.FC<MenuDropProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  buttonRef,
  activeSection,
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

  // Check if a section is active (either by scroll detection on homepage or by current page path)
  const isActive = (section: string) => {
    // On homepage, use scroll-based detection
    if (pathname === "/" && activeSection) {
      return activeSection === section;
    }
    // On other pages, check if the pathname starts with the section name
    if (pathname.startsWith(`/${section}`)) {
      return true;
    }
    return false;
  };

  // Theme-aware shadow classes
  const navItemClass = cn(
    "flex py-3 text-sm font-medium text-muted-foreground transition-all duration-200 text-left",
    "hover:text-foreground hover:[text-shadow:_0_1px_8px_rgba(0,0,0,0.4)] dark:hover:[text-shadow:_0_1px_8px_rgba(255,255,255,0.4)]"
  );

  const navItemActiveClass =
    "text-foreground [text-shadow:_0_1px_8px_rgba(0,0,0,0.4)] dark:[text-shadow:_0_1px_8px_rgba(255,255,255,0.4)]";

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
                navItemClass,
                isActive("skills") && navItemActiveClass
              )}
            >
              {t("navigation.skills")}
            </button>
            <button
              onClick={() => handleNavClick("experiences")}
              className={cn(
                navItemClass,
                isActive("experiences") && navItemActiveClass
              )}
            >
              {t("navigation.experiences")}
            </button>
            <button
              onClick={() => handleNavClick("projects")}
              className={cn(
                navItemClass,
                isActive("projects") && navItemActiveClass
              )}
            >
              {t("navigation.projects")}
            </button>
            <button
              onClick={() => handleNavClick("career-timeline")}
              className={cn(
                navItemClass,
                isActive("career-timeline") && navItemActiveClass
              )}
            >
              {t("navigation.career")}
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={cn(
                navItemClass,
                isActive("contact") && navItemActiveClass
              )}
            >
              {t("navigation.contact")}
            </button>
            <button
              onClick={() => handleNavClick("recommendations")}
              className={cn(
                navItemClass,
                isActive("recommendations") && navItemActiveClass
              )}
            >
              {t("navigation.recommendations")}
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
                  href="https://github.com/samibentaiba"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LuGithub className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link
                  href="https://www.linkedin.com/in/samibentaibalinkedin.com"
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
