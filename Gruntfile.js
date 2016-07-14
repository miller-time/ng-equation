'use strict';

// Load grunt tasks automatically
var loadGruntTasks = require('load-grunt-tasks');

module.exports = function(grunt) {
    loadGruntTasks(grunt);

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
        },

        copy: {
            demo: {
                files: [
                    {
                        expand: true,
                        src: ['bower_components/**'],
                        dest: 'demo/'
                    },
                    {
                        expand: true,
                        src: ['dist/**'],
                        dest: 'demo/'
                    }
                ]
            }
        },

        buildcontrol: {
            demo: {
                options: {
                    dir: 'demo',
                    branch: 'gh-pages',
                    commit: true,
                    push: true,
                    remote: 'git@github.com:miller-time/ng-equation.git',
                    message: 'Built demo from commit %sourceCommit% on branch %sourceBranch%'
                }
            }
        },

        lesslint: {
            src: ['src/less/**/*.less'],
            options: {
                csslint: {
                    csslintrc: '.csslintrc'
                }
            }
        },

        less: {
            dist: {
                files: {
                    'dist/ng-equation.css': 'src/less/**/*.less'
                },
                options: {
                    compress: true
                }
            }
        },

        watch: {
            js: {
                files: ['src/**/*.js'],
                tasks: ['ngAnnotate', 'uglify', 'clean', 'copy:demo', 'karma:continuous', 'eslint']
            },
            less: {
                files: ['src/less/**/*.less'],
                tasks: ['less', 'copy:demo', 'lesslint']
            },
            templates: {
                files: ['src/templates/**/*.html'],
                tasks: ['html2js', 'copy:demo']
            },
            test: {
                files: ['test/**/*.js'],
                tasks: ['karma:continuous']
            }
        }

    });

    grunt.registerTask('build', [
        'ngAnnotate',
        'uglify',
        'html2js',
        'less',
        'clean',
        'copy:demo'
    ]);

    grunt.registerTask('test', [
        'karma:continuous',
        'eslint',
        'lesslint'
    ]);

    grunt.registerTask('deployDemo', [
        'build',
        'buildcontrol:demo'
    ]);

    grunt.registerTask('default', [
        'build',
        'watch'
    ]);
};
