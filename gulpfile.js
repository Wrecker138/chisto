'use strict';

const	gulp = require('gulp'),
		pug = require('gulp-pug'),
		stylus = require('gulp-stylus'),
		plumber = require('gulp-plumber'),
		rename = require('gulp-rename'),
		watch = require('gulp-watch'),
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),
		imagemin = require('gulp-imagemin'),
		cache = require('gulp-cache'),
		del = require('del'),
		htmlmin = require('gulp-htmlmin'),
		runSequence = require('run-sequence'),
		autoprefixer = require('gulp-autoprefixer'),
		babel = require('gulp-babel'),
		portfinder = require('portfinder'),
		browserSync = require('browser-sync'),
		font2css = require('gulp-font2css').default,
		gutil = require('gulp-util'),
		uncss = require('gulp-uncss'),
		sourcemaps = require('gulp-sourcemaps'),
		csso = require('gulp-csso'),
		gulpif = require('gulp-if'),
		isDev = process.env.NODE_ENV === 'dev',
		fs = require('fs');

// Конфиг
let config = {
	startServer: true,
	src: {
		templates: 'app/pages/*.pug',
		scripts: ['app/scripts/libs/*.js', 'app/scripts/*.js', 'app/blocks/**/*.js'],
		fonts: 'app/fonts/*.{otf,ttf,woff,woff2}',
		styles: 'app/styles/app.styl',
		favicons: 'app/favicons/*.+(png|ico|svg|xml|json)',
		images: 'app/images/**/*.+(png|jpg|jpeg|gif|mp4|svg)'
	},
	watch: {
		templates: 'app/{pages,blocks}/**/*.pug',
		scripts: 'app/{scripts,blocks}/**/*.js',
		fonts: 'app/fonts/*.{otf,ttf,woff,woff2}',
		styles: 'app/{styles,blocks}/**/*.styl',
		favicons: 'app/favicons/*.+(png|ico|svg|xml|json)',
		images: 'app/images/**/*.+(png|jpg|jpeg|gif|mp4|svg)'
	},
	dist: {
		html: './dist/',
		images: './dist/assets/images/',
		scripts: './dist/assets/scripts/',
		styles: './dist/assets/styles/',
		favicons: './dist/assets/favicons/'
	}
};

// Проверяем есть ли user.congig.json и если есть подхватываем оттуда данные
if(fs.existsSync('./config.user.json')) {
	let userConfig = require('./config.user.json');
	for(let type in userConfig) {
		if(typeof userConfig[type] == 'object') {
			for (let option in userConfig[type]) {
				config[type][option] = userConfig[type][option];
			}
		} else {
			config[type] = userConfig[type];
		}
	}
}


// Сборщик pug
gulp.task('templates', function () {
	if(config.dist.html != false) {
		return gulp.src(config.src.templates)
			.pipe(plumber())
			.pipe(pug({
				basedir: 'app',
				pretty: true
			}))
			.pipe(htmlmin({ collapseWhitespace: true }))
			.pipe(gulp.dest(config.dist.html));
	}
});

// Сборщик JavaScript
gulp.task('scripts', function () {
	return gulp.src(config.src.scripts)
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(babel())
		.pipe(concat('general.min.js'))
		.pipe(gulpif(!isDev, uglify()))
		.pipe(gulpif(isDev, sourcemaps.write()))
		.pipe(gulp.dest(config.dist.scripts));
});

// Сборщик шрифтов
gulp.task('fonts', function () {
	return gulp.src(config.src.fonts)
		.pipe(font2css())
		.pipe(concat('fonts.css'))
		.pipe(csso())
		.pipe(gulp.dest(config.dist.styles));
});

// Сборщик CSS
gulp.task('styles', function () {
	return gulp.src(config.src.styles)
		.pipe(plumber({errorHandler: onError}))
		.pipe(gulpif(isDev, sourcemaps.init()))
		.pipe(stylus({
			compress: true
		}))
		.pipe(rename('app.min.css'))
		.pipe(autoprefixer({
			browsers: ['last 5 versions'],
			cascade: false
		}))
		.pipe(csso())
		.pipe(gulpif(isDev, sourcemaps.write()))
		// .pipe(uncss({
        //     html: ['dist/*.html']
        // }))
		.pipe(gulp.dest(config.dist.styles));
});

// Сборщик фавиконок
gulp.task('favicons', function () {
	return gulp.src(config.src.favicons)
		.pipe(gulp.dest(config.dist.favicons));
});

// Сборщик изображений
gulp.task('images', function () {
	return gulp.src(config.src.images)
		.pipe(cache(imagemin({
			interlaced: true
		})))
		.pipe(gulp.dest(config.dist.images));
});

// Очистка ненужного
gulp.task('clean', function (callback) {
	return del('dist');
	cache.clearAll(callback);
});

// Билд сборки
gulp.task('build', function () {
	runSequence(
		'clean',
		['scripts', 'fonts', 'templates', 'images', 'favicons', 'styles']
	);
});

// Вотчер
gulp.task('watch', function () {
	gulp.watch(config.watch.scripts, ['scripts']);
	gulp.watch(config.watch.fonts, ['fonts']);
	gulp.watch(config.watch.styles, ['styles']);
	gulp.watch(config.watch.templates, ['templates']);
	gulp.watch(config.watch.images, ['images']);
	gulp.watch(config.watch.favicons, ['favicons']);
});

// Запуск сборки с отслеживанием
gulp.task('default', function () {
	runSequence(
		['scripts', 'styles', 'templates', 'images', 'fonts', 'favicons'],
		'watch',
		'server'
	);
});

// Сервер
gulp.task('server', function () {
	if(config.startServer) {
		portfinder.getPort(function (err, port) {
			browserSync({
				server: {
					baseDir: "./dist/",
					serveStaticOptions: {
						extensions: ['html']
					}
				},
				host: 'localhost',
				notify: false,
				port: port
			});
		});
	}
});

// Обработчик ошибок
const onError = function (error) {
	gutil.log([
		(error.name + ' in ' + error.plugin
		).bold.red,
		'',
		error.message,
		''
	].join('\n'));
	gutil.beep();
	this.emit('end');
};
