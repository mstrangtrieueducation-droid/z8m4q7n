(() => {
  const config = window.DISCOVER_SCORE_CONFIG || {};
  const isVietnamese = config.language === "vi";
  const copy = isVietnamese ? {
    eyebrow: "Thông tin học sinh", title: "Trước khi bắt đầu",
    intro: "Con ghi đúng tên tiếng Anh và chọn chính xác lớp đang theo học.",
    name: "Tên tiếng Anh", namePlaceholder: "Ví dụ: Anna", className: "Lớp",
    classHelp: "Chọn đúng lớp con đang theo học trong danh sách dưới đây.", choose: "Chọn lớp", start: "Vào làm bài",
    error: "Con cần điền tên tiếng Anh và chọn lớp trước khi vào làm bài.",
    recorded: "Điểm đã được tự động ghi nhận đúng mã bài.", pending: "Điểm đã được tính. Hệ thống đang ghi nhận kết quả...",
    failed: "Chưa thể ghi kết quả tự động. Con giữ nguyên trang và thử lại.", student: "Học sinh"
  } : {
    eyebrow: "Student details", title: "Before you begin",
    intro: "Enter your English name and select your current class accurately.",
    name: "English name", namePlaceholder: "For example: Anna", className: "Class",
    classHelp: "Select the class you are currently attending.", choose: "Select your class", start: "Start the test",
    error: "Enter your English name and select your class before starting.",
    recorded: "Your score has been recorded with the correct assignment code.", pending: "Your score is ready. Recording the result...",
    failed: "The result could not be recorded automatically. Keep this page open and try again.", student: "Student"
  };

  let resultSubmitted = false;
  let student = null;
  const profileKey = "discover-test-student-profile-v1";
  document.documentElement.classList.add("student-gate-active");
  const gate = document.createElement("section");
  gate.className = "student-gate";
  gate.setAttribute("role", "dialog");
  gate.setAttribute("aria-modal", "true");
  gate.innerHTML = `
    <div class="student-gate-card">
      <div class="student-gate-brand"><img src="assets/brand/logo-official.webp" alt="Ms. Trang Trieu Education"><div><span>DISCOVER ${config.level || ""}</span><strong>${config.assignmentCode || "WRITTEN TEST"}</strong></div></div>
      <div class="student-gate-copy"><p class="student-gate-eyebrow">${copy.eyebrow}</p><h2>${copy.title}</h2><p>${copy.intro}</p></div>
      <form class="student-gate-form" novalidate>
        <label><span>${copy.name}</span><input id="studentEnglishName" autocomplete="name" maxlength="60" placeholder="${copy.namePlaceholder}"></label>
        <label><span>${copy.className}</span><small>${copy.classHelp}</small><select id="studentClass"><option value="">${copy.choose}</option>${(config.classes || []).map((name) => `<option value="${name}">${name}</option>`).join("")}</select></label>
        <p class="student-gate-error" hidden>${copy.error}</p><button type="submit">${copy.start}</button>
      </form>
    </div>`;
  document.body.prepend(gate);

  try {
    const saved = JSON.parse(localStorage.getItem(profileKey) || "null");
    if (saved?.name) gate.querySelector("#studentEnglishName").value = saved.name;
    if (saved?.className && (config.classes || []).includes(saved.className)) gate.querySelector("#studentClass").value = saved.className;
  } catch {}

  gate.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = gate.querySelector("#studentEnglishName").value.trim().replace(/\s+/g, " ");
    const className = gate.querySelector("#studentClass").value;
    if (name.length < 2 || !(config.classes || []).includes(className)) {
      gate.querySelector(".student-gate-error").hidden = false;
      return;
    }
    student = { name, className };
    localStorage.setItem(profileKey, JSON.stringify(student));
    gate.remove();
    document.documentElement.classList.remove("student-gate-active");
    addStudentBadge();
    window.scrollTo({ top: 0, behavior: "instant" });
    detectResult();
  });

  function addStudentBadge() {
    const header = document.querySelector(".header-inner, .topbar-inner, header .inner, header");
    if (!header || header.querySelector(".student-profile-badge")) return;
    const badge = document.createElement("div");
    badge.className = "student-profile-badge";
    badge.innerHTML = `<span>${copy.student}</span><strong>${escapeHtml(student.name)}</strong><small>${escapeHtml(student.className)}</small>`;
    header.append(badge);
  }

  function detectResult() {
    if (!student || resultSubmitted) return;
    const scoreElement = document.querySelector("#scoreValue");
    if (!scoreElement) return;
    const resultPanel = document.querySelector("#results, .results, [data-results]");
    if (resultPanel && (resultPanel.hidden || getComputedStyle(resultPanel).display === "none")) return;
    const score = Number(String(scoreElement.textContent).replace(",", ".").match(/\d+(?:\.\d+)?/)?.[0]);
    if (!Number.isFinite(score)) return;
    resultSubmitted = true;
    submitResult(score, Number(config.totalPoints || 50));
  }

  function submitResult(score, total) {
    const status = document.createElement("p");
    status.className = "score-record-status is-pending";
    status.textContent = copy.pending;
    document.querySelector(".score-panel, #results")?.append(status);
    if (!config.formResponseUrl || !config.entries || Object.values(config.entries).some((value) => !value)) {
      status.className = "score-record-status is-error";
      status.textContent = copy.failed;
      resultSubmitted = false;
      return;
    }
    const targetName = `discover-score-${Date.now()}`;
    const iframe = document.createElement("iframe");
    iframe.name = targetName;
    iframe.hidden = true;
    const form = document.createElement("form");
    form.method = "POST";
    form.action = config.formResponseUrl;
    form.target = targetName;
    form.hidden = true;
    const values = {
      [config.entries.name]: student.name, [config.entries.className]: student.className,
      [config.entries.assignmentCode]: config.assignmentCode, [config.entries.score]: String(score),
      [config.entries.total]: String(total), [config.entries.percent]: String(Math.round((score / total) * 100))
    };
    Object.entries(values).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.name = name;
      input.value = value;
      form.append(input);
    });
    document.body.append(iframe, form);
    iframe.addEventListener("load", () => {
      status.className = "score-record-status is-success";
      status.textContent = copy.recorded;
      setTimeout(() => { form.remove(); iframe.remove(); }, 1000);
    }, { once: true });
    form.submit();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
  }
  new MutationObserver(detectResult).observe(document.documentElement, { subtree: true, childList: true, attributes: true, characterData: true });
  document.addEventListener("submit", () => setTimeout(detectResult, 150), true);
})();
