"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Copy,
  RefreshCw,
  ExternalLink,
  Users,
  Trash2,
  UserPlus,
} from "lucide-react";
import { motion } from "framer-motion";

interface ProjectAccess {
  id: string;
  slug: string;
  name: string;
  status: string;
  apiKey: string;
  response: string | null;
  message: string | null;
  lastCheck: string | null;
  createdAt: string;
}

interface AvailableProject {
  slug: string;
  title: string;
  liveUrl: string | null;
}

interface Sawa9liUser {
  id: string;
  email: string;
  isActivated: boolean;
  createdAt: string;
  lastLogin: string;
}

interface AdminClientProps {
  user: {
    email: string;
    name: string;
  };
  initialProjects: ProjectAccess[];
  availableProjects: AvailableProject[];
  initialSawa9liUsers: Sawa9liUser[];
}

export default function AdminClient({
  user,
  initialProjects,
  availableProjects,
  initialSawa9liUsers,
}: AdminClientProps) {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectAccess[]>(initialProjects);
  const [sawa9liUsers, setSawa9liUsers] =
    useState<Sawa9liUser[]>(initialSawa9liUsers);
  const [message, setMessage] = useState<string | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (slug: string, action: "accept" | "reject") => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Project "${slug}" ${action}ed successfully`);
        fetchProjects();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Failed: ${error}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const copySlug = (slug: string) => {
    const url = `${window.location.origin}/api/admin/verify?slug=${slug}`;
    navigator.clipboard.writeText(url);
    setMessage("API URL copied to clipboard");
    setTimeout(() => setMessage(null), 2000);
  };

  const addProject = async (slug: string, name: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`Project "${name}" added`);
        fetchProjects();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Failed: ${error}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const fetchSawa9liUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sawa9li-users");
      const data = await res.json();
      if (data.success) {
        setSawa9liUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch Sawa9li users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = async (
    userId: string,
    action: "activate" | "deactivate"
  ) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/sawa9li-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`User ${action}d successfully`);
        fetchSawa9liUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Failed: ${error}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/sawa9li-users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`User "${email}" deleted`);
        fetchSawa9liUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Failed: ${error}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const createUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      setMessage("Error: Email and password are required");
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/sawa9li-users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          isActivated: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`User "${newUserEmail}" created and activated`);
        setNewUserEmail("");
        setNewUserPassword("");
        fetchSawa9liUsers();
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Failed: ${error}`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <main className="flex flex-col items-center w-full min-h-screen px-4 py-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter">
            Project Access Control
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage access for your portfolio projects
          </p>
        </motion.div>

        {/* Toast Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-md text-sm text-center ${
              message.includes("Error") || message.includes("Failed")
                ? "bg-destructive/10 border border-destructive/30 text-destructive"
                : "bg-primary/10 border border-primary/30 text-primary"
            }`}
          >
            {message}
          </motion.div>
        )}

        {/* Registered Projects */}
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tighter">
              Registered Projects
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchProjects}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No projects registered yet. Add one from below.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{project.name}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                project.status === "accepted"
                                  ? "border-green-500 text-green-600 dark:text-green-400"
                                  : project.status === "rejected"
                                  ? "border-destructive text-destructive"
                                  : "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                              }`}
                            >
                              {project.status === "accepted" && (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              )}
                              {project.status === "rejected" && (
                                <XCircle className="w-3 h-3 mr-1" />
                              )}
                              {project.status === "pending" && (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              /api/admin/verify?slug={project.slug}
                            </code>
                            <button
                              onClick={() => copySlug(project.slug)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              title="Copy API URL"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAction(project.slug, "accept")}
                            disabled={loading || project.status === "accepted"}
                            className="bg-green-600 hover:bg-green-500 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(project.slug, "reject")}
                            disabled={loading || project.status === "rejected"}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Add Projects */}
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold tracking-tighter">
            Add from Portfolio
          </h2>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {availableProjects
                  .filter((p) => !projects.find((rp) => rp.slug === p.slug))
                  .slice(0, 9)
                  .map((project) => (
                    <div
                      key={project.slug}
                      className="flex items-center justify-between gap-2 p-2 rounded-md bg-muted/50"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm truncate">
                          {project.title}
                        </span>
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-primary flex-shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addProject(project.slug, project.title)}
                        disabled={loading}
                        className="flex-shrink-0"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Sawa9li Extension Users */}
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold tracking-tighter">
                Sawa9li Extension Users
              </h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSawa9liUsers}
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Create User Form */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={createUser}
                  disabled={loading || !newUserEmail || !newUserPassword}
                  className="bg-primary"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </Button>
              </div>
            </CardContent>
          </Card>

          {sawa9liUsers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No Sawa9li extension users registered yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sawa9liUsers.map((sUser, index) => (
                <motion.div
                  key={sUser.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{sUser.email}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                sUser.isActivated
                                  ? "border-green-500 text-green-600 dark:text-green-400"
                                  : "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                              }`}
                            >
                              {sUser.isActivated ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <Clock className="w-3 h-3 mr-1" />
                              )}
                              {sUser.isActivated ? "Active" : "Pending"}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Registered:{" "}
                            {new Date(sUser.createdAt).toLocaleDateString()}
                            {" • "}
                            Last login:{" "}
                            {new Date(sUser.lastLogin).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {sUser.isActivated ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleUserAction(sUser.id, "deactivate")
                              }
                              disabled={loading}
                              className="border-yellow-500 text-yellow-600 hover:bg-yellow-500/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUserAction(sUser.id, "activate")
                              }
                              disabled={loading}
                              className="bg-green-600 hover:bg-green-500 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleDeleteUser(sUser.id, sUser.email)
                            }
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>

        {/* API Info */}
        <motion.section
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold tracking-tighter">API Usage</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Projects verify access by calling (no API key needed):
              </p>
              <code className="block bg-muted p-3 rounded-md text-sm">
                GET /api/admin/verify?slug=your-project-slug
              </code>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="text-green-500">✓ Accepted:</span>{" "}
                  <code className="bg-muted px-1 rounded">{`{ allowed: true, response: "yes" }`}</code>
                </p>
                <p>
                  <span className="text-red-500">✗ Rejected:</span>{" "}
                  <code className="bg-muted px-1 rounded">{`{ allowed: false, destroy: true }`}</code>
                </p>
                <p>
                  <span className="text-yellow-500">⏳ Pending:</span>{" "}
                  <code className="bg-muted px-1 rounded">{`{ allowed: false, response: "pending" }`}</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Footer */}
        <motion.p
          className="text-center text-sm text-muted-foreground pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Logged in as {user.email}
        </motion.p>
      </div>
    </main>
  );
}
