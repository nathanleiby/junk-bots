const gulp = require("gulp");
const puppeteer = require("puppeteer");
const tap = require("gulp-tap");
const path = require("path");

gulp.task("build", function () {
  return gulp.src(["**/*.html", "!index.html", "!node_modules/**/*"]).pipe(
    tap(async (file) => {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--single-process"],
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 500,
        height: 720,
        deviceScaleFactor: 1,
      });

      await Promise.all([
        page.goto("file://" + file.path),
        page.waitForNavigation({ waitUntil: "networkidle0" }), // ensure all remote images are loaded
      ]);
      await page.screenshot({
        path: "output/" + path.basename(file.basename, ".html") + ".png",
      });

      await browser.close();
    })
  );
});
