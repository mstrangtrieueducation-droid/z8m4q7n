/* Keep original web images and add responsive labels without altering pixels. */
(function () {
  'use strict';
  // Preserve source anchors; separate enlarged labels when a narrow image brings them together.
  function spaceMarkers(wrapper) {
    const bounds = wrapper.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const points = Array.from(wrapper.querySelectorAll(':scope > .source-object-marker'), badge => ({
      badge, anchorX: Number(badge.dataset.x) * bounds.width,
      anchorY: Number(badge.dataset.y) * bounds.height,
      radius: badge.getBoundingClientRect().width / 2, dx: 0, dy: 0
    }));
    for (let pass = 0; pass < 16; pass++) {
      let moved = false;
      for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
        const a = points[i], b = points[j];
        const vx = b.anchorX + b.dx - a.anchorX - a.dx;
        const vy = b.anchorY + b.dy - a.anchorY - a.dy;
        const distance = Math.hypot(vx, vy), gap = a.radius + b.radius + 2 - distance;
        if (gap <= 0.05) continue;
        const ux = distance ? vx / distance : 1, uy = distance ? vy / distance : 0;
        a.dx -= ux * gap / 2; a.dy -= uy * gap / 2;
        b.dx += ux * gap / 2; b.dy += uy * gap / 2;
        moved = true;
      }
      if (!moved) break;
    }
    for (const point of points) {
      point.badge.style.setProperty('--source-label-offset-x', point.dx + 'px');
      point.badge.style.setProperty('--source-label-offset-y', point.dy + 'px');
    }
  }
  const markerObserver = new ResizeObserver(entries => {
    for (const entry of entries) spaceMarkers(entry.target);
  });
  function addMarkers(img, figure, markers) {
    if (!markers.length && !(figure.vectorOverlays || []).length && !(figure.sourceText || []).length && !(figure.textContexts || []).length && !(figure.timeCaptions || []).length) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'source-labelled-image source-labelled-' + figure.kind;
    wrapper.dataset.originalImage = figure.src;
    img.before(wrapper);
    wrapper.appendChild(img);
    if ((figure.vectorOverlays || []).length || (figure.sourceText || []).length) {
      const namespace = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(namespace, 'svg');
      svg.classList.add('source-image-vectors');
      const box = figure.pdfImageBBox;
      svg.setAttribute('viewBox', '0 0 ' + (box[2] - box[0]) + ' ' + (box[3] - box[1]));
      svg.setAttribute('aria-hidden', 'true');
      for (const vector of figure.vectorOverlays || []) {
        const path = document.createElementNS(namespace, 'path');
        for (const [name, value] of Object.entries({d: vector.d, stroke: vector.stroke, fill: vector.fill, 'stroke-width': vector.strokeWidth, 'stroke-opacity': vector.strokeOpacity, 'fill-opacity': vector.fillOpacity})) path.setAttribute(name, value);
        svg.appendChild(path);
      }
      for (const item of figure.sourceText || []) {
        const text = document.createElementNS(namespace, 'text');
        text.classList.add('source-image-text');
        text.setAttribute('x', item.x); text.setAttribute('y', item.y);
        text.setAttribute('font-size', item.fontSize); text.setAttribute('font-family', 'Arial,sans-serif');
        text.setAttribute('fill', '#172f40'); text.setAttribute('textLength', item.width);
        text.setAttribute('lengthAdjust', 'spacingAndGlyphs'); text.textContent = item.text;
        svg.appendChild(text);
      }
      wrapper.appendChild(svg);
    }
    for (const marker of markers) {
      if (marker.cover) {
        const mask = document.createElement('span');
        mask.className = 'source-label-mask';
        mask.dataset.replacesLabel = marker.replacesLabel;
        Object.assign(mask.style, {left: marker.cover.x * 100 + '%', top: marker.cover.y * 100 + '%', width: marker.cover.width * 100 + '%', height: marker.cover.height * 100 + '%'});
        wrapper.appendChild(mask);
      }
      const badge = document.createElement('span');
      badge.className = 'source-object-marker';
      badge.textContent = marker.label;
      badge.dataset.label = marker.label;
      badge.dataset.x = marker.x;
      badge.dataset.y = marker.y;
      badge.style.left = (marker.x * 100) + '%';
      badge.style.top = (marker.y * 100) + '%';
      badge.setAttribute('aria-hidden', 'true');
      wrapper.appendChild(badge);
    }
    if (markers.length > 1) markerObserver.observe(wrapper);
    img.alt += ' · nhãn ' + markers.map(marker => marker.label).join(', ');
    if ((figure.sourceText || []).length) img.alt += ' · ' + figure.sourceText.map(item => item.text).join(' ');
    for (const context of figure.textContexts || []) {
      const panel = document.createElement('div');
      panel.className = 'source-image-context'; panel.dataset.pictureLabel = context.label;
      const label = document.createElement('strong'); label.textContent = 'Hình ' + context.label;
      panel.appendChild(label);
      for (const line of context.lines) { const p = document.createElement('p'); p.textContent = line; panel.appendChild(p); }
      wrapper.after(panel);
    }
    if ((figure.timeCaptions || []).length) {
      const captions = document.createElement('div'); captions.className = 'source-time-captions';
      for (const item of figure.timeCaptions) {
        const label = document.createElement('span'); label.dataset.pictureLabel = item.originalLabel;
        label.textContent = item.originalLabel + ' · ' + item.caption; captions.appendChild(label);
      }
      wrapper.after(captions);
    }
  }

  function mount(sections, source) {
    document.body.classList.add('discover-inline-layout');
    sections.forEach((section, index) => {
      const key = section.key || section.letter;
      const host = document.getElementById('section-' + key);
      if (!host) throw new Error('Missing source host: ' + key);
      const mapping = source.sections[index];
      if (mapping.key !== key) throw new Error('Mismatched source section: ' + key);
      if ((mapping.fallback || []).length || (mapping.cards || []).length) {
        throw new Error('Inline layout cannot display PDF screenshot fallbacks: ' + key);
      }
      const replacements = new Map((mapping.inline || []).map(figure => [figure.original, figure]));
      host.querySelectorAll('.source-image,.question-image,.source-gallery img,.picture-choice img').forEach(img => {
        const oldPath = img.getAttribute('src');
        const article = img.closest('[data-id]');
        const question = article && section.questions.find(item => item.id === article.dataset.id);
        const path = question && img.classList.contains('question-image')
          ? (mapping.questionBindings || {})[question.id] || oldPath : oldPath;
        let figure = replacements.get(path);
        let expectedLabel, group;
        if (img.closest('.picture-choice')) {
          expectedLabel = img.closest('.picture-choice').dataset.value;
          group = question.pictures.map(picture => replacements.get(picture.image));
        } else if (img.closest('.source-gallery')) {
          expectedLabel = img.closest('figure').querySelector('figcaption').textContent.trim();
          group = section.imageGallery.map(picture => replacements.get(picture.src || picture.image));
        }
        if (expectedLabel) {
          const auditedPath = (mapping.choiceBindings || {})[expectedLabel];
          if (auditedPath) {
            figure = replacements.get(auditedPath);
          } else if (group && !group.every(item => item && ['absent', 'web-verified'].includes(item.sourceLabelStatus))) {
            const labelled = group.filter(item => item && String(item.sourceLabel) === expectedLabel);
            if (labelled.length === 1) figure = labelled[0];
          }
          img.dataset.answerLabel = expectedLabel;
        }
        if (!figure) throw new Error('Missing original figure metadata: ' + key + ' / ' + path);
        img.src = figure.src;
        img.width = figure.width;
        img.height = figure.height;
        img.hidden = false;
        img.dataset.originalImage = figure.src;
        img.dataset.originalSha256 = figure.originalSha256;
        img.dataset.imageSha256 = figure.imageSha256 || figure.originalSha256;
        img.dataset.imageMode = figure.mode;
        img.style.backgroundColor = '#fff';
        img.dataset.sourceLabelStatus = figure.sourceLabelStatus || '';
        if (figure.sourceLabel !== null && figure.sourceLabel !== undefined) img.dataset.sourceLabel = figure.sourceLabel;
        if (question && img.classList.contains('question-image')) {
          const proof = (mapping.questionBindingProof || []).find(item => item.id === question.id);
          if (proof) {
            if (proof.sourceNumber !== null) img.dataset.sourceNumber = proof.sourceNumber;
            if (proof.promptNumber !== null) img.dataset.promptNumber = proof.promptNumber;
            img.dataset.auditedSemanticBinding = String(proof.auditedSemanticBinding);
          }
        }
        const markers = [...(figure.markers || [])];
        addMarkers(img, figure, markers);
      });
      host.querySelectorAll('.picture-marker').forEach(marker => marker.remove());
      host.querySelectorAll('.numbered-source-image,.source-gallery').forEach(el => el.hidden = false);
      host.dataset.inlineFigures = 'ready';
    });
  }
  window.DiscoverSourceView = Object.freeze({mount});
})();
