export const module9 = {
  id:'module-9', number:'09', title:'R & RStudio',
  description:'Install R and RStudio, run a script and keep your tutorial work in a project.',
  lessons:[
    {
      id:'desktop-install', title:'Install R and RStudio', guide:true,
      heading:'Your own computer. The same R skills.',
      intro:'Move from the browser exercises to RStudio on your computer. Follow these steps on the computer you will use for the tutorials.',
      section:'Install R first, then RStudio Desktop',
      body:`<p><strong>R</strong> performs the calculations. <strong>RStudio</strong> is the application in which you write scripts, run R and view results. Install both, in this order.</p>
        <ol class="guide-steps">
          <li><strong>Install R from CRAN.</strong> Choose your operating system below, download its installer and follow the installation steps.</li>
        </ol>
        <div class="install-options">
          <div><h3>Windows</h3><p>Download the current R installer (<code>.exe</code>) and run it.</p><a href="https://cran.r-project.org/bin/windows/base/" target="_blank" rel="noopener noreferrer">R for Windows ↗</a></div>
          <div><h3>macOS</h3><p>Choose the <code>.pkg</code> for Apple silicon (arm64) or Intel (x86_64). Find your chip under Apple menu → About This Mac.</p><a href="https://cran.r-project.org/bin/macosx/" target="_blank" rel="noopener noreferrer">R for macOS ↗</a></div>
          <div><h3>Linux</h3><p>Follow CRAN’s instructions for your distribution.</p><a href="https://cran.r-project.org/bin/linux/" target="_blank" rel="noopener noreferrer">R for Linux ↗</a></div>
        </div>
        <ol class="guide-steps" start="2">
          <li><strong>Install RStudio Desktop.</strong> Use the <a href="https://posit.co/download/rstudio-desktop/" target="_blank" rel="noopener noreferrer">free, open-source Desktop download from Posit</a> for your system. On Windows, run the installer; on Mac, open the disk image and drag RStudio to Applications. For Linux, follow the package instructions. Check the operating-system requirements on the download page.</li>
          <li><strong>Open RStudio.</strong> Find the <strong>Console</strong> tab and its <code>&gt;</code> prompt. Type each line below there and press Enter. R should print its version and the answer <strong>4</strong>.</li>
        </ol>`,
      example:'# Run in the RStudio Console\nR.version.string\n2 + 2',
      noteTitle:'Check the installation in RStudio.',
      note:'The R interpreter on this website runs in your browser. Its results cannot confirm that R or RStudio is installed on your computer. If RStudio cannot find R, finish installing R, then close and reopen RStudio.',
      guideAfter:'<p>Continue once <code>2 + 2</code> returns <code>4</code> in the RStudio Console. You can then run the same calculations and functions you used in this course.</p>',
      downloadNotes:['Install R from https://cran.r-project.org/ first.', 'Then install RStudio Desktop: https://posit.co/download/rstudio-desktop/', 'Open RStudio and run the following lines in its Console. Expected answer: 4.'],
      sources:[{label:'RStudio installation and downloads',url:'https://docs.posit.co/ide/user/'}],
    },
    {
      id:'desktop-script', title:'Write and run an R script', guide:true,
      heading:'Write it once. Run it again.',
      intro:'A script saves your instructions in a .R file. The Console shows what happens when those instructions run.',
      section:'Find your way around RStudio',
      body:`<p>RStudio usually has four main panes, as shown below. The <strong>Source</strong> pane appears when you open a script. If it is not visible, choose <strong>File → New File → R Script</strong>.</p>
        <figure class="rstudio-overview">
          <img src="images/rstudio-panes.png" width="2184" height="1964" alt="RStudio with Source at the top left, Console at the bottom left, Environment at the top right and Output with a plot at the bottom right." loading="lazy">
          <figcaption>RStudio’s default layout. Screenshot: <a href="https://docs.posit.co/ide/user/ide/guide/ui/ui-panes.html" target="_blank" rel="noopener noreferrer">Posit’s user guide</a>.</figcaption>
        </figure>
        <dl class="rstudio-panes">
          <div><dt><span>Top left</span>Source · your code</dt><dd>Write and edit your R scripts here. Use <strong>Run</strong> to execute the selected code.</dd></div>
          <div><dt><span>Top right</span>Environment · your objects</dt><dd>See the objects you have created, such as variables, vectors, data frames and functions.</dd></div>
          <div><dt><span>Bottom left</span>Console · commands and results</dt><dd>R executes commands here and shows results or error messages. You can also type commands at the <code>&gt;</code> prompt.</dd></div>
          <div><dt><span>Bottom right</span>Output · figures and more</dt><dd><strong>Plots</strong> shows figures; <strong>Files</strong> shows files and folders; <strong>Packages</strong> lists installed packages; <strong>Help</strong> explains functions.</dd></div>
        </dl>
        <h2>Create a script and execute it in order</h2>
        <ol class="guide-steps">
          <li>Choose <strong>File → New File → R Script</strong> in RStudio. Paste the code below into the script editor.</li>
          <li>Save it as <code>first_script.R</code> using <strong>Ctrl + S</strong> (Windows/Linux) or <strong>Cmd + S</strong> (Mac).</li>
          <li>Put the cursor on a line and click <strong>Run</strong>. The shortcut is <strong>Ctrl + Enter</strong> on Windows/Linux or <strong>Cmd + Return</strong> on Mac. Select several lines to run them together.</li>
          <li>Run the lines from top to bottom. The Console prints <strong>30,000</strong>; the <strong>Environment</strong> pane lists your objects, and <strong>Plots</strong> shows the graph.</li>
        </ol>`,
      example:'# A short script using fictional incomes\nincomes <- c(20000, 30000, 40000)\nmean_income <- mean(incomes)\nprint(mean_income)\n\nplot(incomes, type = "b",\n     xlab = "Observation", ylab = "Annual income")',
      noteTitle:'Saving and running are separate actions.',
      note:'Saving preserves the code in the file. Running sends it to R. When you change an input, run that line and all calculations that depend on it again. Objects remain available during an RStudio session; the browser exercises start fresh on each run.',
      guideAfter:`<h2>Run the whole script</h2><p>Click <strong>Source</strong> in the script toolbar to execute the whole file. Explicit <code>print()</code> calls display results when sourcing; use <strong>Source with Echo</strong> in its menu to also show the commands.</p>
        <p>Now change the first income to <code>25000</code>, save and run the script again. The new mean should be about <strong>31,666.67</strong>. In the Console, a <code>+</code> prompt means R is waiting for an unfinished expression; press <strong>Esc</strong> and check brackets or quotes.</p>
        <h2>Inspect a data frame with View()</h2>
        <p>In RStudio, <code>View(df)</code> opens the data frame <code>df</code> in the <strong>Data Viewer</strong>. It displays your data in rows and columns, similar to an Excel spreadsheet. You can scroll through the data and click a column heading to sort the displayed rows.</p>
        <p>Try it with the incomes from your script. First store them in a data frame named <code>df</code>, then open it:</p>
        <pre class="guide-inline-code"><code>df &lt;- data.frame(annual_income = incomes)
View(df)</code></pre>
        <p>To continue coding, click your script’s tab again.</p>`,
      downloadNotes:['Default panes: Source (top left), Console (bottom left), Environment (top right), Output with Plots/Files/Packages/Help (bottom right).', 'Create first_script.R in RStudio using File > New File > R Script.', 'Run a line or selection: Ctrl+Enter (Windows/Linux), Cmd+Return (Mac).', 'Run the whole file with Source. print() makes results visible when sourcing.', 'Optional practice: change 20000 to 25000. The new mean is about 31666.67.', 'After running the example, try these two lines in RStudio:', 'df <- data.frame(annual_income = incomes)', 'View(df)', 'View(df) opens an Excel-like table in the Data Viewer.'],
      sources:[{label:'RStudio pane layout',url:'https://docs.posit.co/ide/user/ide/guide/ui/ui-panes.html'},{label:'Running code in RStudio',url:'https://docs.posit.co/ide/user/ide/guide/code/execution.html'},{label:'RStudio keyboard shortcuts',url:'https://docs.posit.co/ide/user/ide/reference/shortcuts.html'},{label:'RStudio Data Viewer',url:'https://docs.posit.co/ide/user/ide/guide/data/data-viewer.html'}],
    },
    {
      id:'desktop-project', title:'Projects, packages and course code', guide:true,
      heading:'Keep your code. Bring it to the tutorial.',
      intro:'Use one project folder for your scripts and data, then open the course downloads in RStudio.',
      section:'Set up a place for your course work',
      body:`<p>Choose <strong>File → New Project → New Directory → New Project</strong> and name the folder <code>mvpf-course</code>. Save your scripts there. Reopen the project using its <code>.Rproj</code> file. R then uses this folder as its working directory.</p>
        <p>For a separate CSV, create a <code>data</code> subfolder and place the file inside it. For example, <code>read.csv("data/data_incomes.csv")</code> refers to a file inside your project. If R cannot find a file, check its location and spelling.</p>
        <h2>Install once, load each session</h2><p>Packages add functions to R. Run the following command <strong>once in the RStudio Console</strong> to install the course packages. This needs an internet connection.</p>
        <pre class="guide-inline-code"><code>install.packages(c("dplyr", "tidyr", "ggplot2", "readxl", "writexl"))</code></pre>
        <p>Then put the <code>library()</code> lines at the top of each script that needs these packages. They load installed packages into your current R session. Run this small example after installation:</p>`,
      packages:['dplyr','tidyr','ggplot2','readxl','writexl'],
      example:'library(dplyr)\nlibrary(tidyr)\nlibrary(ggplot2)\n\npractice <- data.frame(income = c(20000, 30000, 40000))\nsummary_income <- practice %>%\n  summarise(mean_income = mean(income))\nprint(summary_income)',
      noteTitle:'Use the downloads from this course.',
      note:'Download code contains the complete examples and solutions for a module. Save a downloaded .R file in your project, open it with File → Open File and run it from the top. Course downloads embed their practice data, so they do not need a separate CSV download.',
      guideAfter:'<p>If R reports “there is no package called …”, install that package, then run <code>library()</code> again. “Object not found” usually means an earlier line has not run or a name is misspelled.</p><p>Before a tutorial, save your script and use <strong>Session → Restart R</strong>, then run the file from the beginning. A script that recreates its own inputs is easier to reuse and share.</p>',
      downloadNotes:['Create mvpf-course with File > New Project > New Directory > New Project.', 'Save scripts in the project folder and reopen its .Rproj file to continue.', 'Install the packages listed at the top of this download before running it.', 'Expected mean_income: 30000. Restart R and run from the beginning to check your workflow.'],
      sources:[{label:'RStudio projects',url:'https://docs.posit.co/ide/user/ide/guide/code/projects.html'},{label:'Installing R packages',url:'https://stat.ethz.ch/R-manual/R-devel/library/utils/html/install.packages.html'}],
    },
  ],
};
