const form = document.querySelector("#testForm");
const root = document.querySelector("#sections");
const jumpRoot = document.querySelector("#sectionJump");
const progressText = document.querySelector("#progressText");
const progressBar = document.querySelector("#progressBar");
const results = document.querySelector("#results");
const answerReview = document.querySelector("#answerReview");
const scoreValue = document.querySelector("#scoreValue");
const scoreMessage = document.querySelector("#scoreMessage");
const STORAGE_KEY = "discover3-written-test8-v1-source-audit-v2";

validateTest();
render();
restore();
update();

form.addEventListener("click", (event) => {
  const button = event.target.closest("[data-choice]");
  if (!button) return;
  const group = button.closest("[data-choice-group]");
  group.querySelectorAll("[data-choice]").forEach((item) => {
    const selected = item === button;
    item.classList.toggle("is-selected", selected);
    item.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  group.dataset.value = button.dataset.value;
  button.closest(".question").classList.remove("is-missing");
  save();
  update();
});

form.addEventListener("input", (event) => {
  if (!event.target.matches("input")) return;
  event.target.closest(".question")?.classList.remove("is-missing");
  save();
  update();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  document.querySelectorAll(".is-missing").forEach((item) => item.classList.remove("is-missing"));
  const incomplete = missing();
  if (incomplete.length) {
    incomplete.forEach((item) => item.closest(".question").classList.add("is-missing"));
    document.querySelector("#submitHelp").textContent = `The test is missing ${incomplete.length} response${incomplete.length === 1 ? "" : "s"}. Complete the highlighted item before viewing the answers.`;
    incomplete[0].scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  grade();
});

document.querySelector("#restartTest").onclick = () => {
  if (confirm("Clear every answer and start this test again?")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
};

document.querySelector("#reviewMistakes").onclick = () => {
  (document.querySelector(".review-card.is-wrong") || answerReview).scrollIntoView({ behavior: "smooth" });
};

function validateTest() {
  const sectionPoints = sections.reduce((total, section) => total + section.points, 0);
  const questionPoints = sections.reduce((total, section) => total + section.questions.reduce((sum, question) => sum + question.points, 0), 0);
  const ids = sections.flatMap((section) => section.questions.map((question) => question.id));
  if (sectionPoints !== TOTAL_POINTS || questionPoints !== TOTAL_POINTS) throw new Error(`Test points do not total ${TOTAL_POINTS}.`);
  if (new Set(ids).size !== ids.length) throw new Error("Question IDs must be unique.");
  sections.forEach((section) => {
    const points = section.questions.reduce((sum, question) => sum + question.points, 0);
    if (points !== section.points) throw new Error(`Section ${section.key} has ${points} question points but declares ${section.points}.`);
    section.questions.forEach((question) => {
      if (question.type === "paired" || question.type === "pictureWord") {
        if (!Array.isArray(question.parts) || !question.parts.length) {
          throw new Error(`${question.id} must have at least one answer part.`);
        }
        const partKeys = question.parts.map((part) => part.key);
        if (new Set(partKeys).size !== partKeys.length) throw new Error(`${question.id} has duplicate answer-part keys.`);
        question.parts.forEach((part) => {
          if (!Array.isArray(part.answers) || !part.answers.length) throw new Error(`${question.id}.${part.key} has no accepted answer.`);
        });
      } else {
        if (question.points !== 1) throw new Error(`${question.id} must be worth exactly one point.`);
        if (!Array.isArray(question.answers) || !question.answers.length) throw new Error(`${question.id} has no accepted answer.`);
      }
      if (question.type === "pictureWord" || question.type === "pictureChoice") {
        const pictureValues = question.pictures.map((picture) => picture.value);
        const numericLabels = pictureValues[0] === "1";
        const expectedValues = pictureValues.map((_, index) => numericLabels ? String(index + 1) : String.fromCharCode(97 + index));
        if (pictureValues.join(",") !== expectedValues.join(",")) {
          throw new Error(`${question.id} must preserve the original sequential picture labels.`);
        }
        const picturePart = question.type === "pictureChoice" ? question : question.parts.find((part) => part.type === "pictureChoice");
        if (!picturePart || !picturePart.answers.every((answer) => pictureValues.includes(answer))) {
          throw new Error(`${question.id} has an invalid picture answer.`);
        }
      }
    });
  });
}

function render() {
  sections.forEach((section) => {
    const jump = document.createElement("button");
    jump.type = "button";
    jump.textContent = section.label;
    jump.dataset.jump = section.key;
    jump.title = section.title;
    jump.onclick = () => document.querySelector("#section-" + section.key).scrollIntoView({ behavior: "smooth" });
    jumpRoot.appendChild(jump);

    const element = document.createElement("section");
    element.className = "test-section";
    element.id = "section-" + section.key;
    element.innerHTML = `
      <header class="section-heading">
        <span class="section-letter">${section.label}</span>
        <div><h2>${section.title}</h2><p>${section.note}</p></div>
        <span class="section-points">/${section.points}</span>
      </header>
      ${section.audio ? `<div class="audio-panel"><p>Audio for section ${section.label}</p><audio controls preload="metadata" src="${section.audio}"></audio></div>` : ""}
      ${wordBank(section)}
      ${section.sectionImage ? `<img class="source-image ${section.key === "J" ? "compact" : ""}" src="${section.sectionImage}" alt="Source material for section ${section.label}">` : ""}
      <div class="question-list">${section.questions.map((question, index) => questionMarkup(section, question, index)).join("")}</div>`;
    root.appendChild(element);
  });
}

function wordBank(section) {
  if (!section.wordBank) return "";
  return `<div class="word-bank"><span class="word-bank-title">WORD BOX</span><div class="word-bank-items">${section.wordBank.map((word) => `<span>${word}</span>`).join("")}</div></div>`;
}

function questionMarkup(section, question, index) {
  const visibleNumber = index + 1;
  let control = "";
  if (question.type === "choice") control = choiceMarkup(question.id, question.options);
  if (question.type === "input") control = inputMarkup(question.id);
  if (question.type === "pictureChoice") {
    control = `<div class="picture-choice-grid" data-choice-group data-field="${question.id}">
      ${question.pictures.map((picture) => `<button type="button" class="picture-choice" data-choice data-value="${picture.value}" aria-pressed="false"><img src="${picture.image}" alt="Picture ${picture.value}"><span>${picture.value}</span></button>`).join("")}
    </div>`;
  }
  if (question.type === "paired") {
    control = `<div class="paired-inputs">${question.parts.map((part) => partMarkup(question.id, part)).join("")}</div>`;
  }
  if (question.type === "pictureWord") {
    const picturePart = question.parts.find((part) => part.type === "pictureChoice");
    const wordPart = question.parts.find((part) => part.type === "input");
    control = `
      <div class="picture-choice-grid" data-choice-group data-field="${question.id}.${picturePart.key}">
        ${question.pictures.map((picture) => `<button type="button" class="picture-choice" data-choice data-value="${picture.value}" aria-pressed="false"><img src="${picture.image}" alt="Picture ${picture.value}"><span>${picture.value}</span></button>`).join("")}
      </div>
      <label class="input-label">${wordPart.label}${inputMarkup(`${question.id}.${wordPart.key}`)}</label>`;
  }
  return `<article class="question" data-id="${question.id}" data-points="${question.points}">
    <span class="question-number">${visibleNumber}</span>
    <div class="question-copy">
      ${question.image ? `<img class="question-image" src="${question.image}" alt="Picture for question ${visibleNumber}">` : ""}
      <p class="question-prompt">${question.prompt}</p>
      ${control}
    </div>
  </article>`;
}

function partMarkup(questionId, part) {
  const field = `${questionId}.${part.key}`;
  if (part.type === "choice") return `<div class="input-label"><span>${part.label}</span>${choiceMarkup(field, part.options)}</div>`;
  return `<label class="input-label">${part.label}${inputMarkup(field)}</label>`;
}

function choiceMarkup(field, options) {
  return `<div class="choice-grid" data-choice-group data-field="${field}">${options.map((option, index) => `<button type="button" class="choice" data-choice data-value="${escapeHtml(option)}" aria-pressed="false"><span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${option}</span></button>`).join("")}</div>`;
}

function inputMarkup(field) {
  return `<input class="answer-input" data-field="${field}" autocomplete="off" spellcheck="false" placeholder="Type your answer">`;
}

function atomicParts(question) {
  if (question.parts) return question.parts.map((part) => ({ ...part, field: `${question.id}.${part.key}` }));
  return [{ type: question.type, answers: question.answers, explanation: question.explanation, field: question.id, label: question.prompt }];
}

function fieldElement(field) {
  return document.querySelector(`[data-field="${cssEscape(field)}"]`);
}

function getValue(field) {
  const element = fieldElement(field);
  if (!element) return "";
  return element.matches("input") ? element.value : element.dataset.value || "";
}

function setValue(field, value) {
  const element = fieldElement(field);
  if (!element) return;
  if (element.matches("input")) {
    element.value = value;
    return;
  }
  element.dataset.value = value;
  element.querySelectorAll("[data-choice]").forEach((button) => {
    const selected = button.dataset.value === value;
    button.classList.toggle("is-selected", selected);
    button.setAttribute("aria-pressed", selected ? "true" : "false");
  });
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[\u2018\u2019`]/g, "'").replace(/[?.!,]/g, "").replace(/-/g, " ").replace(/\s+/g, " ").trim();
}

function matches(value, accepted) { return DiscoverAnswerMatcher.matches(value, accepted); }

function missing() {
  const output = [];
  sections.forEach((section) => section.questions.forEach((question) => {
    atomicParts(question).forEach((part) => {
      if (!getValue(part.field).trim()) output.push(fieldElement(part.field));
    });
  }));
  return output;
}

function grade() {
  let score = 0;
  const reviews = [];
  sections.forEach((section) => section.questions.forEach((question, index) => {
    const partReviews = atomicParts(question).map((part) => {
      const value = getValue(part.field);
      const correct = matches(value, part.answers);
      return { ...part, value, correct };
    });
    DiscoverAnswerMatcher.gradeRelations(question, partReviews);
    const allCorrect = partReviews.every((part) => part.correct);
    const earned = question.points === partReviews.length
      ? partReviews.filter((part) => part.correct).length
      : (allCorrect ? question.points : 0);
    score += earned;
    reviews.push({ section, question, number: index + 1, parts: partReviews, earned, correct: allCorrect });
  }));

  scoreValue.textContent = score;
  scoreMessage.textContent = score === TOTAL_POINTS
    ? "Every answer is correct."
    : `Review ${TOTAL_POINTS - score} point${TOTAL_POINTS - score === 1 ? "" : "s"} and compare each explanation with the original question.`;
  answerReview.innerHTML = reviews.map(reviewMarkup).join("");
  results.hidden = false;
  form.hidden = true;
  document.querySelector("#stickyProgress").hidden = true;
  results.scrollIntoView({ behavior: "smooth" });
}

function reviewMarkup(review) {
  const answers = review.parts.map((part) => `
    <div class="review-part ${part.correct ? "" : "is-wrong"}">
      ${review.parts.length > 1 ? `<p><b>${part.label || "Answer"}</b></p>` : ""}
      <div class="review-answer"><span>Your answer: <b>${html(part.value || "(blank)")}</b></span><span>Correct answer: <b>${html(DiscoverAnswerDisplay.formatAnswer(part.answers[0]))}</b></span></div>
      <p class="explanation"><b>Explanation:</b> ${escapeHtml(DiscoverAnswerDisplay.formatExplanation(part.explanation))}</p>
    </div>`).join("");
  return `<article class="review-card ${review.correct ? "" : "is-wrong"}">
    <div class="review-head"><h3>Section ${review.section.label}, question ${review.number}</h3><span class="review-status">${review.earned}/${review.question.points} point${review.question.points === 1 ? "" : "s"}</span></div>
    <p class="review-question">${review.question.prompt}</p>
    ${answers}
  </article>`;
}

function update() {
  let total = 0;
  sections.forEach((section) => {
    let completed = 0;
    section.questions.forEach((question) => {
      const complete = atomicParts(question).every((part) => getValue(part.field).trim());
      if (complete) {
        total += question.points;
        completed += question.points;
      }
    });
    const jump = document.querySelector(`[data-jump="${section.key}"]`);
    jump.classList.toggle("has-progress", completed > 0);
    jump.classList.toggle("is-complete", completed === section.points);
  });
  progressText.textContent = `${total} / ${TOTAL_POINTS}`;
  progressBar.style.width = `${(total / TOTAL_POINTS) * 100}%`;
}

function save() {
  const data = {};
  sections.forEach((section) => section.questions.forEach((question) => atomicParts(question).forEach((part) => {
    data[part.field] = getValue(part.field);
  })));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function restore() {
  let data = {};
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch {}
  Object.entries(data).forEach(([field, value]) => {
    if (value) setValue(field, value);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function html(value) {
  return escapeHtml(value);
}

function cssEscape(value) {
  return window.CSS && CSS.escape ? CSS.escape(value) : value.replace(/([.#:[\],])/g, "\\$1");
}
