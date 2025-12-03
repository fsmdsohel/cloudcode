export const kubernetesConfig = {
  resources: {
    default: {
      cpu: {
        request: "500m",
        limit: "1000m",
      },
      memory: {
        request: "1Gi",
        limit: "2Gi",
      },
    },
  },
  storage: {
    size: "10Gi",
    className: "standard",
  },
  containers: {
    port: 3000,
    mountPath: "/workspace",
  },
  images: {
    react: {
      typescript: "cloudcode/react-typescript:latest",
      javascript: "cloudcode/react-javascript:latest",
    },
    node: {
      typescript: "cloudcode/node-typescript:latest",
      javascript: "cloudcode/node-javascript:latest",
    },
    python: {
      python: "cloudcode/python:latest",
    },
    java: {
      java: "cloudcode/java:latest",
    },
    base: "cloudcode/base:latest",
  },
};
