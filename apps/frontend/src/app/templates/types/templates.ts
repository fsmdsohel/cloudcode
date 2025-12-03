import { LucideIcon } from "lucide-react";

export interface Library {
  id: string;
  name: string;
  description: string;
  version?: string;
  recommended?: boolean;
}

export interface Template {
  name: string;
  languages: string[];
  libraries: Library[];
  color: string;
  icon: LucideIcon;
}

export interface LanguageConfig {
  name: string;
  description: string;
  color: string;
}

export interface CategoryConfig {
  id: string;
  name: string;
  description: string;
  color: string;
  templateIds: string[];
}

export interface WorkspaceConfig {
  name: string;
  language: string;
  libraries: string[];
  template: string;
}
