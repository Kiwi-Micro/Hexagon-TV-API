#!/bin/bash

# Pre-deploy steps
# Compiles the TypeScript from the `src/` to JavaScript in to the `dist/ folder.
npx tsc

# Send files to the server.
# Copy the compiled JavaScript to the server.
scp -r dist/ hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/
# Copy the Legacy API files to the server.
scp -r V1/ hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/
# Copy the config files to the server.
scp -r config.json hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/
scp -r package.json hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/