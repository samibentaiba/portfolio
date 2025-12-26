import { LucideIcon } from "lucide-react";

export interface NavigationTab {
  label: string;
  value: string;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  href?: string;
  items?: NavigationTab[];
  roles?: string[];
}

export interface NavigationItem {
  label: string;
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  href?: string;
  roles: string[];
  tabs?: NavigationTab[];
  collapsible?: boolean;
}

export class NavigationManager {
  private pathname: string;
  private searchParams: URLSearchParams;

  constructor(
    pathname: string,
    searchParams: URLSearchParams,
    _userRole?: string
  ) {
    void _userRole; // Reserved for future role-based navigation
    this.pathname = pathname;
    this.searchParams = searchParams;
  }

  /**
   * Determines if a navigation item should be active.
   * Uses strict matching to ensure only one item is active at a time.
   */
  public isItemActive(item: NavigationItem): boolean {
    const itemHrefPath = item.href?.split("?")[0];

    if (itemHrefPath) {
      // Dashboard: exact match only
      if (itemHrefPath === "/dashboard") {
        return this.pathname === itemHrefPath;
      }

      // Admin: special handling for sub-routes
      // /admin should NOT be active when on /admin/website-settings
      if (itemHrefPath === "/admin") {
        // Only active if exactly /admin or /admin with query params
        return this.pathname === "/admin";
      }

      // For routes like /production, /finance, /stock, /analytics
      // Active if pathname matches exactly OR pathname starts with href + query param context
      if (this.pathname === itemHrefPath) {
        return true;
      }

      // For dynamic routes like /uap/[id], allow sub-path matching
      if (this.pathname.startsWith(itemHrefPath + "/")) {
        return true;
      }

      return false;
    }

    // If no href (like Admin without href), check if any child tab is active
    return (
      item.tabs?.some((tab) => this.isTabActiveForItem(tab, item)) || false
    );
  }

  /**
   * Check if a tab is active within the context of its parent item.
   */
  public isTabActiveForItem(
    tab: NavigationTab,
    parentItem: NavigationItem
  ): boolean {
    const currentTab = this.searchParams.get("tab");
    const tabHrefPath = tab.href?.split("?")[0];

    // If tab has nested items, check if any of them are active
    if (tab.items) {
      const childActive = tab.items.some((subTab) => {
        if (currentTab && currentTab === subTab.value) return true;
        const subHrefPath = subTab.href?.split("?")[0];
        if (subHrefPath && this.pathname.startsWith(subHrefPath)) return true;
        return false;
      });
      if (childActive) return true;
    }

    // Check tab query param match
    if (currentTab) {
      return currentTab === tab.value;
    }

    // Check specific href match
    if (tabHrefPath) {
      if (this.pathname === tabHrefPath) return true;
      // Sub-route matching, but exclude /admin to prevent /admin/website-settings matching /admin
      if (
        this.pathname.startsWith(tabHrefPath + "/") &&
        tabHrefPath !== "/admin"
      ) {
        return true;
      }
    }

    // Default to "overview" if we're on the parent route with no tab param
    if (!currentTab && tab.value === "overview" && parentItem.href) {
      const parentHrefPath = parentItem.href.split("?")[0];
      return this.pathname === parentHrefPath;
    }

    return false;
  }

  /**
   * Check if a sub-tab is specifically active (for nested menus).
   */
  public isSubTabActive(subTab: NavigationTab): boolean {
    const currentTab = this.searchParams.get("tab");
    if (currentTab) {
      return currentTab === subTab.value;
    }
    if (subTab.href) {
      const subTabHrefPath = subTab.href.split("?")[0];
      return this.pathname === subTabHrefPath;
    }
    return false;
  }
}
