"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var notify = require('gulp-notify');
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var mqpacker = require("css-mqpacker");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var del = require("del");

gulp.task("clean", function () {
    return del("build");
});

gulp.task("copy", function () {
    return gulp.src([
        "fonts/**/*.{woff,woff2}",
        "img/**",
        "js/**",
        "*.html"
    ], {
        base: "."
    })
        .pipe(gulp.dest("build"));
});

gulp.task("copyhtml", function () {
    return gulp.src("*.html")
        .pipe(gulp.dest("build"));
})

gulp.task("style", function () {
    return gulp.src("less/*.less")
        .pipe(plumber({errorHandler: notify.onError()}))
        .pipe(less())
        .pipe(postcss([
            autoprefixer({
                browsers: [
                    "last 1 version",
                    "last 2 Chrome versions",
                    "last 2 Firefox versions",
                    "last 2 Opera versions",
                    "last 2 Edge versions"
                ]
            }),
            mqpacker({
                sort: true
            })
        ]))
        .pipe(gulp.dest("build/css"))
        .pipe(minify())
        .pipe(rename("style.min.css"))
        .pipe(gulp.dest("build/css"));
});

gulp.task("images", function () {
    return gulp.src("build/img/**/*.{png,jpg,gif}")
        .pipe(imagemin([
            imagemin.optipng({optimizationLevel: 3}),
            imagemin.jpegtran({progressive: true})
        ]))
        .pipe(gulp.dest("build/img"));
});

gulp.task('watch', function () {
    gulp.watch('less/*.less', gulp.series('style'));
    gulp.watch('*.html', gulp.series('copyhtml'));
});

gulp.task("serve", function () {
    server.init({
        server: "build",
        index: "index.html"
    });
    server.watch("less/*.less", gulp.series("style")).on("change", server.reload);
    server.watch("build/*.html").on("change", server.reload);
});

gulp.task("dev",
    gulp.series("clean", "copy", "style", "images",
        gulp.parallel('watch', 'serve')));


