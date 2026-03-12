#!/bin/bash
cd '/Users/lxltmac/Downloads/educontrol---智慧校园管理系统'
export PATH="/Users/lxltmac/.nvm/versions/node/v20.0.0/bin:/usr/local/bin:/usr/bin:/bin"
export HOME="/Users/lxltmac"
export NVM_DIR="/Users/lxltmac/.nvm"

npm run dev >> /tmp/edu-deploy-current.log 2>&1 &
