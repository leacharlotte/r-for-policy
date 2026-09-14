import { StreamLanguage, indentOnInput, indentUnit } from '@codemirror/language';
import { r } from '@codemirror/legacy-modes/mode/r';

const depthOf = context => context.prev ? 1 + depthOf(context.prev) : 0;

// The legacy R parser handles brackets, but not pipe or ggplot continuations.
// Keep their starting indentation at each nesting level so chains do not drift right.
const courseR = {
  ...r,
  startState(unit) {
    return { ...r.startState(unit), continuations: [] };
  },
  token(stream, state) {
    if (stream.sol()) {
      state.lineIndent = stream.indentation();
      state.hasCode = false;
      state.continues = false;
    }
    const style = r.token(stream, state);
    if (style !== 'comment' && /\S/.test(stream.current())) {
      state.hasCode = true;
      state.continues = (style === 'operator' || style === 'variableName.special') &&
        /^(%>%|\|>|\+)$/.test(stream.current());
    }
    if (stream.eol() && state.hasCode) {
      const depth = depthOf(state.ctx);
      const previous = state.continuations.find(item => item.depth === depth);
      state.continuations = state.continuations.filter(item => item.depth < depth);
      if (state.continues) {
        state.continuations.push({ depth, indent: previous?.indent ?? state.lineIndent });
      }
    }
    return style;
  },
  indent(state, textAfter, context) {
    const normal = r.indent(state, textAfter, context);
    const continuation = state.continuations.find(item => item.depth === depthOf(state.ctx));
    if (!continuation || textAfter[0] === state.ctx.type) return normal;
    return Math.max(normal, continuation.indent + context.unit);
  },
  languageData: {
    ...r.languageData,
    indentOnInput: /^\s*[\])}]$/,
  },
};

export const rEditorLanguage = [StreamLanguage.define(courseR), indentUnit.of('  '), indentOnInput()];
