"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./globals.css";
import { LanguageProvider } from "@/components/language-provider";
import { usePathname } from "next/navigation";
import { LanguageToggle } from "@/components/language-toggle";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useScroll } from "@/hooks/use-scroll";
import MenuDrop from "@/components/mobile-drop";
import { ThemeProvider } from "@/components/theme-provider";
import Link from "next/link";
import { LuGithub } from "react-icons/lu";
import { LuLinkedin } from "react-icons/lu";
import { useRTL } from "@/hooks/use-rtl";
import { ScrollProvider } from "@/components/scroll-context";

// RTL wrapper component
function RTLWrapper({ children }: { children: React.ReactNode }) {
  useRTL();
  return <>{children}</>;
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const foregroundColorRef = useRef("rgba(255, 255, 255, 0.5)");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    const updateColor = () => {
      const newColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--foreground")
          .trim() || "rgba(255, 255, 255, 0.5)";
      foregroundColorRef.current = newColor;
    };

    updateColor();

    const observer = new MutationObserver(() => {
      updateColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = foregroundColorRef.current;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles: Particle[] = Array.from(
      { length: 100 },
      () => new Particle()
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  // Section detection using scroll position
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }

    const sections = [
      "hero",
      "skills",
      "experiences",
      "projects",
      "career-timeline",
      "contact",
      "recommendations",
    ];

    const handleScroll = () => {
      const threshold = 300; // Detection threshold from top of viewport

      // Find the section whose top is closest to (but above) the threshold
      let activeId: string | null = null;

      // Special case: if near bottom of page, select last section (recommendations)
      const scrollBottom = window.scrollY + window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight - scrollBottom < 100) {
        activeId = sections[sections.length - 1]; // Last section
      } else {
        // Go through sections in reverse order to find the one that's passed the threshold
        for (let i = sections.length - 1; i >= 0; i--) {
          const sectionId = sections[i];
          const element = document.getElementById(sectionId);
          if (!element) continue;

          const rect = element.getBoundingClientRect();

          // If this section's top has crossed the threshold (scrolled into view)
          if (rect.top <= threshold) {
            activeId = sectionId;
            break;
          }
        }
      }

      // Special case: if at very top, show hero
      if (window.scrollY < 100 || !activeId) {
        activeId = "hero";
      }

      setActiveSection(activeId);
    };

    // Run on mount and with a small delay for initial render
    setTimeout(handleScroll, 100);
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="h-screen w-screen">
        <canvas
          ref={canvasRef}
          className="fixed inset-0 z-0 h-full w-full bg-background"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <LanguageProvider>
            <RTLWrapper>
              <ScrollProvider activeSection={activeSection}>
                <div className="flex flex-col min-h-screen">
                  <Header activeSection={activeSection} />
                  <div id="/" className="flex-1 py-8">
                    {children}
                  </div>
                  <Footer />
                  <ScrollHandler />
                </div>
              </ScrollProvider>
            </RTLWrapper>
          </LanguageProvider>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}

function Header({ activeSection }: { activeSection: string | null }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { scrollToSection } = useScroll();
  const { isRtl } = useRTL();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (section: string) => {
    scrollToSection(section);
    setMobileMenuOpen(false);
  };

  // Theme-aware shadow classes for navbar items
  const navItemClass = cn(
    "flex items-center text-xs sm:text-sm font-medium text-muted-foreground transition-all duration-200",
    "hover:text-foreground hover:[text-shadow:_0_1px_8px_rgba(0,0,0,0.4)] dark:hover:[text-shadow:_0_1px_8px_rgba(255,255,255,0.4)]"
  );

  const navItemActiveClass = cn(
    "text-foreground [text-shadow:_0_1px_8px_rgba(0,0,0,0.4)] dark:[text-shadow:_0_1px_8px_rgba(255,255,255,0.4)]"
  );

  // Check if a section is active (either by scroll detection on homepage or by current page path)
  const isActive = (section: string) => {
    // On homepage, use scroll-based detection
    if (pathname === "/") {
      return activeSection === section;
    }
    // On other pages, check if the pathname starts with the section name
    // e.g., /projects, /projects/algis -> "projects" is active
    // e.g., /skills, /skills/react -> "skills" is active
    // e.g., /experiences, /experiences/itc-developer -> "experiences" is active
    if (pathname.startsWith(`/${section}`)) {
      return true;
    }
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex flex-col items-center justify-center">
      <div className="flex w-full max-w-[1920px] h-14 sm:h-16 md:h-18 items-center px-3 sm:px-4 md:px-6 justify-between">
        <div className={cn("flex items-center gap-1 sm:gap-2")}>
          <button
            onClick={() => handleNavClick("/")}
            className="cursor-pointer"
            aria-label="Go to top"
          >
            <BentaidevLogo
              isActive={
                activeSection === "hero" || (pathname === "/" && !activeSection)
              }
            />
          </button>

          {/* Desktop navigation */}
          <nav
            className={cn(
              "hidden md:flex gap-3 md:gap-6 ml-3 md:ml-6",
              isRtl && "flex-row-reverse mr-3 md:mr-6 ml-0"
            )}
          >
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
        </div>

        <div
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            isRtl && "flex-row-reverse"
          )}
        >
          <ThemeToggle />
          <LanguageToggle />

          {/* Mobile menu button */}
          <Button
            ref={buttonRef}
            variant="outline"
            className="md:hidden lg:hidden"
            size="icon"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <MenuDrop
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        buttonRef={buttonRef}
        activeSection={activeSection}
      />
    </header>
  );
}

const BentaidevLogo = ({ isActive }: { isActive?: boolean }) => {
  const { isRtl } = useRTL();
  return (
    <div className="inline-flex items-center justify-center group">
      <div
        className={cn(
          "text-2xl font-bold tracking-wider flex items-center transition-all duration-200",
          "group-hover:[text-shadow:_0_1px_12px_rgba(0,0,0,0.5)] dark:group-hover:[text-shadow:_0_1px_12px_rgba(255,255,255,0.5)]",
          isActive &&
            "[text-shadow:_0_1px_12px_rgba(0,0,0,0.5)] dark:[text-shadow:_0_1px_12px_rgba(255,255,255,0.5)]",
          isRtl && "flex-row-reverse"
        )}
      >
        <span className="bg-foreground text-background rounded flex items-center justify-center h-6 w-0 mr-1 pr-[11] pl-[13]">
          B
        </span>
        <span>ENTAIDEV</span>
      </div>
    </div>
  );
};

function Footer() {
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

function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);

      if (element) {
        setTimeout(() => {
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 0;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }, 100);
      }
    }
  }, [pathname]);

  return null;
}
