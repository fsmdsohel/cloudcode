import { WorkspaceConfig } from "../types/workspace";
import logger from "@/utils/logger";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

export class TemplateService {
  private readonly templatesPath: string;

  constructor() {
    this.templatesPath =
      process.env.TEMPLATES_PATH || path.join(__dirname, "../../templates");
  }

  async initializeTemplate(config: WorkspaceConfig): Promise<string> {
    try {
      const templatePath = this.getTemplatePath(config.template);
      const workspacePath = path.join(
        process.env.WORKSPACES_PATH || "workspaces",
        config.name
      );

      // Create workspace directory
      await fs.mkdir(workspacePath, { recursive: true });

      // Copy template files
      await this.copyTemplateFiles(templatePath, workspacePath);

      // Configure language-specific settings
      await this.configureLanguage(workspacePath, config.language);

      // Install selected libraries
      await this.installLibraries(
        workspacePath,
        config.libraries,
        config.language
      );

      // Initialize git repository
      await this.initializeGit(workspacePath);

      logger.info(
        `Template initialized successfully for workspace: ${config.name}`
      );
      return workspacePath;
    } catch (error) {
      logger.error(`Failed to initialize template: ${error}`);
      throw new Error(`Template initialization failed: ${error}`);
    }
  }

  private getTemplatePath(templateName: string): string {
    return path.join(this.templatesPath, templateName);
  }

  private async copyTemplateFiles(
    templatePath: string,
    workspacePath: string
  ): Promise<void> {
    try {
      // Read template directory
      const files = await fs.readdir(templatePath, { withFileTypes: true });

      for (const file of files) {
        const srcPath = path.join(templatePath, file.name);
        const destPath = path.join(workspacePath, file.name);

        if (file.isDirectory()) {
          await fs.mkdir(destPath, { recursive: true });
          await this.copyTemplateFiles(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }
    } catch (error) {
      throw new Error(`Failed to copy template files: ${error}`);
    }
  }

  private async configureLanguage(
    workspacePath: string,
    language: string
  ): Promise<void> {
    try {
      const configPath = path.join(workspacePath, "language.config.json");
      const config = {
        language,
        version: await this.getLanguageVersion(language),
        timestamp: new Date().toISOString(),
      };

      await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    } catch (error) {
      throw new Error(`Failed to configure language: ${error}`);
    }
  }

  private async getLanguageVersion(language: string): Promise<string> {
    const versionCommands: Record<string, string> = {
      typescript: "tsc --version",
      javascript: "node --version",
      python: "python --version",
      java: "java --version",
    };

    try {
      const command = versionCommands[language];
      if (!command) return "unknown";

      const { stdout } = await execAsync(command);
      return stdout.trim();
    } catch (error) {
      return "unknown";
    }
  }

  private async installLibraries(
    workspacePath: string,
    libraries: string[],
    language: string
  ): Promise<void> {
    const packageManagers: Record<string, string> = {
      typescript: "npm",
      javascript: "npm",
      python: "pip",
      java: "mvn",
    };

    const packageManager = packageManagers[language];
    if (!packageManager) {
      throw new Error(`Unsupported language: ${language}`);
    }

    try {
      for (const library of libraries) {
        const command = this.getInstallCommand(packageManager, library);
        await execAsync(command, { cwd: workspacePath });
        logger.info(`Installed library: ${library}`);
      }
    } catch (error) {
      throw new Error(`Failed to install libraries: ${error}`);
    }
  }

  private getInstallCommand(packageManager: string, library: string): string {
    const commands: Record<string, string> = {
      npm: `npm install ${library}`,
      pip: `pip install ${library}`,
      mvn: `mvn dependency:get -Dartifact=${library}`,
    };

    return commands[packageManager] || "";
  }

  private async initializeGit(workspacePath: string): Promise<void> {
    try {
      await execAsync("git init", { cwd: workspacePath });
      await execAsync("git add .", { cwd: workspacePath });
      await execAsync('git commit -m "Initial commit"', { cwd: workspacePath });
      logger.info("Git repository initialized");
    } catch (error) {
      logger.warn(`Failed to initialize git repository: ${error}`);
    }
  }
}

export default new TemplateService();
