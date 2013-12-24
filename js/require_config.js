var require = {
    baseUrl: 'js/',
    waitSeconds: 7, // default
    paths: {
        "libs/jquery": "libs/jquery-1.9.1.min",
        //"libs/autobahn": "libs/autobahn.min",
        "libs": "libs",
        "libs-amd": "resources/libs",
        "plugins": "src/plugins",
        'libs/highcharts': 'libs/highcharts.src',
        "when": "libs/when",
        'facebook': '//connect.facebook.net/en_US/all'
    },
    shim: {
        'facebook': {
            export: 'FB'
        },
        'libs/highcharts': {
            deps: ['libs/jquery'],
            exports: 'Highcharts'
        },
        'highcharts': ['libs/highcharts'],
        'libs/jquery-ui': ['libs/jquery'],
        'libs/jquery.dataTables.min': ['libs/jquery'],
        'libs/underscore': {
            exports: '_'
        },
        'libs/d3.v2': { exports: 'd3' },
        'libs/backbone': {
            deps: ["libs/underscore", "libs/jquery"],
            exports: 'Backbone'
        },
        'libs/autobahn': {
            deps: ["libs/jquery"]
        }
        //"libs/when": { exports: "when"}

    }
};