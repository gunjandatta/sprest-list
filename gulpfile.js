var gulp = require("gulp");

// Copy Content
gulp.task("content", function() {
    gulp.src(["node_modules/bootstrap/dist/css/bootstrap.min.css"])
        .pipe(gulp.dest("app/Content"))
});

// Copy Pages
gulp.task("pages", function() {
    gulp.src(["src/pages/*.aspx"])
        .pipe(gulp.dest("app/Pages"))
});

// Copy Scripts
gulp.task("scripts", function() {
    gulp.src(["node_modules/bootstrap/dist/js/bootstrap.min.js", "node_modules/jquery/dist/jquery.min.js", "node_modules/gd-sprest/dist/sprest.min.js"])
        .pipe(gulp.dest("app/Scripts"))
});

// Main
gulp.task("default", ["content", "pages", "scripts"]);
