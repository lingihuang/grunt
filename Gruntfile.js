(function () {
   'use strict';
}());
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\r\n\r\n'
      },
      dist: {
        src: ['assets/js/modules/module1.js', 'assets/js/modules/module2.js'],
        dest: 'assets/js/main.js'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'assets/js/main.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', 'assets/js/*.js', 'assets/js/modules/*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: 'assets/scss',
          cssDir: 'assets/css',
          environment: 'development',
          outputStyle: 'compressed'
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>', 'assets/scss/**/*.scss'],
      tasks: ['concat', 'uglify', 'jshint', 'compass']
    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['concat', 'uglify', 'jshint', 'compass', 'watch']);
};