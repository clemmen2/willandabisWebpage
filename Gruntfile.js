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
					{cwd:'bower_components/jquery/dist/',expand: true,src:['**/*.min.js'],dest:'public/js'},
					{cwd:'bower_components/angular/',expand: true,src:['**/*.min.js'],dest:'public/js'},
					{cwd:'bower_components/angular-resource/',expand: true,src:['**/*.min.js'],dest:'public/js'},
					{cwd:'bower_components/angular-route/',expand: true,src:['**/*.min.js'],dest:'public/js'}
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
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', ['copy']);

};