(function () {
    'use strict';
}());
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        setting: {
            dev: {
                sassDir : 'sass/',
                cssDir  : 'css/',
                jsDir   : 'js/'
            },
            dist: {
                sassDir : 'sass/',
                cssDir  : 'dist/css/',
                jsDir   : 'dist/js/'
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['js/*.js'],
                // the location of the resulting JS file
                dest: '<%= setting.dist.jsDir %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    '<%= setting.dist.jsDir %>/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        jshint: {
            // You get to make the name.
            // The paths tell JSHint which files to validate.
            files: ['Gruntfile.js', 'js/*.js'],
            options: {
                globals: {
                    jQuery   : true,
                    console  : true,
                    module   : true,
                    document : true,
                },
                // undef  : true,
                // unused : true,
                // predef : ['$'],
                eqeqeq : true
            }
            // options: {
            //   jshintrc: '.jshintrc'
            // }
        },
        compass: {
            dev: {
                options: {
                    sassDir     : 'sass',
                    cssDir      : 'css',
                    environment : 'development',
                    outputStyle : 'expanded'
                }
            },
            dist: {
                options: {
                    sassDir     : 'sass',
                    cssDir      : 'dist/css',
                    environment : 'production',
                    outputStyle : 'compressed'
                }
            }
        },
        // Cannot load compass.
        // gem install compass --pre
        sass: {
            dev: {
                options: {
                    compass   : true,
                    style     : 'expanded',
                    sourcemap : 'none'
                },
                files: {
                    '<%= setting.dev.cssDir %>/style.css' : '<%= setting.dev.sassDir %>/style.scss'
                }
            },
            dist: {
                options: {
                    compass   : true,
                    style     : 'compressed',
                    sourcemap : 'none'
                },
                files: {
                    '<%= setting.dist.cssDir %>/style.css' : '<%= setting.dist.sassDir %>/style.scss'
                }
            }
        },
        // watch: {
        //     files: ['<%= jshint.files %>', 'assets/scss/**/*.scss'],
        //     tasks: ['concat', 'uglify', 'jshint', 'compass']
        // }
        watch: {
            css: {
                files: ['sass/*.scss'],
                tasks: ['sass:dev'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['js/*.js'],
                tasks: ['jshint'],
                options: {
                    spawn: false
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'sass:dist']);
    grunt.registerTask('dev', ['jshint', 'sass:dev']);
};
