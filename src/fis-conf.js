/*
    name : react fis config
    date : 2015.4.8
    author: liuhao18@baidu.com
*/
fis.config.set('pack', {
    'js/index.js': [
        '/components/**/**.js',
        '/pages/indexPage.js',
        '/pages/searchPage.js',
        '/pages/router.js',
    ],
    'css/index.css': [
        '/static/css/reset.css',
        '/static/css/**.less',
        '/components/**.less'
    ]
});


/**
 *  图片合并
 */
fis.config.set('settings.spriter.csssprites', {
    scale: 0.5
})

/*
 *   插件名: fis-postpackager-simple
 *   功能: 插件提供的静态资源打包合并的功能
 */
fis.config.set('modules.postpackager', 'simple');


/*
 *   插件名: fis-parser-less
 *   功能: fis编译*.less文件
 */
fis.config.set('modules.parser.less', 'less');
fis.config.set('roadmap.ext.less', 'css');
