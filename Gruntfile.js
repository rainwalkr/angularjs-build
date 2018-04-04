module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
              // define a string to put between each file in the concatenated output
              separator: ';'
            },
            appScripts: {
              // the files to concatenate
              src: [
                  'app/**/*.module.js',
                  'app/**/*.js'
                ],
              // the location of the resulting JS file
              dest: 'dist/<%= pkg.name %>.js'
            },
            vendorScripts:{
                src:[
                    'node_modules/angular/angular.js',
                    'node_modules/angular-route/angular-route.js',
                    'node_modules/angular-resource/angular-resource.js'
                ],
                dest:'dist/<%= pkg.name %>.vendor.js'
            },
            appStyles:{
                src:['app/**/*.css'],
                dest:'dist/<%= pkg.name %>.css'
            },
            vendorStyles:{
                src:[
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                ],
                dest:'dist/<%= pkg.name %>.vendor.css'
            }
          },
        uglify: {
            options: {
              // the banner is inserted at the top of the output
              sourceMap:false,
              banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            app: {
              files: {
                'dist/<%= pkg.name %>.js': ['<%= concat.appScripts.dest %>']
              }
            },
            vendor:{
                files:{
                    'dist/<%= pkg.name %>.vendor.js': ['<%= concat.vendorScripts.dest %>']
                }
            }
        },
        cssmin: {
            options: {},
            app: {
              files: {
                'dist/<%= pkg.name %>.css': ['app/**/*.css']
              }
            }
        },
        ngtemplates:  {
            app: {
              options:{
                  module:'phonecatApp',
                  htmlmin: {}
              },
              src:'app/**/*.html',
              dest:'dist/<%= pkg.name %>.templates.js',
            }
        },
        jshint:{
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
            },
            app:['app/**/*.js']
        },
        watch: {
            all: {
                files: ['app/**/*.js','app/**/*.html','app/**/*.css'],
                tasks: ['build:dev'],
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'dist/**/*.js','dist/**/*.html' 
                    ]
                },
                options: {
                    watchTask: true,
                    server:'./'
                }
            }
        }
    })
  

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('cache-templates', 'Cache HTML', function(type) {

        if (type === 'prod') {
            grunt.config.set('ngtemplates.app.options.htmlmin',{
                collapseBooleanAttributes:      true,
                collapseWhitespace:             true,
                removeAttributeQuotes:          true,
                removeComments:                 true, // Only if you don't use comment directives! 
                removeEmptyAttributes:          true,
                removeRedundantAttributes:      true,
                removeScriptTypeAttributes:     true,
                removeStyleLinkTypeAttributes:  true
            });
        }
        grunt.task.run('ngtemplates')
    });

    grunt.registerTask('build','Build Project',function(type){
        if (!type || type === 'dev') {
            grunt.task.run(['jshint','concat','cache-templates'])
        } else if (type === 'prod') {
            grunt.task.run(['concat','uglify','cssmin','cache-templates:prod'])
        }
    })

    grunt.registerTask('serve',['browserSync', 'watch']);

    grunt.registerTask('default',['build'])
    
};