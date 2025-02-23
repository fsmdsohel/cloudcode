export interface CreateWorkspaceDto {
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

export interface UpdateWorkspaceDto {
  name?: string;
  resources?: {
    cpu?: string;
    memory?: string;
  };
  status?: string;
}

export interface K8sWorkspaceDto {
  workspaceId: string;
  status: string;
}

export interface WorkspaceResponseDto {
  id: string;
  name: string;
  userId: string;
  template: string | null;
  language: string | null;
  libraries: string[];
  description: string | null;
  resources: any | null;
  status: string | null;
  editorConfig: any | null;
  editorLayout: any | null;
  createdAt: Date;
  updatedAt: Date;
}
