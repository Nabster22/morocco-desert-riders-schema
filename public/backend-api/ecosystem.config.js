/**
 * ==============================================
 * PM2 Configuration for Morocco Desert Riders API
 * ==============================================
 * 
 * PM2 is a production process manager for Node.js
 * 
 * Installation:
 *   npm install -g pm2
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 start ecosystem.config.js --env production
 *   pm2 reload ecosystem.config.js
 *   pm2 stop morocco-api
 *   pm2 logs morocco-api
 *   pm2 monit
 * 
 * Startup (auto-restart on reboot):
 *   pm2 startup
 *   pm2 save
 */

module.exports = {
  apps: [
    {
      // Application name
      name: 'morocco-api',
      
      // Script to run
      script: 'src/server.js',
      
      // Working directory
      cwd: '/home/username/api', // UPDATE THIS PATH
      
      // Number of instances (cluster mode)
      // Use 'max' for all CPU cores, or specific number
      instances: 1,
      
      // Execution mode
      exec_mode: 'fork', // Use 'cluster' for multiple instances
      
      // Auto-restart
      autorestart: true,
      
      // Watch for file changes (disable in production)
      watch: false,
      
      // Max memory before restart (150MB)
      max_memory_restart: '150M',
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      
      // Production environment
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      
      // Log configuration
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: '/home/username/logs/api-error.log',
      out_file: '/home/username/logs/api-out.log',
      merge_logs: true,
      
      // Restart policy
      exp_backoff_restart_delay: 100,
      
      // Kill timeout
      kill_timeout: 5000,
      
      // Graceful shutdown
      wait_ready: true,
      listen_timeout: 10000,
      
      // Node.js arguments
      node_args: [
        '--max-old-space-size=256' // Limit memory usage
      ]
    }
  ],
  
  // Deployment configuration (optional)
  deploy: {
    production: {
      // SSH user
      user: 'username',
      
      // SSH host
      host: 'yourdomain.com',
      
      // Git reference
      ref: 'origin/main',
      
      // Git repository
      repo: 'git@github.com:yourusername/morocco-desert-riders-api.git',
      
      // Deployment path
      path: '/home/username/api',
      
      // Pre-deploy commands
      'pre-deploy-local': '',
      
      // Post-deploy commands
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      
      // Pre-setup commands
      'pre-setup': ''
    }
  }
};
