'use strict';

// Load grunt tasks automatically
var loadGrunTasks = require('load-grunt-tasks');

module.exports = function(grunt) {
    loadGrunTasks(grunt);

    grunt.initConfig({

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            dist: {
                files: [
                    {
                        src: [
                            'src/ng-equation.js',
                            'src/**/*.js'
                        ],
                        expand: true,
                        rename: function(destPath, srcPath) {
                            var match = /^src\/(.*)/.exec(srcPath);
                            if (match && match[1]) {
                                return 'dist/.tmp/' + match[1];
                            }
                            grunt.fail.fatal('error parsing src file: ' + srcPath);
                            return undefined;
                        }
                    }
                ]
            }
        },

        uglify: {
            nonMin: {
                options: {
                    beautify: true,
                    mangle: false,
                    compress: {
                        negate_iife: false
                    }
                },
                files: {
                    'dist/ng-equation.js': ['dist/.tmp/ng-equation.js', 'dist/.tmp/js/**/*.js']
                }
            },
            min: {
                options: {
                    beautify: false,
                    mangle: true,
                    compress: {
                        negate_iife: false
                    }
                },
                files: {
                    'dist/ng-equation.min.js': ['dist/.tmp/ng-equation.js', 'dist/.tmp/js/**/*.js']
                }
            }
        },

        html2js: {
            options: {
                module: 'ngEquation.templates',
                rename: function(path) {
                    return path.replace(/templates\//, '');
                }
            },
            dist: {
                src: ['src/templates/**/*.html'],
                dest: 'dist/ng-equation-templates.js'
            }
        },

        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: ['dist/.tmp']
                    }
                ]
            }
        },

        eslint: {
            target: [
                'src/**/*.js',
                'test/**/*.js',
                'karma.conf.js',
                'Gruntfile.js'
            ]
        },

        // Test settings
        karma: {
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        }

    });

    grunt.registerTask('build', [
        'ngAnnotate',
        'uglify',
        'html2js',
        'clean'
    ]);

    grunt.registerTask('test', [
        'karma:continuous',
        'eslint'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
