var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

// Static server
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         // server: {
//         //     baseDir: "./www"
//         // }
//         // proxy: "yourlocal.dev"
//     });
// });

// gulp.task('js-watch', ['js'], browserSync.reload);

// gulp.task('serve', ['less'], function () {

//     // Serve files from the root of this project
//     browserSync.init({
//         server: {
//             baseDir: "./"
//         },
//         open: true
//     });

//     // add browserSync.reload to the tasks array to make
//     // all browsers reload after tasks are complete.
//     // gulp.watch("dev/less/*.js", ['js-watch']);
//     gulp.watch("dev/less/*.less", ['less']);
//     // gulp.watch("dev/*.html").on('change', browserSync.reload);
// });

// gulp.task('browser-sync', function () {
   // var files = [
   //    '../../**/*.html',
   //    '../../assets/css/**/*.css',
   //    // './assets/imgs/**/*.png',
   //    '../../assets/js/**/*.js'
   // ];

   // browserSync.init(files, {
   //    // server: {
   //    //    baseDir: './'
   //    // },
   //    proxy: 'lick.dev',
   //    open: true
   // });

// gulp.watch([ 'html/*' ], ['html']);
//     gulp.watch([ '.html' ], ['html']);
//     gulp.watch([ 'js/' ], ['html']);
//     gulp.watch([ 'css/*' ], ['html']);
//     gulp.watch([ 'css/*', ], ['sass']);

//    browserSync({
//            server: {
//                baseDir: "./",
//                injectChanges: true // this is new
//            }
//        });
// });


// gulp.task('serve', ['less'], function() {

//     browserSync.init({
//         server: "./app"
//     });

// });


// // or...

// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "yourlocal.dev"
//     });
// });