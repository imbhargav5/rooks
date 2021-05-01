var gulp = require('gulp');
var conventionalChangelog = require('gulp-conventional-changelog');

const IGNORE_COMMIT_PATTERS = [`[skip ci]`, `[create-pull-request]`];

gulp.task('changelog', function () {
  var argv = require('yargs').argv;
  const { releaseCount = 0 } = argv;
  return gulp
    .src('CHANGELOG.md')
    .pipe(
      conventionalChangelog(
        {
          // conventional-changelog options go here
          //preset: 'angular'
          releaseCount: releaseCount,
          skipUnstable: true,
          sameFile: true,
        },
        {
          // context goes here
        },
        {
          // git-raw-commits options go here
        },
        {
          // conventional-commits-parser options go here
        },
        {
          // conventional-changelog-writer options go here
          finalizeContext: (context) => {
            return {
              ...context,
              commitGroups: [
                ...context.commitGroups.map(({ commits, ...rest }) => ({
                  ...rest,
                  commits: commits.filter((commit) => {
                    return !IGNORE_COMMIT_PATTERS.some((pattern) =>
                      typeof commit.header === 'string'
                        ? commit.header.includes(pattern)
                        : false
                    );
                  }),
                })),
              ],
            };
          },
        }
      )
    )
    .pipe(gulp.dest('./'));
});
