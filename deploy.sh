#!/bin/bash

npx tsc
scp -r dist/ hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/
scp -r V1/ hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/
scp -r config.json hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/
scp -r package.json hexagontvservices@aland.s.malcolmjh.com:~/hexagontv/