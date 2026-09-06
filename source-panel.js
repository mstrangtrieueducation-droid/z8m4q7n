/* One source viewer for every test; no coordinates or invented picture labels. */
(function () {
  'use strict';
  function mount(sections, source) {
    sections.forEach((section, index) => {
      const key = section.key || section.letter;
      const host = document.getElementById('section-' + key);
      if (!host) throw new Error('Missing source host: ' + key);
      const mapping = source.sections[index];
      const details = document.createElement('details');
      details.className = 'original-source';
      const hasPictures = !!(section.sectionImage || section.imageGallery || section.questions.some(q => q.image || q.pictures));
      details.open = hasPictures;
      const summary = document.createElement('summary');
      const originalLabel = mapping.originalLabel !== key ? ' (mục ' + mapping.originalLabel + ' trong PDF)' : '';
      summary.textContent = 'Đề gốc · phần ' + key + originalLabel + ' · trang ' + mapping.pages.join(', ');
      details.appendChild(summary);
      const help = document.createElement('p');
      help.textContent = 'Xem phần tương ứng trong đề dưới đây, rồi trả lời ở các ô bên dưới. Bấm vào trang để phóng to.';
      details.appendChild(help);
      for (const number of mapping.pages) {
        const link = document.createElement('a');
        link.href = source.images[number - 1];
        link.target = '_blank'; link.rel = 'noopener';
        link.setAttribute('aria-label', 'Phóng to trang ' + number + ' của đề gốc');
        const img = document.createElement('img');
        img.src = link.href; img.alt = 'Đề gốc, trang ' + number;
        img.loading = 'lazy'; img.decoding = 'async';
        img.width = source.widths[number - 1]; img.height = source.heights[number - 1];
        link.appendChild(img); details.appendChild(link);
      }
      const original = document.createElement('a');
      original.href = 'https://drive.google.com/file/d/' + source.driveId + '/view';
      original.target = '_blank'; original.rel = 'noopener';
      original.textContent = 'Mở đề gốc trong Drive';
      details.appendChild(original);
      host.querySelector('.question-list').before(details);
      // The PDF contains labels, arrows, word boxes and whole diagrams. The
      // old extracted bitmaps omit those layers and must not compete with it.
      if (hasPictures) {
        host.querySelectorAll('.source-image,.numbered-source-image,.source-gallery,.question-image').forEach(el => el.hidden = true);
      }
    });
  }
  window.DiscoverSourceView = Object.freeze({mount});
})();
