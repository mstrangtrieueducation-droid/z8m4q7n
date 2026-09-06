/* Presentation only. Never use formatted text as an answer key or student input. */
(function (root) {
  'use strict';

  // Protect URLs, email addresses, and dotted abbreviations while spacing prose.
  // Digits on both sides of punctuation remain intact: 1.5, 1,000, and 7:30.
  const protectedToken = /(?:https?:\/\/|www\.)[^\s<>]+|[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}|(?:\p{L}\.){2,}/gu;

  function spaceProse(value, finishChunk) {
    const text = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
    const formatChunk = chunk => finishChunk ? finishChunk(spaceChunk(chunk)) : spaceChunk(chunk);
    let result = '', offset = 0;
    for (const match of text.matchAll(protectedToken)) {
      result += formatChunk(text.slice(offset, match.index)) + match[0];
      offset = match.index + match[0].length;
    }
    return result + formatChunk(text.slice(offset));
  }

  function spaceChunk(text) {
    return text
      .replace(/ +([,;:!?])/g, '$1')
      .replace(/([,;:!?])(?=[\p{L}])/gu, '$1 ')
      .replace(/([,;:!?])(?=\d)/g, (match, mark, offset, source) =>
        /\d/.test(source[offset - 1] || '') ? mark : mark + ' ')
      .replace(/\.(?=\p{L})/gu, '. ');
  }

  const shortAnswer = /^(yes|no)(?:,\s*|\s+)(i|you|we|they|he|she|it|there)\s+(am|is|are|was|were|do|does|did|have|has|had|can|could|will|would|shall|should|may|might|must|cannot|(?:is|are|was|were|do|does|did|have|has|had|ca|could|wo|would|sha|should|must)n['’]t)(\s+not)?\s*([.!?])?$/i;

  const tokens = text => Array.from(String(text).matchAll(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu));
  const fold = text => String(text).toLowerCase().replace(/’/g, "'");
  const signature = text => tokens(text).map(match => fold(match[0])).join(' ');
  const blank = /_{2,}|(?:_\s+){2,}|\.{3,}|…/;
  const leadingNumber = /^\s*\d+[a-z]?[.)]?\s*/i;
  const auxiliary = '(?:am|is|are|was|were|do|does|did|can|could|will|would|shall|should|have|has|had|may|might|must)';
  const questionOpening = new RegExp(String.raw`^(?:${auxiliary}\b|(?:where|when|why|who)(?:['’]s\b|\s+${auxiliary}\b)|(?:what|which|whose|how)(?:['’]s\b|(?:\s+[\p{L}'’-]+){0,4}?\s+${auxiliary}\b))`, 'iu');
  // Prevent instructional sentence capitals from becoming a vocabulary title-case rule.
  const functionWords = new Set(('a an the this that these those i you he she it we they my your his her its our their there what who whose where when which why how am is are was were be been being do does did have has had can could will would shall should may might must yes no not use write choose complete correct look listen read answer question sentence word words picture pictures full').split(' '));

  function context(options) {
    const question = options.question || {}, part = options.part;
    const field = part || question, section = options.section || {};
    const sources = [question.prompt, question.explanation, part && part.label, part && part.explanation];
    const addStrings = value => {
      if (typeof value === 'string') sources.push(value);
      else if (Array.isArray(value)) value.forEach(addStrings);
      else if (value && typeof value === 'object') Object.values(value).forEach(addStrings);
    };
    for (const key of ['wordBank', 'passage', 'reading', 'text', 'context']) addStrings(section[key]);
    return {question, part, field, section, sources:sources.filter(value => typeof value === 'string'), answers:field.answers || []};
  }

  function inferKind(value, options, ctx) {
    if (options.kind) return options.kind;
    const {question, part, section} = ctx;
    const label = part ? String(part.label || '') : '';
    if ((part && /^(?:picture|match|truth)$/.test(part.key || '')) ||
        /^(?:[a-z]|true|false|picture\s+[a-z0-9]+)$/i.test(value) ||
        /^[a-z]\.\s/i.test(value)) return 'label';
    if (part && /picture|definition|matching|match|letter|syllable|pronoun/i.test(label)) return 'fragment';
    if (blank.test(label) || /^complete (?:the|a|an)\b/i.test(label)) return 'fragment';
    if (blank.test(question.prompt || '') && !(part && /^(?:(?:full|complete) )?(?:question|sentence|answer)$|câu (?:hỏi|hoàn chỉnh|trả lời)/i.test(label))) return 'fragment';
    if (part && /(?:full|complete)?\s*question|câu hỏi/i.test(label)) return 'question';
    if (part && /(?:full|complete)\s*(?:sentence|answer)|câu (?:hoàn chỉnh|trả lời)/i.test(label)) {
      // A request to complete a second sentence can still take only a fragment.
      if (/complete the/i.test(label)) return 'fragment';
      return questionOpening.test(value) && !/^there\b/i.test(value) ? 'question' : 'sentence';
    }
    if (part && /word|verb|auxiliary|missing|form of|từ|điền/i.test(label)) return 'fragment';
    if (question.type === 'pair') return 'fragment'; // The caller supplies kind after joining its fixed suffix.
    const title = String(section.title || '');
    const ordering = /correct order|reorder|rearrange/i.test(title);
    const fullTask = ordering || /(?:write|make|rewrite|correct|combine|circle).*(?:sentences?|questions?)/i.test(title) ||
      (/complete.*sentences?/i.test(title) && /\//.test(question.prompt || ''));
    if (fullTask) {
      return questionOpening.test(value) ? 'question' : 'sentence';
    }
    return 'fragment';
  }

  // Take spelling/capitalization and internal punctuation only from an equivalent
  // accepted variant or an exact word sequence in this question's source context.
  function surfaces(value, sources) {
    const wanted = tokens(value).map(match => fold(match[0]));
    if (!wanted.length) return [];
    const found = [];
    for (const source of sources) {
      const words = tokens(source);
      for (let start = 0; start + wanted.length <= words.length; start++) {
        if (!wanted.every((word, index) => word === fold(words[start + index][0]))) continue;
        const first = words[start], last = words[start + wanted.length - 1];
        const end = last.index + last[0].length;
        const ending = source.slice(end).match(/^[.!?](?!\.)/);
        const candidate = source.slice(first.index, end) + (ending ? ending[0] : '');
        // Explanations also contain grammar formulas (Does + subject + verb)
        // and scrambled prompts. Those separators are not answer punctuation.
        if (/^[\p{L}\p{N}\s'’",.;:!?()\-–—]+$/u.test(candidate)) found.push(candidate);
      }
    }
    return found;
  }

  function restoreCase(value, ctx) {
    const names = new Map();
    for (const original of ctx.sources) {
      // Localized vocabulary explanations capitalize the quoted headword after
      // "Từ". That presentation does not turn pour/visit/etc. into proper names.
      const source = original.replace(/((?:từ|cụm từ|the word|the phrase)\s+)([^:.;!?]+?)(?=\s+(?:có nghĩa|nghĩa là|means|là)\b)/giu,
        (_match, prefix, headword) => prefix + headword.toLowerCase());
      for (const word of tokens(source)) {
      const raw = word[0], key = fold(raw);
      if (!/^[A-Z][a-zA-Z'’\-]+$/.test(raw) || functionWords.has(key.replace(/['’]s$/, ''))) continue;
      const prefix = source.slice(0, word.index).replace(leadingNumber, '').trim();
      // A lone sentence-initial Goldfish or Teacher is not evidence of a name.
      const initial = !prefix || /[.!?:]\s*["“'‘(]*$/.test(prefix);
      if (initial && !/['’]s$/.test(raw)) continue;
      names.set(key, raw);
      }
    }
    return value.replace(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu, word => {
      const key = fold(word);
      if (key === 'i') return 'I';
      if (/^i['’](?:m|ve|ll|d)$/.test(key)) return 'I' + word.slice(1);
      return names.get(key) || word;
    });
  }

  function formatContextual(value, options) {
    const ctx = context(options), kind = inferKind(value, options, ctx);
    if (kind === 'label') return value;
    const isFull = kind === 'question' || kind === 'sentence';
    let text = value;
    if (isFull) {
      const variants = [...ctx.answers.filter(answer => signature(answer) === signature(value)), ...surfaces(value, ctx.sources)];
      const score = candidate => (/[.!?]$/.test(candidate) ? 2 : 0) + (candidate.match(/[,;:]/g) || []).length * 2 +
        (candidate.match(/\b[A-Z][A-Za-z]*\b/g) || []).length;
      for (const candidate of variants) if (score(candidate) > score(text)) text = candidate;
    }
    text = restoreCase(spaceProse(text), ctx);
    const prompt = String((ctx.part && ctx.part.label) || ctx.question.prompt || '').replace(leadingNumber, '');
    const startsSentence = /^\s*_{2,}/.test(prompt) || /[.!?]\s*_{2,}/.test(prompt);
    if (isFull) {
      text = spaceProse(text, chunk => chunk.replace(/(^|[.!?]\s+)(["“'‘(]*)([a-z])/g,
        (_match, before, quote, letter) => before + quote + letter.toUpperCase()));
      // Exercise context decides the final sentence's punctuation, not the
      // punctuation-insensitive spelling stored for scoring.
      text = text.replace(/[.!?]+$/, '') + (kind === 'question' ? '?' : '.');
    } else if (startsSentence && text) text = text[0].toUpperCase() + text.slice(1);
    return text;
  }

  function joinAnswer(value, suffix) {
    const text = spaceProse(value), fixed = spaceProse(suffix);
    if (!fixed) return text;
    const main = signature(text), ending = signature(fixed);
    return main === ending || main.endsWith(' ' + ending) ? text : text.replace(/[.!?]+$/, '') + ' ' + fixed;
  }

  function formatAnswer(value, options) {
    const text = spaceProse(value);
    const match = text.match(shortAnswer);
    if (match) {
      const lead = match[1].toLowerCase() === 'yes' ? 'Yes' : 'No';
      const subject = match[2].toLowerCase() === 'i' ? 'I' : match[2].toLowerCase();
      return lead + ', ' + subject + ' ' + match[3].toLowerCase() +
        (match[4] ? ' not' : '') + (match[5] || '.');
    }
    if (options && text) return formatContextual(text, options);
    return text;
  }

  function formatExplanation(value) {
    // Plain text only; callers must retain their normal HTML escaping/rendering.
    // Some localized explanations append '.' to an already punctuated answer.
    // Remove only those duplicate endings; preserve ellipses and decimal dots.
    return spaceProse(value, text => text.replace(/(?<!\.)\.\.(?!\.)/g, '.')
      .replace(/([!?])\.(?!\.)/g, '$1'));
  }

  const api = Object.freeze({formatAnswer, formatExplanation, joinAnswer});
  root.DiscoverAnswerDisplay = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
