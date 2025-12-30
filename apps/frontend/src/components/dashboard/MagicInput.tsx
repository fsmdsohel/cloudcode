import React, { useState } from "react";
import { Wand2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";

export const MagicInput = () => {
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleMagicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            // 1. Create a workspace
            const workspaceName = `ai-app-${Math.random().toString(36).substring(7)}`;
            const createRes = await axios.post("/api/v1/workspace", {
                name: workspaceName,
                template: "node", // Default to node for generic agent projects for now
                language: "javascript",
                resources: { cpu: 500, memory: 512 }
            });

            const workspaceId = createRes.data.data.workspaceId;

            // 2. Trigger Agent
            await axios.post("/api/v1/agent/generate", {
                workspaceId,
                prompt
            });

            // 3. Redirect
            toast.success("Agent started! Redirecting to workspace...");
            router.push(`/workspaces/${workspaceId}`);

        } catch (error: any) {
            console.error(error);
            toast.error("Failed to start magic generation");
            setLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-xl border border-purple-200 dark:border-purple-500/30 bg-gradient-to-br from-purple-50 to-white dark:from-purple-500/10 dark:to-[#0F1117] p-8 mb-8">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Powered</span>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    What do you want to build?
                </h2>

                <p className="text-gray-600 dark:text-gray-300 transform -translate-y-2">
                    Describe your dream application, and I'll code it for you.
                </p>

                <form onSubmit={handleMagicSubmit} className="relative max-w-xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A real-time chat app with React and Socket.io..."
                                className="block w-full p-4 pr-12 text-gray-900 border border-gray-200 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none shadow-lg text-lg"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading || !prompt.trim()}
                                className="absolute right-2 p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Try: "A snake game in Python"</span>
                    <span>•</span>
                    <span>"A todo list with React"</span>
                </div>
            </div>
        </div>
    );
};
