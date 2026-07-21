#!/usr/bin/env bash
set -e
printf "Запуск локального сервера на http://localhost:8000\n"
cd "$(dirname "$0")"
python3 -m http.server 8000
