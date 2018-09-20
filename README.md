# Racing line optimization
The main goal of the project was to implement a genetic algorithm which is able to optimize the racing line on a race track for achieving the shortest possible lap times on that track. Vehicle’s speed at a given point is restricted by car parameters such as acceleration and tyre grip, as the vehicle has to slow down enough to closely follow the racing line’s curvature. Prepared data of the race track is imported from a JSON file.

## Getting started
1. Install `node` (https://nodejs.org v.9.*) and `yarn` (https://yarnpkg.com)
1. Open terminal in project directory and run command `yarn`
1. When all modules are installed run `yarn start` then the application open in default browser on port `3000`

## How to use
When the application opens in browser drop JSON file with track on the browser screen. 
The file should be imported from OpenStreetMap (example file is in src/static/tracks/shanghai.json)
