/* Shared by every Discover written test. Compare answers without losing word boundaries. */
(function (root) {
  'use strict';
  function normalize(value) {
    return String(value == null ? '' : value)
      .normalize('NFKC').toLowerCase()
      .replace(/[\u2018\u2019\u02bc\u0060]/g, "'")
      .replace(/[\u200b-\u200d\ufeff]/g, '')
      .replace(/[\u2010-\u2015-]/g, ' ')
      // Commas separate words. Deleting one would turn "No,she" into "Noshe".
      .replace(/[,;:!?\u2026]/g, ' ')
      // Keep decimal points so 1.5 cannot match 15.
      .replace(/\./g, (dot, offset, text) => /\d/.test(text[offset - 1] || '') && /\d/.test(text[offset + 1] || '') ? dot : ' ')
      .replace(/\s+/g, ' ').trim();
  }
  const negatives = {
    "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
    "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
    "can't": 'cannot', "couldn't": 'could not', "won't": 'will not', "wouldn't": 'would not',
    "shouldn't": 'should not', "mustn't": 'must not', "hasn't": 'has not', "haven't": 'have not', "hadn't": 'had not'
  };
  function canonical(value) {
    return normalize(value).replace(/\b(?:isn't|aren't|wasn't|weren't|don't|doesn't|didn't|can't|couldn't|won't|wouldn't|shouldn't|mustn't|hasn't|haven't|hadn't)\b/g, word => negatives[word])
      .replace(/\bcan not\b/g, 'cannot');
  }
  function matches(value, accepted) {
    if (!Array.isArray(accepted)) throw new TypeError('Expected an array of accepted answers');
    const candidate = canonical(value);
    return candidate !== '' && accepted.some(answer => canonical(answer) === candidate);
  }
  // Mark a dependent picture answer against the word the learner actually wrote.
  // A valid word still earns its point when the picture is mismatched.
  function gradeRelations(question, parts) {
    if (!question.answerRelations) return parts;
    for (const part of parts) {
      if (part.type !== 'pictureChoice') continue;
      const compatible = question.answerRelations.filter(relation =>
        parts.filter(other => other !== part).every(other => matches(other.value, [relation[other.key]])));
      if (compatible.length) {
        part.answers = compatible.map(relation => relation[part.key]);
        part.correct = matches(part.value, part.answers);
        part.explanation = 'Chọn hình tương ứng với tên nhạc cụ em đã viết: flute – a; clarinet – b.';
      }
    }
    return parts;
  }
  const api = Object.freeze({normalize, canonical, matches, gradeRelations});
  root.DiscoverAnswerMatcher = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
