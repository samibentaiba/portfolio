"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  Clock,
  RefreshCw,
  Users,
  Trash2,
  UserPlus,
  Smartphone,
  Copy,
  Check,
  ArrowLeft,
  Shield,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ExtensionUser {
  uid: string;
  email: string;
  isActivated: boolean;
  deviceId?: string;
  createdAt: string;
  lastSignInTime: string | null;
}

interface ExtensionUsersClientProps {
  user: {
    email: string;
    name: string;
  };
}

export default function ExtensionUsersClient({
  user,
}: ExtensionUsersClientProps) {
  const [users, setUsers] = useState<ExtensionUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Add user form
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activateOnCreate, setActivateOnCreate] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Copy state
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<ExtensionUser | null>(
    null
  );

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/extension/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        showMessage(data.error || "Failed to fetch users", "error");
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showMessage("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const copyToClipboard = (text: string, email: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Create user
  const handleCreateUser = async (activate: boolean) => {
    if (!newEmail || !newPassword) {
      showMessage("Email and password are required", "error");
      return;
    }

    setActionLoading("create");
    try {
      const res = await fetch("/api/admin/extension/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          activate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(
          `User created${activate ? " and activated" : ""}`,
          "success"
        );
        setNewEmail("");
        setNewPassword("");
        fetchUsers();
      } else {
        showMessage(data.error || "Failed to create user", "error");
      }
    } catch (error) {
      console.error("Failed to create user:", error);
      showMessage("Failed to create user", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Activate user
  const handleActivate = async (email: string) => {
    setActionLoading(email);
    try {
      const res = await fetch("/api/admin/extension/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`${email} activated`, "success");
        fetchUsers();
      } else {
        showMessage(data.error || "Failed to activate", "error");
      }
    } catch (error) {
      console.error("Failed to activate:", error);
      showMessage("Failed to activate user", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Deactivate user
  const handleDeactivate = async (email: string) => {
    setActionLoading(email);
    try {
      const res = await fetch("/api/admin/extension/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`${email} deactivated`, "success");
        fetchUsers();
      } else {
        showMessage(data.error || "Failed to deactivate", "error");
      }
    } catch (error) {
      console.error("Failed to deactivate:", error);
      showMessage("Failed to deactivate user", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Reset device
  const handleResetDevice = async (email: string) => {
    setActionLoading(email);
    try {
      const res = await fetch("/api/admin/extension/reset-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`Device reset for ${email}`, "success");
        fetchUsers();
      } else {
        showMessage(data.error || "Failed to reset device", "error");
      }
    } catch (error) {
      console.error("Failed to reset device:", error);
      showMessage("Failed to reset device", "error");
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user
  const handleDelete = async (email: string) => {
    setActionLoading(email);
    try {
      const res = await fetch("/api/admin/extension/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(`${email} deleted`, "success");
        fetchUsers();
      } else {
        showMessage(data.error || "Failed to delete", "error");
      }
    } catch (error) {
      console.error("Failed to delete:", error);
      showMessage("Failed to delete user", "error");
    } finally {
      setActionLoading(null);
      setDeleteConfirm(null);
    }
  };

  // Filter users by search
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Stats
  const stats = {
    total: users.length,
    activated: users.filter((u) => u.isActivated).length,
    pending: users.filter((u) => !u.isActivated).length,
    withDevice: users.filter((u) => u.deviceId).length,
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const truncateDeviceId = (deviceId: string) => {
    if (deviceId.length <= 16) return deviceId;
    return deviceId.substring(0, 16) + "...";
  };

  return (
    <TooltipProvider>
      <main className="flex flex-col items-center w-full min-h-screen px-4 py-12">
        <div className="w-full max-w-5xl space-y-6">
          {/* Header */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/admin"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Admin
            </Link>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  Sawa9li Extension Users
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage extension access and device locks
                </p>
              </div>
            </div>
          </motion.div>

          {/* Toast Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-3 rounded-lg text-sm ${
                  message.type === "error"
                    ? "bg-destructive/10 border border-destructive/30 text-destructive"
                    : "bg-green-500/10 border border-green-500/30 text-green-500"
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Users className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.total}</p>
                    <p className="text-xs text-muted-foreground">Total Users</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <UserCheck className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.activated}</p>
                    <p className="text-xs text-muted-foreground">Activated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Clock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Smartphone className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.withDevice}</p>
                    <p className="text-xs text-muted-foreground">
                      Device Locked
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add User Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New User
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCreateUser(true)}
                      disabled={
                        actionLoading === "create" || !newEmail || !newPassword
                      }
                      className="bg-green-600 hover:bg-green-500 text-white whitespace-nowrap"
                    >
                      {actionLoading === "create" ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Add & Activate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleCreateUser(false)}
                      disabled={
                        actionLoading === "create" || !newEmail || !newPassword
                      }
                      className="whitespace-nowrap"
                    >
                      Add Only
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="checkbox"
                    id="activateOnCreate"
                    checked={activateOnCreate}
                    onChange={(e) => setActivateOnCreate(e.target.checked)}
                    className="rounded border-muted-foreground/50"
                  />
                  <label
                    htmlFor="activateOnCreate"
                    className="text-sm text-muted-foreground"
                  >
                    Auto-activate when using &ldquo;Add & Activate&rdquo;
                  </label>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Users List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">
                All Users ({filteredUsers.length})
              </h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Input
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 sm:w-64"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                </Button>
              </div>
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Loading users...</p>
                </CardContent>
              </Card>
            ) : filteredUsers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  {searchQuery
                    ? "No users match your search"
                    : "No extension users found"}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((extUser, index) => (
                  <motion.div
                    key={extUser.uid}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <Card
                      className={`transition-colors ${
                        actionLoading === extUser.email ? "opacity-70" : ""
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* User Info */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Email with copy */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="font-medium flex items-center gap-1.5 hover:text-primary transition-colors"
                                    onClick={() =>
                                      copyToClipboard(
                                        extUser.email,
                                        extUser.email
                                      )
                                    }
                                  >
                                    {extUser.email}
                                    {copiedEmail === extUser.email ? (
                                      <Check className="w-3.5 h-3.5 text-green-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                                    )}
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>Click to copy</TooltipContent>
                              </Tooltip>

                              {/* Status Badge */}
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  extUser.isActivated
                                    ? "border-green-500 text-green-600 dark:text-green-400"
                                    : "border-yellow-500 text-yellow-600 dark:text-yellow-400"
                                }`}
                              >
                                {extUser.isActivated ? (
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                ) : (
                                  <Clock className="w-3 h-3 mr-1" />
                                )}
                                {extUser.isActivated ? "Active" : "Pending"}
                              </Badge>

                              {/* Device ID Badge */}
                              {extUser.deviceId && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge
                                      variant="secondary"
                                      className="text-xs cursor-pointer"
                                      onClick={() =>
                                        copyToClipboard(
                                          extUser.deviceId!,
                                          extUser.email + "-device"
                                        )
                                      }
                                    >
                                      <Smartphone className="w-3 h-3 mr-1" />
                                      {truncateDeviceId(extUser.deviceId)}
                                      {copiedEmail ===
                                      extUser.email + "-device" ? (
                                        <Check className="w-3 h-3 ml-1 text-green-500" />
                                      ) : (
                                        <Copy className="w-3 h-3 ml-1" />
                                      )}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-md break-all">
                                    <p className="font-mono text-xs">
                                      {extUser.deviceId}
                                    </p>
                                    <p className="text-muted-foreground mt-1">
                                      Click to copy
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>

                            {/* Dates */}
                            <div className="text-xs text-muted-foreground">
                              Registered: {formatDate(extUser.createdAt)}
                              {" • "}
                              Last login: {formatDate(extUser.lastSignInTime)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2">
                            {extUser.isActivated ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeactivate(extUser.email)}
                                disabled={actionLoading === extUser.email}
                                className="border-yellow-500/50 text-yellow-600 hover:bg-yellow-500/10 dark:text-yellow-400"
                              >
                                {actionLoading === extUser.email ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <UserX className="w-4 h-4 mr-1" />
                                )}
                                Deactivate
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleActivate(extUser.email)}
                                disabled={actionLoading === extUser.email}
                                className="bg-green-600 hover:bg-green-500 text-white"
                              >
                                {actionLoading === extUser.email ? (
                                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                ) : (
                                  <UserCheck className="w-4 h-4 mr-1" />
                                )}
                                Activate
                              </Button>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    handleResetDevice(extUser.email)
                                  }
                                  disabled={
                                    actionLoading === extUser.email ||
                                    !extUser.deviceId
                                  }
                                  className={
                                    !extUser.deviceId ? "opacity-50" : ""
                                  }
                                >
                                  {actionLoading === extUser.email ? (
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                  ) : (
                                    <Smartphone className="w-4 h-4 mr-1" />
                                  )}
                                  Reset Device
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {extUser.deviceId
                                  ? "Clear device lock - allows user to login on a new device"
                                  : "No device registered"}
                              </TooltipContent>
                            </Tooltip>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDeleteConfirm(extUser)}
                              disabled={actionLoading === extUser.email}
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
          </motion.div>

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

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteConfirm}
          onOpenChange={() => setDeleteConfirm(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">
                  {deleteConfirm?.email}
                </span>
                ? This will permanently remove the user from Firebase Auth and
                all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() =>
                  deleteConfirm && handleDelete(deleteConfirm.email)
                }
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </TooltipProvider>
  );
}
