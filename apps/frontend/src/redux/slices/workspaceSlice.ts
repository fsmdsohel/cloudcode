import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Workspace {
  id: string;
  name: string;
  template: string;
  language: string;
  libraries: string[];
  description: string | null;
  ownerId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceState {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

// Create API instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
});

// Async thunks
export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/workspaces");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workspaces"
      );
    }
  }
);

export const createWorkspace = createAsyncThunk(
  "workspace/create",
  async (
    {
      name,
      template,
      language,
      libraries,
      description,
    }: {
      name: string;
      template: string;
      language: string;
      libraries: string[];
      description?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/workspaces", {
        name,
        template,
        language,
        libraries,
        description,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create workspace"
      );
    }
  }
);

export const updateWorkspace = createAsyncThunk(
  "workspace/update",
  async (
    {
      id,
      name,
      description,
    }: { id: string; name?: string; description?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/workspaces/${id}`, {
        name,
        description,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update workspace"
      );
    }
  }
);

export const deleteWorkspace = createAsyncThunk(
  "workspace/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/workspaces/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete workspace"
      );
    }
  }
);

export const getWorkspaceById = createAsyncThunk(
  "workspace/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/workspaces/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch workspace"
      );
    }
  }
);

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentWorkspace: (state, action) => {
      state.currentWorkspace = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns { status: "success", data: { workspaces: [] } }
        state.workspaces = action.payload.data.workspaces;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns { status: "success", data: { workspace: {...} } }
        const newWorkspace = action.payload.data.workspace;
        state.workspaces.push(newWorkspace);
        state.currentWorkspace = newWorkspace;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns { status: "success", data: { workspace: {...} } }
        const updatedWorkspace = action.payload.data.workspace;
        const index = state.workspaces.findIndex(
          (w) => w.id === updatedWorkspace.id
        );
        if (index !== -1) {
          state.workspaces[index] = updatedWorkspace;
        }
        if (state.currentWorkspace?.id === updatedWorkspace.id) {
          state.currentWorkspace = updatedWorkspace;
        }
      })
      .addCase(updateWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteWorkspace.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkspace.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = state.workspaces.filter(
          (w) => w.id !== action.payload
        );
        if (state.currentWorkspace?.id === action.payload) {
          state.currentWorkspace = null;
        }
      })
      .addCase(deleteWorkspace.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getWorkspaceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkspaceById.fulfilled, (state, action) => {
        state.loading = false;
        // Backend returns { status: "success", data: { workspace: {...} } }
        const workspace = action.payload.data.workspace;
        state.currentWorkspace = workspace;
        const index = state.workspaces.findIndex(
          (w) => w.id === workspace.id
        );
        if (index !== -1) {
          state.workspaces[index] = workspace;
        } else {
          state.workspaces.push(workspace);
        }
      })
      .addCase(getWorkspaceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentWorkspace } = workspaceSlice.actions;
export default workspaceSlice.reducer;
