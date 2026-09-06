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

  function formatAnswer(value, options) {
    const text = spaceProse(value);
    const match = text.match(shortAnswer);
    if (match) {
      const lead = match[1].toLowerCase() === 'yes' ? 'Yes' : 'No';
      const subject = match[2].toLowerCase() === 'i' ? 'I' : match[2].toLowerCase();
      return lead + ', ' + subject + ' ' + match[3].toLowerCase() +
        (match[4] ? ' not' : '') + (match[5] || '.');
    }
    // Only the caller can identify a full sentence from the exercise context.
    // The default leaves vocabulary, blanks, picture labels, and fragments alone.
    if (options && (options.kind === 'sentence' || options.kind === 'question') && text) {
      const capitalized = text[0].toUpperCase() + text.slice(1);
      return /[.!?]$/.test(capitalized) ? capitalized : capitalized +
        (options.kind === 'question' ? '?' : '.');
    }
    return text;
  }

  function formatExplanation(value) {
    // Plain text only; callers must retain their normal HTML escaping/rendering.
    // Some localized explanations append '.' to an already punctuated answer.
    // Remove only those duplicate endings; preserve ellipses and decimal dots.
    return spaceProse(value, text => text.replace(/(?<!\.)\.\.(?!\.)/g, '.')
      .replace(/([!?])\.(?!\.)/g, '$1'));
  }

  const api = Object.freeze({formatAnswer, formatExplanation});
  root.DiscoverAnswerDisplay = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
