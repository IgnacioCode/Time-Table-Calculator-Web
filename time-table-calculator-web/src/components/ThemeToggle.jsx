"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mientras no estamos montados, devolvemos un placeholder
  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <Switch id="theme-toggle" disabled />
        <Label htmlFor="theme-toggle">…</Label>
      </div>
    );
  }

  const current = theme === "system" ? resolvedTheme : theme;

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-toggle"
        checked={current === "dark"}
        onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
      />
      <Label htmlFor="theme-toggle">
        {current === "dark" ? "Dark" : "Light"}
      </Label>
    </div>
  );
}
