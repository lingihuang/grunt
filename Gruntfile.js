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
                cssDir  : 'dist/css/',
                jsDir   : 'dist/js/'
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
                // files: {
                //     '<%= setting.dev.cssDir %>/layout.css' : '<%= setting.dev.sassDir %>/layout.scss',
                //     '<%= setting.dev.cssDir %>/m-button.css' : '<%= setting.dev.sassDir %>/m-button.scss'
                // }
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.scss'],
                    dest: 'css',
                    ext: '.css'
                }]
            },
            dest: {
                options: {
                    compass   : true,
                    style     : 'compressed',
                    sourcemap : 'none'
                },
                // files: {
                //     '<%= setting.dest.cssDir %>/layout.css' : '<%= setting.dest.sassDir %>/layout.scss',
                //     '<%= setting.dest.cssDir %>/m-button.css' : '<%= setting.dest.sassDir %>/m-button.scss'
                // }
                files: [{
                    expand: true,
                    cwd: 'sass',
                    src: ['*.scss'],
                    dest: 'dist/css',
                    ext: '.css'
                }]
            },
            compile: {

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
        requirejs: {
            compile: {
                options: {
                    baseUrl: 'js',
                    //mainConfigFile: "path/to/config.js",
                    //name: 'almond', // assumes a production build using almond
                    paths: {
                        'd': 'detail',
                        'm': 'me'
                    },
                    include: ['d', 'me'],
                    out: 'dist/js/combo.js'
                }
            }
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
        imagemin: {
            options: {
                optimizationLevel: 3
            },
            files: {'images/ico_extra_info.png': 'dist/images/ico_extra_info.png'}
        },
        watch: {
            css: {
                files: ['sass/*.scss'],
                tasks: ['newer:sass:dev'],
                options: {
                    spawn: false
                }
            },
            js: {
                files: ['js/*.js'],
                tasks: ['newer:jshint'],
                options: {
                    spawn: false
                }
            }
        },
        'ftp-deploy': {
            build: {
                auth: {
                    host: '54.249.134.139',
                    //port: 21,
                    authKey: 'key1'
                    //authPath: '.ftpconfig'
                },
                src: 'js',
                dest: 'hf/js/buy/aa',
                //exclusions: ['path/to/source/folder/**/.DS_Store', 'path/to/source/folder/**/Thumbs.db', 'path/to/dist/tmp']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-ftp-deploy');

    grunt.registerTask('default', ['sass:dest', 'cssmin', 'jshint', 'concat', 'uglify']);
    grunt.registerTask('dev', ['newer:jshint', 'newer:sass:dev']);

    grunt.task.registerTask('compile', 'Compile scss to css.', function(file) {
        if (arguments.length === 0) {
            grunt.log.writeln(this.name + ", no args");
        } else {
            grunt.log.writeln(this.name + ", " + file);
            grunt.config('sass:compile', {
                options: {
                    compass   : true,
                    style     : 'expanded',
                    sourcemap : 'none'
                },
                files: {
                    'sass/<%= file %>.css' : 'css/<%= file %>.scss'
                }
            });
            grunt.task.run('sass:dev');

        }
    });
};
