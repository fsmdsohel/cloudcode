import { Wand2 } from "lucide-react";
import { Template, LanguageConfig, CategoryConfig } from "../types/templates";

export const languageConfigs: Record<string, LanguageConfig> = {
  typescript: {
    name: "TypeScript",
    description: "Statically typed JavaScript variant",
    color: "text-blue-400",
  },
  javascript: {
    name: "JavaScript",
    description: "Standard JavaScript implementation",
    color: "text-yellow-400",
  },
  python: {
    name: "Python",
    description: "High-level programming language",
    color: "text-green-400",
  },
  java: {
    name: "Java",
    description: "Object-oriented programming language",
    color: "text-red-400",
  },
  php: {
    name: "PHP",
    description: "Server-side scripting language",
    color: "text-purple-400",
  },
  sql: {
    name: "SQL",
    description: "Database query language",
    color: "text-orange-400",
  },
};

export const templates: Record<string, Template> = {
  react: {
    name: "React",
    languages: ["javascript", "typescript"],
    libraries: [
      {
        id: "tailwind",
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        recommended: true,
      },
      {
        id: "eslint",
        name: "ESLint",
        description: "JavaScript linting utility",
        recommended: true,
      },
      {
        id: "prettier",
        name: "Prettier",
        description: "Code formatter",
        recommended: true,
      },
      {
        id: "jest",
        name: "Jest",
        description: "Testing framework",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  next: {
    name: "Next.js",
    languages: ["javascript", "typescript"],
    libraries: [
      {
        id: "tailwind",
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        recommended: true,
      },
      {
        id: "prisma",
        name: "Prisma",
        description: "Database ORM",
        recommended: true,
      },
      {
        id: "auth",
        name: "NextAuth.js",
        description: "Authentication solution",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  vue: {
    name: "Vue.js",
    languages: ["javascript", "typescript"],
    libraries: [
      {
        id: "tailwind",
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        recommended: true,
      },
      {
        id: "vuex",
        name: "Vuex",
        description: "State management",
        recommended: true,
      },
      {
        id: "vitest",
        name: "Vitest",
        description: "Testing framework",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  node: {
    name: "Node.js",
    languages: ["javascript", "typescript"],
    libraries: [
      {
        id: "express",
        name: "Express.js",
        description: "Web application framework",
        recommended: true,
      },
      {
        id: "mongoose",
        name: "Mongoose",
        description: "MongoDB object modeling",
      },
      {
        id: "typeorm",
        name: "TypeORM",
        description: "SQL/NoSQL ORM",
      },
      {
        id: "jest",
        name: "Jest",
        description: "Testing framework",
        recommended: true,
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  python: {
    name: "Python",
    languages: ["python"],
    libraries: [
      {
        id: "flask",
        name: "Flask",
        description: "Micro web framework",
        recommended: true,
      },
      {
        id: "django",
        name: "Django",
        description: "Full-stack framework",
      },
      {
        id: "sqlalchemy",
        name: "SQLAlchemy",
        description: "Database toolkit",
        recommended: true,
      },
      {
        id: "pytest",
        name: "pytest",
        description: "Testing framework",
        recommended: true,
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  java: {
    name: "Java",
    languages: ["java"],
    libraries: [
      {
        id: "spring",
        name: "Spring Boot",
        description: "Enterprise framework",
        recommended: true,
      },
      {
        id: "hibernate",
        name: "Hibernate",
        description: "ORM framework",
        recommended: true,
      },
      {
        id: "junit",
        name: "JUnit",
        description: "Testing framework",
        recommended: true,
      },
      {
        id: "maven",
        name: "Maven",
        description: "Build automation",
        recommended: true,
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  mern: {
    name: "MERN Stack",
    languages: ["javascript", "typescript"],
    libraries: [
      {
        id: "express",
        name: "Express.js",
        description: "Backend framework",
        recommended: true,
      },
      {
        id: "mongoose",
        name: "Mongoose",
        description: "MongoDB ORM",
        recommended: true,
      },
      {
        id: "redux",
        name: "Redux",
        description: "State management",
        recommended: true,
      },
      {
        id: "jest",
        name: "Jest",
        description: "Testing framework",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  lamp: {
    name: "LAMP Stack",
    languages: ["php"],
    libraries: [
      {
        id: "laravel",
        name: "Laravel",
        description: "PHP framework",
        recommended: true,
      },
      {
        id: "mysql",
        name: "MySQL",
        description: "Relational database",
        recommended: true,
      },
      {
        id: "phpunit",
        name: "PHPUnit",
        description: "Testing framework",
      },
      {
        id: "composer",
        name: "Composer",
        description: "Dependency manager",
        recommended: true,
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  postgres: {
    name: "PostgreSQL",
    languages: ["sql"],
    libraries: [
      {
        id: "pg",
        name: "node-postgres",
        description: "PostgreSQL client",
        recommended: true,
      },
      {
        id: "typeorm",
        name: "TypeORM",
        description: "TypeScript ORM",
        recommended: true,
      },
      {
        id: "prisma",
        name: "Prisma",
        description: "Database toolkit",
      },
      {
        id: "dbeaver",
        name: "DBeaver",
        description: "Database GUI",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  mongodb: {
    name: "MongoDB",
    languages: ["javascript"],
    libraries: [
      {
        id: "mongoose",
        name: "Mongoose",
        description: "ODM library",
        recommended: true,
      },
      {
        id: "mongosh",
        name: "Mongo Shell",
        description: "CLI interface",
        recommended: true,
      },
      {
        id: "compass",
        name: "Compass",
        description: "GUI interface",
      },
      {
        id: "atlas",
        name: "Atlas",
        description: "Cloud service",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  mysql: {
    name: "MySQL",
    languages: ["sql"],
    libraries: [
      {
        id: "mysql2",
        name: "MySQL2",
        description: "MySQL client",
        recommended: true,
      },
      {
        id: "typeorm",
        name: "TypeORM",
        description: "TypeScript ORM",
        recommended: true,
      },
      {
        id: "sequelize",
        name: "Sequelize",
        description: "ORM for Node.js",
      },
      {
        id: "workbench",
        name: "MySQL Workbench",
        description: "Database GUI",
      },
    ],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
  custom: {
    name: "Custom",
    languages: [],
    libraries: [],
    color: "bg-primary-purple-400",
    icon: Wand2,
  },
};

export const categories: CategoryConfig[] = [
  {
    id: "frontend",
    name: "Frontend Development",
    description:
      "Create modern web applications with popular frontend frameworks",
    color: "from-blue-500 to-indigo-500",
    templateIds: ["react", "next", "vue"],
  },
  {
    id: "backend",
    name: "Backend Development",
    description: "Build robust server-side applications and APIs",
    color: "from-emerald-500 to-green-500",
    templateIds: ["node", "python", "java"],
  },
  {
    id: "fullstack",
    name: "Full-Stack Apps",
    description: "Complete solutions for end-to-end application development",
    color: "from-purple-500 to-pink-500",
    templateIds: ["mern", "lamp"],
  },
  {
    id: "database",
    name: "Database Projects",
    description: "Set up and manage different types of databases",
    color: "from-orange-500 to-red-500",
    templateIds: ["postgres", "mongodb", "mysql"],
  },
];
