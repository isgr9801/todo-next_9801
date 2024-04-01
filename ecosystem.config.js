module.exports = {
  apps : [{
    name: 'todo-next_9801',
    script: 'npm',
    args: 'start',
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }],
};