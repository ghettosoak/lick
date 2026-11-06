#!/usr/bin/env bash
# Builds dev/ -> www/assets (JS bundle + CSS). Bypasses gulp 3, which doesn't run on modern Node.
set -euo pipefail
cd "$(dirname "$0")/dev/_gulp"
B=node_modules/.bin
L=node_modules/gulp-less/node_modules/.bin/lessc
$B/browserify ../js/totem.js -o ../../www/assets/js/totem.js
$L --source-map=../../www/assets/css/main.css.map --source-map-url=main.css.map ../less/main.less ../../www/assets/css/main.css
# stamp a build id so cached copies (e.g. iOS home screen) know to refresh
BUILD=$(date +%Y%m%d%H%M%S)
cd ../../www
echo "$BUILD" > version.txt
sed -i -E "s/window\.BUILD = \"[^\"]*\"/window.BUILD = \"$BUILD\"/; s#(totem\.js|main\.css)\?v=[A-Za-z0-9_]*#\1?v=$BUILD#" index.html
echo "built $(date -Is)"
