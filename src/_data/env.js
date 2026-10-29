// Netlify sets CONTEXT to "production", "deploy-preview" or "branch-deploy". Locally it is unset.
export default {
  context: process.env.CONTEXT || "local",
};
