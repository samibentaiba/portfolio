import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      avatar?: string | null;
      theme?: string;
      sidebarAutoCollapse?: boolean;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    avatar?: string | null;
    theme?: string;
    sidebarAutoCollapse?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    avatar?: string | null;
    theme?: string;
    sidebarAutoCollapse?: boolean;
  }
}
