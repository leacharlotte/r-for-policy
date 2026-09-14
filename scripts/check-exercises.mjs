import {mkdtemp, cp, writeFile, rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {modules} from '../src/course.js';

// Use real R and real saved files. Browser checks separately cover webR and downloads.
const lessons = modules.flatMap(module => module.lessons);
const lesson = id => lessons.find(item => item.id === id);
const cases = lessons.filter(item => !item.guide).map(item => ({
  name:`${item.id}: reference solution`, lesson:item, code:item.solution, expected:true,
}));
const add = (id, name, code, expected = true) => cases.push({name:`${id}: ${name}`, lesson:lesson(id), code, expected});

const first = lesson('graphs-first').solution;
add('graphs-first', 'line and points', first.replace('geom_line()', 'geom_line() + geom_point()'));
add('graphs-first', 'mapping inside layer', 'female_profile <- subset(df, gender == "Female")\np <- ggplot(female_profile) + geom_line(aes(age, annual_income))\np');
add('graphs-first', 'data and mapping inside layer', 'female_profile <- subset(df, gender == "Female")\np <- ggplot() + geom_line(data = female_profile, aes(age, annual_income))\np');
add('graphs-first', 'points without line', first.replace('geom_line()', 'geom_point()'), false);
add('graphs-first', 'plot not displayed', first.replace(/\np$/, ''), false);
add('graphs-first', 'explicit print', first.replace(/\np$/, '\nprint(p)'));
add('graphs-first', 'wrong gender', first.replaceAll('"Female"', '"Male"'), false);

const groups = lesson('graphs-compare');
add(groups.id, 'layer mapping', 'p <- ggplot(df) + geom_line(aes(age, annual_income, colour = gender))\np');
add(groups.id, 'layer overrides inherited mapping', 'p <- ggplot(df, aes(age, n_people)) + geom_line(aes(y = annual_income, colour = gender))\np');
add(groups.id, 'layer ignores global mapping', 'p <- ggplot(df, aes(n_people, age)) + geom_line(aes(age, annual_income, colour = gender), inherit.aes = FALSE)\np');
add(groups.id, 'only relevant columns, reversed rows', 'df <- df[nrow(df):1, c("gender", "age", "annual_income")]\np <- ggplot(df, aes(age, annual_income, colour = gender)) + geom_line()\np');
add(groups.id, 'layer data function', 'p <- ggplot(df, aes(age, annual_income, colour = gender)) + geom_line(data = function(data) data[nrow(data):1, ])\np');
add(groups.id, 'one line connects both genders', groups.solution.replace('colour = gender', 'colour = gender, group = 1'), false);
add(groups.id, 'lines connect rows of the same age', groups.solution.replace('colour = gender', 'colour = gender, group = age'), false);
add(groups.id, 'one gender missing', `df <- subset(df, gender == "Male")\n${groups.solution}`, false);
add(groups.id, 'income values changed', `df$annual_income <- df$annual_income * 2\n${groups.solution}`, false);

const labels = lesson('graphs-labels');
add(labels.id, 'dollar label on thousands', labels.solution.replace('Annual income (in 1000$)', 'Annual income (in $)'), false);
add(labels.id, 'wrong horizontal label', labels.solution.replace('x = "Age"', 'x = "Income"'), false);
add(labels.id, 'wrong caption', labels.solution.replace('Synthetic data for practice', 'Observed incomes'), false);
add(labels.id, 'correct labels with wrong units', labels.solution.replace('annual_income / 1000', 'annual_income'), false);

const project = lesson('inequality-plot');
add(project.id, 'filter df before plotting', 'df <- df %>% filter(group == "top10")\n' + project.solution);
add(project.id, 'select only columns used in graph', project.solution.replace('filter(group == "top10") %>%', 'filter(group == "top10") %>%\n  select(year, share_pct, country) %>%'));
add(project.id, 'mapped values computed in aes', project.solution.replace('y = share_pct', 'y = income_share * 100'));
add(project.id, 'wrong income group', project.solution.replace('"top10"', '"bottom50"'), false);
add(project.id, 'both income groups', project.solution.replace('  filter(group == "top10") %>%\n', ''), false);
add(project.id, 'one country omitted', 'df <- df %>% filter(country != "Switzerland")\n' + project.solution, false);
add(project.id, 'incorrect years', 'df$year <- df$year + 1\n' + project.solution, false);
add(project.id, 'countries combined into one line', project.solution.replace('colour = country', 'colour = country, group = 1'), false);
add(project.id, 'source caption missing', project.solution.replace(', caption = "Source: WID.world"', ''), false);

const mutate = lesson('mutate');
add(mutate.id, 'original columns dropped', mutate.solution + '\ndf_new <- df_new %>% select(monthly_income, total_income)', false);
add(mutate.id, 'original income changed', mutate.solution + '\ndf_new$annual_income <- 0', false);
add(mutate.id, 'one row missing', mutate.solution + '\ndf_new <- df_new[-1, ]', false);
add(mutate.id, 'rows and columns reordered', mutate.solution + '\ndf_new <- df_new[nrow(df_new):1, rev(names(df_new))]');
add(mutate.id, 'additional useful column', mutate.solution + '\ndf_new$age_squared <- df_new$age^2');

const save = lesson('graphs-save');
add(save.id, 'wrong width', save.solution.replace('width = 16', 'width = 18'), false);
add(save.id, 'wrong height', save.solution.replace('height = 10', 'height = 12'), false);
add(save.id, 'wrong resolution', save.solution.replace('dpi = 300', 'dpi = 150'), false);
add(save.id, 'wrong filename', save.solution.replace('my_income_plot.png', 'another_plot.png'), false);
add(save.id, 'no file', 'p', false);
add(save.id, 'text renamed to PNG', 'writeLines("not an image", "my_income_plot.png")', false);

const folder = await mkdtemp(join(tmpdir(), 'course-exercises-'));
try {
  await cp(new URL('../public/data/', import.meta.url), join(folder, 'data'), {recursive:true});
  const quote = JSON.stringify;
  const script = `
suppressPackageStartupMessages({
  library(dplyr); library(tidyr); library(ggplot2); library(readxl); library(writexl)
})
options(width = 76, digits = 7)
root <- getwd()
failures <- 0L
test_case <- function(name, setup, code, check, expected) {
  folder <- tempfile("case-", tmpdir = root)
  dir.create(folder)
  file.copy(file.path(root, "data"), folder, recursive = TRUE)
  setwd(folder)
  on.exit({
    graphics.off()
    setHook("grid.newpage", NULL, action = "replace")
    setwd(root)
    unlink(folder, recursive = TRUE)
  })
  pdf(file.path(folder, "rendered-plots.pdf"))
  env <- new.env(parent = globalenv())
  error <- NULL
  actual <- tryCatch({
    eval(parse(text = setup), env)
    plots <- 0L
    setHook("grid.newpage", function() { plots <<- plots + 1L }, action = "replace")
    output <- capture.output({
      for (expression in parse(text = code)) {
        value <- withVisible(eval(expression, env))
        if (value$visible) print(value$value)
        env$.answer <- value$value
      }
    })
    env$.printed_output <- paste(output, collapse = "\\n")
    env$.plot_count <- plots
    isTRUE(eval(parse(text = check), env))
  }, error = function(e) { error <<- conditionMessage(e); FALSE })
  passed <- is.null(error) && identical(actual, expected)
  cat(if (passed) "PASS" else "FAIL", name, if (!is.null(error)) paste("—", error), "\\n")
  if (!passed) failures <<- failures + 1L
}
${cases.map(test => `test_case(${quote(test.name)}, ${quote(test.lesson.setup || '')}, ${quote(test.code)}, ${quote(test.lesson.check)}, ${test.expected ? 'TRUE' : 'FALSE'})`).join('\n')}
cat("\\n", ${cases.length}, "checks;", failures, "failures\\n")
if (failures) quit(status = 1L)
`;
  await writeFile(join(folder, 'checks.R'), script);
  const result = spawnSync('Rscript', ['checks.R'], {cwd:folder, encoding:'utf8', maxBuffer:5e6});
  if (result.error) throw result.error;
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exitCode = result.status ?? 1;
} finally {
  await rm(folder, {recursive:true, force:true});
}
