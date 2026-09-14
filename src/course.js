import { module2 } from './module2.js';
import { module3 } from './module3.js';
import { module4 } from './module4.js';
import { module5 } from './module5.js';
import { module6 } from './module6.js';
import { module7 } from './module7.js';
import { module8 } from './module8.js';
import { module9 } from './module9.js';
// Lesson text is authored as HTML; student code/output is always rendered as text.
export const modules = [
  {
    id: 'module-1', number: '01', title: 'First steps in R', titleMarker: 'Basics',
    description: 'Use a fictional UBI expansion to practise arithmetic, powers, objects and debugging.',
    lessons: [
      {
        id: 'calculator', title: 'R as a calculator', heading: 'A small calculation. A first step in R.',
        intro: 'Suppose a universal basic income (UBI) payment increases from $1,000 to $1,100 per month. How much extra does each person receive in a year? Let’s ask R.',
        section: 'Start with what you know',
        body: '<p>R can work like a calculator. Use <code>+</code> to add, <code>-</code> to subtract, <code>*</code> to multiply, <code>/</code> to divide and <code>^</code> to raise a number to a power. The result appears underneath your code.</p><p>In this fictional UBI expansion, the extra payment is <strong>1,100 − 1,000 = $100 per month</strong>. Multiply by 12 for the annual increase. Parentheses make R calculate the monthly difference first: <code>(1100 - 1000) * 12</code>.</p>',
        example: '# Additional UBI per person per year\n(1100 - 1000) * 12',
        noteTitle: 'A number has a meaning.', note: 'The result is the additional annual UBI payment in dollars per person. The [1] in R’s output marks the first element; it is not part of your answer.',
        taskTitle: 'Try a larger UBI expansion', task: '<p>The monthly UBI payment increases from <strong>$1,000 to $1,125</strong>. Calculate the <strong>additional amount per person over one year</strong>. Replace <code>______</code> with your own R code, then select <strong>Check answer</strong>.</p>',
        starter: '# Additional annual UBI when the monthly payment rises from $1,000 to $1,125\n______',
        solution: '(1125 - 1000) * 12', hints: ['Subtract the original monthly payment from the new monthly payment to find the increase.', 'Multiply the monthly difference by 12: (new payment - original payment) * 12.'],
        check: 'is.numeric(.answer) && length(.answer) == 1 && isTRUE(all.equal(as.numeric(.answer), 1500))',
        success: 'Correct: the UBI expansion adds $1,500 per person per year. You have executed your first policy calculation in R.',
        mistakes: [{when:'is.numeric(.answer) && length(.answer) == 1 && .answer == 137',message:'You added 12 to the monthly increase. Multiply by 12 to count all twelve payments.'},{when:'is.numeric(.answer) && length(.answer) == 1 && .answer == 13500',message:'That is the full new annual UBI payment. Subtract the original monthly payment first to calculate the additional amount.'}],
      },
      {
        id: 'objects', title: 'Saving values in objects', heading: 'Give your numbers a name.',
        intro: 'An object lets you save a value and use it again. Clear names make a calculation easier to check.',
        section: 'Read the assignment arrow as “gets”',
        body: '<p><code>monthly_increase &lt;- 100</code> means: save 100 under the name <code>monthly_increase</code>. Here it is the extra UBI per month. Assignment itself usually prints nothing. Write an object’s name on a new line to see its value.</p><p>R runs the lines from top to bottom. If you change an input, run the dependent calculations again. Names are case-sensitive: <code>monthly_increase</code> and <code>Monthly_increase</code> are different objects. Use names without spaces.</p>',
        example: '# Save the monthly UBI increase per person\nmonthly_increase <- 100\n\n# Calculate the additional annual payment\nannual_increase <- monthly_increase * 12\nannual_increase',
        noteTitle: 'Comments explain your reasoning.', note: 'Everything after # on a line is a comment. R ignores it. Use comments to describe units, assumptions or why you chose a value.',
        taskTitle: 'Budget for the UBI expansion',task: '<p>In a country, <strong>200 people</strong> each receive an extra <strong>$150 per month</strong>. Save 150 as <code>monthly_increase</code> and 200 as <code>recipients</code>. Calculate <code>annual_budget</code>, the total additional UBI payments the state must make over one year, and display it.</p>',
        starter: 'monthly_increase <- ______\nrecipients <- ______\n\nannual_budget <- ______\nannual_budget',
        solution: 'monthly_increase <- 150\nrecipients <- 200\nannual_budget <- monthly_increase * 12 * recipients\nannual_budget',
        hints: ['Start by replacing the first two blanks with the numbers in the task.', 'Multiply the monthly increase by 12 and by the number of recipients.'],
        check: 'exists("monthly_increase", inherits=FALSE) && exists("recipients", inherits=FALSE) && exists("annual_budget", inherits=FALSE) && isTRUE(all.equal(monthly_increase, 150)) && isTRUE(all.equal(recipients, 200)) && isTRUE(all.equal(annual_budget, 360000))',
        success: 'Correct: the UBI expansion requires $360,000 in additional annual payments for these 200 recipients.',
      },
      {
        id:'errors',exampleError:true,title:'Reading and fixing errors',heading:'An error is a useful clue.',
        intro:'Everyone encounters errors. Learn to identify the message, find the relevant line and make one change at a time.',
        section:'Numbers and text',
        body:'<p><code>100</code> is a number. <code>"100"</code> is text, because it is inside quotation marks. You cannot directly multiply text. Use a decimal point for numbers: write <code>0.03</code>, not <code>0,03</code>.</p>',
        example:'# This UBI calculation intentionally contains an error.\nmonthly_increase <- "100"\nmonthly_increase * 12',
        noteTitle:'Read the error before editing.',note:'“Non-numeric argument to binary operator” means an arithmetic operation received something other than a number. Remove the quotation marks around 100 and run the example again.',
        taskTitle:'Repair the UBI calculation',task:'<p>This code contains two problems: the monthly UBI increase is stored as text, and an object name has the wrong capitalisation. Fix it so <code>annual_increase</code> equals <strong>1,200</strong> and its value is printed.</p>',
        starter:'monthly_increase <- "100"\nannual_increase <- Monthly_increase * 12\nannual_increase',
        solution:'monthly_increase <- 100\nannual_increase <- monthly_increase * 12\nannual_increase',hints:['Remove the quotation marks around 100 so R treats it as a number.', 'Match monthly_increase exactly on both lines, including its lower-case m. The final line displays annual_increase.'],
        check:'exists("annual_increase", inherits=FALSE) && isTRUE(all.equal(annual_increase, 1200)) && isTRUE(all.equal(.answer, 1200))',success:'All fixed. You can now read, change and debug a small R calculation. Next: calculate several values at once.',
      },
    ],
  },
  module2,
  module3,
  module4,
  module5,
  module6,
  module7,
  module8,
  module9,
];
