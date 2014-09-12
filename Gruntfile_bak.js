// http://gruntjs.com/sample-gruntfile
// http://fcfeibel.com/blog/2013/07/28/grunt-quickstart-set-up-grunt-with-jshint/
// http://www.gtwang.org/2013/12/grunt-javascript-task-runner.html
// http://blog.teamtreehouse.com/getting-started-with-grunt

module.exports = function(grunt) {
 
  // Project configuration.
  grunt.initConfig({
    // This line makes your node configurations available for use.
    pkg: grunt.file.readJSON('package.json'),
    // This is where we configure JSHint.
    jshint: {
      // You get to make the name.
      // The paths tell JSHint which files to validate.
      files: ['Gruntfile.js', 'js/*.js'],
      // options: {
      //   globals: {
      //     jQuery   : true,
      //     console  : true,
      //     module   : true,
      //     document : true,
      //   },
      //   undef  : true,
      //   unused : true,
      //   predef : ['$'],
      //   eqeqeq : true
      // }
      options: {
        jshintrc: '.jshintrc'
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'sass',
          cssDir: 'css',
          outputStyle: 'expanded'
        }
      }
    },
    watch: {
      css: {
        files: [
          'sass/*.sass',
          'sass/*.scss'
        ],
        tasks: ['compass']
      },
      js: {
        files: [
          'js/*.js',
          'Gruntfile.js'
        ],
        tasks: ['jshint']
      }
    },
    // concat: {
    //   options: {
    //     // define a string to put between each file in the concatenated output
    //     separator: ';'
    //   },
    //   dist: {
    //     // the files to concatenate
    //     src: ['js/*.js'],
    //     // the location of the resulting JS file
    //     dest: 'dist/<%= pkg.name %>.js'
    //   }
    // },
    // uglify: {
    //   options: {
    //     // the banner is inserted at the top of the output
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
    //   },
    //   dist: {
    //     files: {
    //       'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
    //     }
    //   }
    // }
  });

  // Each plugin must be loaded following this pattern.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  //grunt.registerTask('default', ['compass', 'jshint', 'concat', 'uglify']);
  grunt.registerTask('default', ['watch']);
};