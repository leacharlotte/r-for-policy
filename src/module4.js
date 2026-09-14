import { incomeDataNote } from './dataset-notes.js';
import { linePlotCheck } from './plot-checks.js';

const setup = 'df <- read.csv("data/data_incomes.csv")';
const ready = {data:true, packages:['ggplot2'], setup, checkGraphics:true,
  setupNote:incomeDataNote};
const plotCheck = (data, y='annual_income', colour=false, labels={}) => linePlotCheck({data, x:'age', y, colour:colour ? 'gender' : undefined, labels});
const originalData = 'read.csv("data/data_incomes.csv")';
const graphLabels = {title:'Income profiles by age', x:'Age', y:'Annual income (in 1000$)', colour:'Gender', caption:'Synthetic data for practice'};
const labelledPlot = `p <- ggplot(df, aes(x = age, y = annual_income, colour = gender)) +
  geom_line() +
  labs(
    title = "Income profiles by age",
    x = "Age", y = "Annual income (in $)",
    colour = "Gender", caption = "Synthetic data for practice"
  ) +
  theme_minimal()`;
const plotMistakes = [
  {when:'exists("p", inherits=FALSE) && inherits(p, "ggplot") && .plot_count == 0', message:'Write p on a new line to display the graph.'},
  {when:'exists("p", inherits=FALSE) && inherits(p, "ggplot") && !any(vapply(p$layers, function(layer) inherits(layer$geom, "GeomLine"), logical(1)))', message:'Add geom_line() to draw the requested line graph. You can also keep geom_point().'},
];
// Read the PNG header and its resolution metadata without an extra R package.
const savedPngCheck = `file.exists("my_income_plot.png") && local({
  bytes <- readBin("my_income_plot.png", "raw", n = file.info("my_income_plot.png")$size)
  number <- function(pos) sum(as.numeric(bytes[pos + 0:3]) * 256^(3:0))
  if (length(bytes) < 33 || !identical(as.integer(bytes[1:8]), c(137L,80L,78L,71L,13L,10L,26L,10L))) return(FALSE)
  width <- number(17); height <- number(21)
  resolution <- NULL; pos <- 9
  while (pos + 11 <= length(bytes)) {
    size <- number(pos)
    if (pos + size + 11 > length(bytes)) return(FALSE)
    if (identical(bytes[pos + 4:7], charToRaw("pHYs")) && size == 9 && as.integer(bytes[pos + 16]) == 1) {
      resolution <- c(number(pos + 8), number(pos + 12)) * 0.0254
    }
    pos <- pos + size + 12
  }
  abs(width - 16 / 2.54 * 300) <= 1 && abs(height - 10 / 2.54 * 300) <= 1 &&
    length(resolution) == 2 && all(abs(resolution - 300) < 1)
})`;

export const module4 = {
  id:'module-4',number:'04',title:'Creating graphs',titleMarker:'Intermediate',
  description:'Create clear, labelled graphs with ggplot2 and save them as image or PDF files.',
  lessons:[
    {
      id:'graphs-first',title:'Draw your first income profile',heading:'From a table to a figure.',...ready,
      intro:'Use the income data to illustrate how mean annual income varies with age.',
      section:'Choose the data, map the axes, add a line',
      body:`<p><code>ggplot2</code> is a package for creating graphs. Start with <code>ggplot(data, aes(...))</code>: the first argument is your table, and <code>aes()</code> maps columns to visual features. Its <code>x</code> and <code>y</code> arguments specify the variables for the horizontal and vertical axes. For example, <code>aes(x = age, y = annual_income)</code> puts age on the x-axis and annual income on the y-axis.</p>
        <p>A <strong>layer</strong> determines how the data are drawn. Add <code>geom_line()</code> with <code>+</code> to draw a line connecting the observations in x-axis order. Here, it connects the income values from the youngest to the oldest age.</p>
        <div class="data-dictionary"><div class="table-scroll"><table><caption>Common plotting layers</caption><thead><tr><th>Layer</th><th>What it draws</th></tr></thead><tbody><tr><td><code>geom_line()</code></td><td>A line connecting observations in x-axis order</td></tr><tr><td><code>geom_point()</code></td><td>A scatter plot with a point for each observation</td></tr><tr><td><code>geom_col()</code></td><td>Bars with heights given by a variable in your data</td></tr><tr><td><code>geom_bar()</code></td><td>Bars showing the number of rows in each category</td></tr><tr><td><code>geom_histogram()</code></td><td>A histogram showing how many numeric values fall into each interval</td></tr><tr><td><code>geom_boxplot()</code></td><td>A box plot showing the median and spread of values, often separately by group</td></tr></tbody></table></div></div>
        <p>Save the plot as <code>p</code>, then write <code>p</code> on a new line to display it.</p>`,
      example:'male_profile <- df %>%\n  filter(gender == "Male")\n\np <- ggplot(male_profile, aes(x = age, y = annual_income)) +\n  geom_line() +\n  geom_point()\np',
      noteTitle:'Start with one profile.',note:'Each age has two observations in the full dataset. Filter to one gender before drawing this first line. In the next lesson, you will tell ggplot how to distinguish the two profiles.',
      taskTitle:'Plot the female income profile',task:'<p>Filter <code>df</code> to <code>"Female"</code> and save the result as <code>female_profile</code>. Create a line plot named <code>p</code>, with age on the x-axis and annual_income on the y-axis. Display it.</p>',
      starter:'female_profile <- df %>%\n  filter(______)\n\np <- ggplot(female_profile, aes(x = ______, y = ______)) +\n  ______\np',
      solution:'female_profile <- df %>%\n  filter(gender == "Female")\np <- ggplot(female_profile, aes(x = age, y = annual_income)) +\n  geom_line()\np',
      hints:['Use filter(gender == "Female") to keep one observation per age.', 'Use aes(x = age, y = annual_income), followed by + geom_line(). You can also add + geom_point().'],
      downloadNotes:['The exercise accepts geom_line() alone or a combination of geom_line() and geom_point().'],
      mistakes:plotMistakes,
      check:plotCheck(`${originalData} %>% filter(gender == "Female")`),success:'Correct: your first line shows the female income profile across all 46 ages. The horizontal position represents age; the vertical position represents mean annual income.',
    },
    {
      id:'graphs-compare',title:'Plot multiple groups',heading:'Two profiles. One set of axes.',...ready,
      intro:'Put the income profile of men and women on the same graph so that their levels and shapes can be compared directly.',
      section:'Map a category to colour',
      body:'<p>Use the full <code>df</code> data frame and add <code>colour = gender</code> <strong>inside</strong> <code>aes()</code>. R assigns a colour to each category, draws separate lines and creates a legend.</p><p>Compare that with <code>geom_line(colour = "darkgreen")</code>: a colour outside <code>aes()</code> is a fixed style for the entire layer. It does not tell R which observations belong to different profiles.</p>',
      example:'female_profile <- df %>% filter(gender == "Female")\n\n# A fixed colour for one line\nggplot(female_profile, aes(x = age, y = annual_income)) +\n  geom_line(colour = "darkgreen")',
      noteTitle:'Use a shared scale for a fair visual comparison.',note:'Both profiles use the same age and income axes. These values are entirely synthetic: differences between the curves are features of the generated data, not evidence about real gender income gaps.',
      taskTitle:'Draw both profiles',task:'<p>Create a line plot named <code>p</code> using all rows of <code>df</code>. Map age to x, annual_income to y and gender to colour. Display the plot.</p>',
      starter:'p <- ggplot(df, aes(\n  x = age, y = annual_income, colour = ______\n)) +\n  geom_line()\np',
      solution:'p <- ggplot(df, aes(\n  x = age, y = annual_income, colour = gender\n)) +\n  geom_line()\np',
      hints:['Put the column name gender inside aes(), without quotation marks.', 'Use colour = gender. Setting colour = "gender" outside aes() does not map the data categories.'],
      mistakes:plotMistakes,
      check:plotCheck(originalData,'annual_income',true),success:'Correct: the graph has a separate line for each gender and a legend. You can now compare incomes at the same age.',
    },
    {
      id:'graphs-labels',title:'Add labels and clear units',heading:'Make the graph readable on its own.',...ready,
      intro:'A useful graph tells its reader what is measured, in which units, and where the numbers come from.',
      section:'Labels should match the values you plot',
      body:'<p>Use <code>labs()</code> to set a title, x and y labels, a legend title through <code>colour</code>, and a caption. <code>theme_minimal()</code> provides a simple background. These components are added with <code>+</code>.</p>',
      example:'p <- ggplot(df, aes(x = age, y = annual_income, colour = gender)) +\n  geom_line() +\n  labs(\n    title = "Income profiles by age",\n    x = "Age", y = "Annual income (in $)",\n    colour = "Gender", caption = "Synthetic data for practice"\n  ) +\n  theme_minimal()\np',
      noteTitle:'Keep the description honest.',note:'annual_income is a group mean, not an individual observation. A label in thousands must correspond to income divided by 1,000. The caption should make clear that the data are synthetic.',
      taskTitle:'Plot income in thousands of dollars',task:'<p>Create <code>plot_data</code> by adding <code>income_thousands = annual_income / 1000</code>. Save the graph as <code>p</code>, with age on x, income_thousands on y and gender as colour. Label the axes <strong>Age</strong> and <strong>Annual income (in 1000$)</strong>. Keep the supplied title, legend title and caption.</p>',
      starter:'plot_data <- df %>%\n  mutate(income_thousands = ______)\n\np <- ggplot(plot_data, aes(\n  x = age, y = ______, colour = gender\n)) +\n  geom_line() +\n  labs(\n    title = "Income profiles by age",\n    x = "Age", y = "Annual income (in 1000$)",\n    colour = "Gender", caption = "Synthetic data for practice"\n  ) +\n  theme_minimal()\np',
      solution:'plot_data <- df %>%\n  mutate(income_thousands = annual_income / 1000)\np <- ggplot(plot_data, aes(\n  x = age, y = income_thousands, colour = gender\n)) +\n  geom_line() +\n  labs(\n    title = "Income profiles by age",\n    x = "Age", y = "Annual income (in 1000$)",\n    colour = "Gender", caption = "Synthetic data for practice"\n  ) +\n  theme_minimal()\np',
      hints:['Use annual_income / 1000 in mutate().', 'Map y to income_thousands, the new column. The y-axis label then matches the plotted values.'],
      mistakes:[...plotMistakes, {when:'exists("p", inherits=FALSE) && inherits(p, "ggplot") && !identical(p$labels$y, "Annual income (in 1000$)")',message:'The plotted incomes are in thousands of dollars. Use the y-axis label Annual income (in 1000$).'}, {when:'exists("p", inherits=FALSE) && inherits(p, "ggplot") && !identical(p$labels$caption, "Synthetic data for practice")',message:'Keep the caption Synthetic data for practice; these are generated practice data.'}],
      check:plotCheck(`${originalData} %>% mutate(income_thousands = annual_income / 1000)`,'income_thousands',true,graphLabels),success:'Correct: the graph shows annual income in thousands of dollars, with a title, labelled axes and a synthetic-data caption.',
    },
    {
      id:'graphs-save',title:'Save a graph',heading:'Save your graph as a file.',...ready,
      downloadFiles:['png','pdf'],setup:`${setup}\n${labelledPlot}`,
      intro:'Save a graph so you can use it in a report, presentation or assignment.',
      section:'Save the graph you already created',
      body:`<p>The example uses the graph from the previous lesson, stored in <code>p</code>.</p>
        <p>To save this graph as a file, use <code>ggsave()</code> from <code>ggplot2</code>. Give it a filename and use <code>plot = p</code> to select the graph. For example, <code>ggsave("income_profiles.png", plot = p)</code> saves it as a PNG image. Change the ending to <code>.pdf</code> to save a PDF instead.</p>
        <p>You can also choose the size of the saved graph with <code>width</code>, <code>height</code> and <code>units</code>. Below, both files are <strong>18 cm wide and 12 cm high</strong>. For the PNG, <code>dpi = 300</code> sets the image resolution to 300 dots per inch. <code>bg = "white"</code> gives the saved graph a white background.</p>`,
      setupNote:null,
      example:`library(ggplot2)

# Recreate and display the graph from the previous lesson
${labelledPlot}
p

# Save this graph as an image file
ggsave("income_profiles.png", plot = p,
       width = 18, height = 12, units = "cm", dpi = 300, bg = "white")

# Save the same graph as a PDF
ggsave("income_profiles.pdf", plot = p,
       width = 18, height = 12, units = "cm", bg = "white")`,
      noteTitle:'Download your saved graph.',
      note:'On this website, ggsave() creates the files in your browser session. Use the download links below the output to save them to your computer. In RStudio, the files are saved in the working directory shown by getwd().',
      taskTitle:'Save the graph as a PNG',
      task:'<p>The graph <code>p</code> from the example is prepared for you. Save it as <code>my_income_plot.png</code>, with a width of <strong>16 cm</strong>, a height of <strong>10 cm</strong> and <code>dpi = 300</code>. Use <code>plot = p</code> and <code>units = "cm"</code>. Download the saved file using the link below the output.</p>',
      starter:'p\n\n# Save the prepared graph\nggsave("______", plot = p,\n       width = ______, height = ______, units = "cm",\n       dpi = ______, bg = "white")',
      solution:'p\n\nggsave("my_income_plot.png", plot = p,\n       width = 16, height = 10, units = "cm",\n       dpi = 300, bg = "white")',
      hints:['Use "my_income_plot.png" as the filename. Keep plot = p to select the prepared graph.', 'Set width = 16, height = 10, units = "cm" and dpi = 300.'],
      check:savedPngCheck,
      success:'Correct: your PNG is 16 cm wide and 10 cm high at 300 dpi. Use the download link to save it to your computer.',
      mistakes:[{when:'!file.exists("my_income_plot.png")',message:'Save the graph with ggsave() using the filename my_income_plot.png.'}, {when:'file.exists("my_income_plot.png")',message:'Check the saved image size and resolution: width = 16, height = 10, units = "cm" and dpi = 300.'}],
      downloadNotes:[
        'Reuse the labelled graph from the previous worked example, then save it with ggsave().',
        'On the website, download the PNG and PDF below the output. In RStudio, ggsave() saves them in the current working directory.',
        'getwd() shows the output folder. An existing file with the same name is replaced.',
        'Your turn: save p as my_income_plot.png at 16 by 10 cm and 300 dpi.',
        'ggsave("my_income_plot.png", plot = p, width = 16, height = 10, units = "cm", dpi = 300, bg = "white")',
      ],
      sources:[{label:'ggsave()',url:'https://ggplot2.tidyverse.org/reference/ggsave.html'}],
    },
  ],
};
