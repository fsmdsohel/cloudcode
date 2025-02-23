export interface WorkspaceConfig {
  name: string;
  template: string;
  language: string;
  libraries: string[];
  description?: string;
  resources?: {
    cpu?: string;
    memory?: string;
  };
}

export interface WorkspaceStatus {
  id: string;
  status: "creating" | "running" | "stopped" | "failed";
  createdAt: Date;
  updatedAt: Date;
  error?: string;
}

export interface WorkspaceInfo extends WorkspaceConfig {
  status: WorkspaceStatus;
  path: string;
  url?: string;
}
