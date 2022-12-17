#!/usr/bin/env bash
git pull 
npm ci
sudo service pm2-ubuntu restart