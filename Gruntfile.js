module.exports = function(grunt) {

  // Setup configurations
  grunt.initConfig({
    // manifest file
    pkg : grunt.file.readJSON('package.json'),

    /**
     * Uglifies the /src/ folder and outputs the files to /build/ directory
     *
     * @task uglify
     */
    uglify : {
      options : {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n\n @author Vu Tran \n @link <http://vu-tran.com> \n @package <%= pkg.name %> \n @license <%= pkg.license %> \n*/\n'
      },
      build : {
        expand : true,
        cwd : 'src/',
        src : ['*.js'],
        dest : 'build/',
        ext : '.min.js'
      }
    }

  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Register the default task
  grunt.registerTask('default', ['uglify']);

};