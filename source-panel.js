/* Shared document + answer-sheet layout; uses the existing test grader. */
(function () {
  'use strict';
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }
  function mount(sections, source) {
    const form = document.getElementById('testForm');
    const results = document.getElementById('results');
    const progress = document.getElementById('stickyProgress');
    const main = form.closest('main');
    if (!main || !results || !progress) throw new Error('Missing answer-sheet host');
    const workspace = element('div', 'split-workspace');
    const documentPane = element('section', 'document-pane');
    documentPane.setAttribute('aria-label', 'Đề bài');
    const documentHeader = element('header', 'document-pane-header');
    documentHeader.append(element('h2', '', 'Đề bài'));
    const sourcePosition = element('span', 'source-position', source.title);
    documentHeader.append(sourcePosition);
    const zoomControls = element('div', 'document-zoom');
    const zoomOut = element('button', '', '−');
    const zoomIn = element('button', '', '+');
    const zoomFit = element('button', '', 'Vừa khung');
    zoomOut.type = zoomIn.type = zoomFit.type = 'button';
    zoomOut.setAttribute('aria-label', 'Thu nhỏ đề');
    zoomIn.setAttribute('aria-label', 'Phóng to đề');
    zoomControls.append(zoomOut, zoomFit, zoomIn);
    documentHeader.append(zoomControls);
    const viewer = element('div', 'document-viewer');
    viewer.tabIndex = 0;
    viewer.setAttribute('aria-label', 'Đề gốc; cuộn để xem các trang');
    const canvas = element('div', 'document-canvas');
    const inner = element('div', 'document-inner');
    // Google centers an 800px page in its 1000px viewport. The surrounding
    // 100px gutters contain its pop-out control; crop gutters, never the page.
    const pageOffsets = [];
    let documentHeight = 0;
    source.images.forEach((_, index) => {
      pageOffsets.push(documentHeight);
      documentHeight += Math.ceil(800 * source.heights[index] / source.widths[index]) + 16;
    });
    documentHeight += 160;
    const iframe = document.createElement('iframe');
    iframe.className = 'google-document-frame';
    iframe.title = 'Đề bài ' + source.title;
    iframe.src = 'https://docs.google.com/gview?embedded=true&url=' + encodeURIComponent(source.documentUrl);
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    iframe.tabIndex = -1;
    iframe.style.height = documentHeight + 'px';
    const toolbarCover = element('div', 'document-toolbar-cover');
    toolbarCover.setAttribute('aria-hidden', 'true');
    inner.append(iframe, toolbarCover);
    canvas.append(inner);
    viewer.append(canvas);
    let zoom = 1;
    let scale = 1;
    let naturalScrollTop = 0;
    let measuredWidth = 0;
    viewer.addEventListener('scroll', () => {
      // A viewport resize can clamp scrollTop before ResizeObserver runs.
      // Keep the last reading position until the new scale is applied.
      if (viewer.clientWidth === measuredWidth) naturalScrollTop = viewer.scrollTop / scale;
    });
    const resizeDocument = () => {
      measuredWidth = viewer.clientWidth;
      scale = Math.max(0.1, (viewer.clientWidth - 16) / 800) * zoom;
      canvas.style.width = (800 * scale) + 'px';
      canvas.style.height = (documentHeight * scale) + 'px';
      inner.style.height = documentHeight + 'px';
      inner.style.left = (-100 * scale) + 'px';
      inner.style.transform = 'scale(' + scale + ')';
      viewer.scrollTop = naturalScrollTop * scale;
      zoomOut.disabled = zoom <= 1;
      zoomIn.disabled = zoom >= 3;
    };
    zoomOut.addEventListener('click', () => { zoom = Math.max(1, zoom - 0.25); resizeDocument(); });
    zoomIn.addEventListener('click', () => { zoom = Math.min(3, zoom + 0.25); resizeDocument(); });
    zoomFit.addEventListener('click', () => { zoom = 1; resizeDocument(); });
    documentPane.append(documentHeader, viewer);
    const answerPane = element('section', 'answer-pane');
    answerPane.setAttribute('aria-label', 'Phiếu trả lời');
    const answerHeader = element('header', 'answer-pane-header');
    answerHeader.append(element('h2', '', 'Phiếu trả lời'));
    answerHeader.append(element('p', '', 'Đọc đề bên trái, trả lời ở đây. Nộp bài để xem điểm, đáp án và giải thích từng câu.'));
    answerPane.append(answerHeader, progress, form, results);
    workspace.append(documentPane, answerPane);
    main.replaceChildren(workspace);
    document.body.classList.add('split-enabled');
    new ResizeObserver(resizeDocument).observe(viewer);
    resizeDocument();

    sections.forEach((section, index) => {
      const key = section.key || section.letter;
      const host = document.getElementById('section-' + key);
      const mapping = source.sections[index];
      if (!host || !mapping || mapping.key !== key) throw new Error('Section source mismatch: ' + key);
      const note = host.querySelector('.section-heading p');
      if (note) {
        note.textContent = note.textContent
          .replace(/The labels are (?:placed )?below the (?:clean )?original (?:pictures|illustrations)\./g, 'Use the picture labels in the source document.')
          .replace(/clean source picture(s?)/g, 'picture$1 in the source document')
          .replace(/clean original illustration(s?)/g, 'illustration$1 in the source document');
      }
      host.querySelectorAll('.source-image,.numbered-source-image,.source-gallery,.question-image').forEach(node => node.remove());
      host.querySelectorAll('.picture-marker').forEach(node => node.remove());
      const hint = element('p', 'answer-source-hint',
        'Đề: phần ' + mapping.originalLabel + ' · trang ' + mapping.pages.join(', '));
      host.querySelector('.section-heading').after(hint);
      if (mapping.sourceNote) hint.append(element('span', 'answer-source-note', mapping.sourceNote));
      // Only keep an already-verified reference diagram when the web answer
      // choices use picture numbers that are not printed in the document.
      if (mapping.answerReference) {
        const pictureNumbers = section.questions.flatMap(question => question.options || [])
          .map(option => /^Picture\s*(\d+)$/i.exec(option)).filter(Boolean).map(match => Number(match[1]));
        if (note && pictureNumbers.length) note.textContent = 'Pictures 1–' + Math.max(...pictureNumbers) +
          ' follow the top-to-bottom order in the source document. Use the numbered reference on this answer sheet.';
        const reference = element('figure', 'answer-reference');
        const img = document.createElement('img');
        img.src = mapping.answerReference;
        img.alt = 'Hình và số tương ứng với các lựa chọn ở phần ' + key;
        reference.append(img);
        host.querySelector('.question-list').before(reference);
      }
      if (mapping.choiceBindings) {
        host.querySelectorAll('.picture-choice').forEach(button => {
          const imagePath = mapping.choiceBindings[button.dataset.value];
          if (!imagePath) throw new Error('Missing picture choice: ' + key + ' / ' + button.dataset.value);
          button.querySelector('img').src = imagePath;
        });
      }
      host.dataset.answerSheet = 'ready';
    });

    // Native scrollIntoView used by the existing grader and section buttons
    // now scrolls the right pane, while the document stays available on left.
    document.getElementById('sectionJump').addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      const key = button.dataset.jump || button.textContent.trim();
      const mapping = source.sections.find(item => item.key === key);
      if (mapping) {
        sourcePosition.textContent = 'Phần ' + mapping.originalLabel + ' · trang ' + mapping.pages.join(', ');
        naturalScrollTop = pageOffsets[mapping.pages[0] - 1];
        viewer.scrollTop = pageOffsets[mapping.pages[0] - 1] * scale;
      }
    });
    const showResults = () => {
      answerPane.classList.toggle('showing-results', !results.hidden);
      if (!results.hidden) answerHeader.querySelector('h2').textContent = 'Kết quả và chữa bài';
      else answerHeader.querySelector('h2').textContent = 'Phiếu trả lời';
    };
    new MutationObserver(showResults).observe(results, {attributes: true, attributeFilter: ['hidden']});
    showResults();
  }
  window.DiscoverSourceView = Object.freeze({mount});
})();
