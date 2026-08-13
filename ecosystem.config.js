module.exports = {
  apps: [
    {
      name: "hsr-frontend",
      script: "npm",
      args: "run start",
      cwd: "./frontend",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "hsr-backend",
      script: "npm",
      args: "run start",
      cwd: "./backend",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        // Konfigurasi db/redis disesuaikan dengan lingkungan VPS
        DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/hsr",
        REDIS_URL: "redis://localhost:6379"
      }
    }
  ]
};
