import assert from 'node:assert/strict';
import {EditorState, EditorSelection} from '@codemirror/state';
import {insertNewlineAndIndent, indentMore, indentLess, indentSelection} from '@codemirror/commands';
import {rEditorLanguage} from '../src/r-editor.js';
const tests = [
 ['pipe', 'df <- df %>%', 2],
 ['native pipe', 'df <- df |>', 2],
 ['chain', 'df <- df %>%\n  filter(year >= 2000) %>%', 2],
 ['completed chain', 'df <- df %>%\n  filter(year >= 2000)', 0],
 ['pipe with comment', 'df <- df %>% # choose data', 2],
 ['comment between steps', 'df <- df %>%\n  # choose data', 2],
 ['blank between steps', 'df <- df %>%\n', 2],
 ['pipe in string', 'x <- "df %>%"', 0],
 ['pipe in comment', '# df %>%', 0],
 ['plus in string', 'x <- "+"', 0],
 ['plot', 'p <- ggplot(df, aes(age, annual_income)) +', 2],
 ['plot chain', 'p <- ggplot(df, aes(age, annual_income)) +\n  geom_line() +', 2],
 ['completed plot', 'p <- ggplot(df, aes(age, annual_income)) +\n  geom_line()', 0],
 ['function', 'f <- function(x) {', 2],
 ['nested pipe', 'f <- function(x) {\n  x %>%', 4],
 ['nested pipe chain', 'f <- function(x) {\n  x %>%\n    filter(year >= 2000) %>%', 4],
 ['nested completed', 'f <- function(x) {\n  x %>%\n    filter(year >= 2000)', 2],
 ['multiline call in pipe', 'df <- df %>%\n  mutate(\n    x = income * 100\n  ) %>%', 2],
 ['pipe inside call', 'result <- list(\n  df %>%', 4],
 ['loop', 'for (i in 1:3) {', 2],
 ['function complete', 'f <- function(x) {\n  x + 1\n}', 0],
];
for (const [name, code, spaces] of tests) {
 let state=EditorState.create({doc:code,selection:{anchor:code.length},extensions:rEditorLanguage});
 insertNewlineAndIndent({state,dispatch:tr=>state=tr.state});
 assert.equal(state.doc.line(state.doc.lines).text,' '.repeat(spaces),name);
 console.log('PASS',name);
}
const unindented='df <- df %>%\nfilter(year >= 2000) %>%\nmutate(x = income * 100)';
let state=EditorState.create({doc:unindented,extensions:rEditorLanguage,selection:{anchor:0,head:unindented.length}});
indentSelection({state,dispatch:tr=>state=tr.state});
assert.equal(state.doc.toString(),'df <- df %>%\n  filter(year >= 2000) %>%\n  mutate(x = income * 100)');
console.log('PASS reindent selection');
state=state.update({selection:EditorSelection.range(0,state.doc.length)}).state;
let before=state.doc.toString();
indentMore({state,dispatch:tr=>state=tr.state});
assert.equal(state.doc.toString(),before.split('\n').map(line=>'  '+line).join('\n'));
indentLess({state,dispatch:tr=>state=tr.state});
assert.equal(state.doc.toString(),before);
console.log('PASS selection indent and outdent');
