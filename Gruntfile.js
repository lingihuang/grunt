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
            dest: {
                sassDir : 'sass/',
                cssDir  : 'dest/css/',
                jsDir   : 'dest/js/'
            }
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
            dest: {
                options: {
                    sassDir     : 'sass',
                    cssDir      : 'dest/css',
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
                    '<%= setting.dev.cssDir %>/layout.css' : '<%= setting.dev.sassDir %>/layout.scss',
                    '<%= setting.dev.cssDir %>/m-button.css' : '<%= setting.dev.sassDir %>/m-button.scss'
                }
                // files: [{
                //     expand: true,
                //     cwd: 'styles',
                //     src: ['sass/*.scss'],
                //     dest: 'css',
                //     ext: '.css'
                // }]
            },
            dest: {
                options: {
                    compass   : true,
                    style     : 'compressed',
                    sourcemap : 'none'
                },
                files: {
                    '<%= setting.dest.cssDir %>/layout.css' : '<%= setting.dest.sassDir %>/layout.scss',
                    '<%= setting.dest.cssDir %>/m-button.css' : '<%= setting.dest.sassDir %>/m-button.scss'
                }
            }
        },
        cssmin: {
            css: {
                src: '<%= setting.dest.cssDir %>/<%= pkg.name %>.css',
                dest: '<%= setting.dest.cssDir %>/<%= pkg.name %>.min.css'
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
        concat: {
            // options: {
            //     // define a string to put between each file in the concatenated output
            //     separator: ';'
            // },
            css: {
                src: ['css/*.css'],
                dest: '<%= setting.dest.cssDir %>/<%= pkg.name %>.css'
            },
            js: {
                // the files to concatenate
                src: ['js/*.js'],
                // the location of the resulting JS file
                dest: '<%= setting.dest.jsDir %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                // the banner is inserted at the top of the output
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dest: {
                files: {
                    '<%= setting.dest.jsDir %>/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>']
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

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['sass:dest', 'cssmin', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('dev', ['jshint', 'sass:dev']);
};
