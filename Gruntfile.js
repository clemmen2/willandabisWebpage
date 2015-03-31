module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			css: {
				files: [
					{cwd:'bower_components/bootstrap/dist/',expand: true,src:['**/*.min.css'],dest:'public/'}
				]
			},
			js: {
				files: [
					{cwd:'bower_components/bootstrap/dist/',expand: true,src:['**/*.min.js'],dest:'public/'},
					{cwd:'bower_components/jquery/dist/',expand: true,src:['**/*.min.js*'],dest:'public/js'},
					{cwd:'bower_components/jquery/dist/',expand: true,src:['**/*.min*'],dest:'public/js'},
					{cwd:'bower_components/angular/',expand: true,src:['**/*.min.js*','!*.min.js.gzip'],dest:'public/js'},
					{cwd:'bower_components/angular-resource/',expand: true,src:['**/*.min.js*'],dest:'public/js'},
					{cwd:'bower_components/angular-route/',expand: true,src:['**/*.min.js*'],dest:'public/js'},
					{cwd:'bower_components/html5shiv/dist/',expand: true,src:['**/*.min.js'],dest:'public/js'},
					{cwd:'bower_components/angular-timer/dist/',expand: true,src:['**/*.min.js'],dest:'public/js'},
					{cwd:'bower_components/humanize-duration/',expand: true,src:['**/*.js'],dest:'public/js'},
					{cwd:'bower_components/momentjs/min/',expand: true,src:['**/*.min.js','!moment-with-locales.min.js'],dest:'public/js'},
					{cwd:'bower_components/angular-deckgrid/',expand: true,src:['*.js'],dest:'public/js'},
					{cwd:'bower_components/exif-js/',expand: true,src:['*.js'],dest:'public/js'}
				]
			},
			misc: {
				files: [
					{cwd:'bower_components/bootstrap/dist/',expand: true,src:['fonts/*'],dest:'public/'}
				]
			}
		},
		clean: {
			css:['public/css/bootstrap*'],
			js:['public/js/angular*','public/js/bootstrap*', 'public/js/jquery*'],
			fonts: ['public/fonts']
		},
		imagemin: {
			images:{
				files: [{
        			expand: true,                  // Enable dynamic expansion
			        cwd: 'public/img/',                   // Src matches are relative to this path
			        src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
			        dest: 'public/img/'                  // Destination path prefix
      }]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	grunt.registerTask('default', ['copy']);

};