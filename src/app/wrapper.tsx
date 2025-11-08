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

export function Wrapper({ children }: { children: React.ReactNode }) {
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

    // Function to update current foreground color from CSS
    const updateColor = () => {
      const newColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--foreground")
          .trim() || "rgba(255, 255, 255, 0.5)";
      foregroundColorRef.current = newColor;
    };

    updateColor();

    // Observe theme/class changes to detect foreground updates
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
            <div className="flex flex-col min-h-screen">
              <Header />
              <div id="/" className="flex-1 py-8">
                {children}
              </div>
              <Footer />
              <ScrollHandler />
            </div>
          </LanguageProvider>
        </motion.div>
      </div>
    </ThemeProvider>
  );
}

function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { scrollToSection } = useScroll();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (section: string) => {
    scrollToSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/80 flex flex-col items-center justify-center">
      <div className="flex w-full max-w-[1920px] h-14 sm:h-16 md:h-18 items-center px-3 sm:px-4 md:px-6 justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleNavClick("/")}
            className="cursor-pointer"
            aria-label="Go to top"
          >
            <BentaidevLogo />
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex gap-3 md:gap-6 ml-3 md:ml-6">
            <button
              onClick={() => handleNavClick("skills")}
              className={cn(
                "flex items-center text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === "/#skills" && "text-foreground"
              )}
            >
              {t("navigation.skills")}
            </button>
            <button
              onClick={() => handleNavClick("experiences")}
              className={cn(
                "flex items-center text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === "/#experiences" && "text-foreground"
              )}
            >
              {t("navigation.experiences")}
            </button>
            <button
              onClick={() => handleNavClick("projects")}
              className={cn(
                "flex items-center text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === "/#projects" && "text-foreground"
              )}
            >
              {t("navigation.projects")}
            </button>
            <button
              onClick={() => handleNavClick("contact")}
              className={cn(
                "flex items-center text-xs sm:text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                pathname === "/#contact" && "text-foreground"
              )}
            >
              {t("navigation.contact")}
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
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
      />
    </header>
  );
}

const BentaidevLogo = () => {
  return (
    <div className="inline-flex items-center justify-center">
      <div className="text-2xl font-bold tracking-wider flex items-center">
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

  return (
    <footer className="w-full hidden md:flex items-center justify-center border-t py-6 md:py-0">
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
  );
}

function ScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Only run this on the home page
    if (pathname !== "/") return;

    // Check if there's a hash in the URL
    if (window.location.hash) {
      // Get the element ID from the hash
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);

      // If the element exists, scroll to it after a short delay
      // The delay ensures the page has fully loaded
      if (element) {
        setTimeout(() => {
          // Get the header height to offset the scroll position
          const headerHeight =
            document.querySelector("header")?.offsetHeight || 0;

          // Calculate the element's position relative to the viewport
          const elementPosition = element.getBoundingClientRect().top;

          // Calculate the absolute position by adding the current scroll position
          const offsetPosition =
            elementPosition + window.pageYOffset - headerHeight;

          // Scroll to the element with the calculated offset
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
