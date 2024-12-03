#!/bin/bash
set -euo pipefail

filepath=/etc/cron.d/clean-news-batch

sudo rm -f $filepath
sudo touch $filepath
sudo chmod 644 $filepath

echo 'SHELL=/bin/bash' | sudo tee -a $filepath
echo 'MAILTO=""' | sudo tee -a $filepath
echo "0 0,6,12,18 * * * $(whoami) cd $(pwd);source .env;$(which poetry) install;$(which poetry) run python3 src/main.py | tee batch.log" | sudo tee -a $filepath
