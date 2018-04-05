# Build Systems (grunt, gulp) for an AngualrJS App 

Basic tasks
1. Linting source files using JShint
2. Concatenating all JS and CSS files
3. Creating angular template cache for html files
4. Minifing JS and css files on production build
5. Project serving with auto-reload

### Grunt build system 
```
// Building Project
grunt build:dev
grunt build:prod

// Serve Project
grunt serve
```
### Gulp build system

```
// Building Project
gulp build
gulp build --env prod

// Serve Project
gulp serve
```