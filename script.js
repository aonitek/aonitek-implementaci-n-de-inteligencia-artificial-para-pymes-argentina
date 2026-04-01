// ── FAQ TOGGLE — global, accesible desde onclick ──
  var currentOpenFaq = null;
  function toggleFaq(id) {
    var body = document.getElementById('body-' + id);
    var icon = document.getElementById('icon-' + id);
    if (!body) return;
    var isOpen = body.style.display === 'block';
    if (currentOpenFaq && currentOpenFaq !== id) {
      var prevBody = document.getElementById('body-' + currentOpenFaq);
      var prevIcon = document.getElementById('icon-' + currentOpenFaq);
      if (prevBody) prevBody.style.display = 'none';
      if (prevIcon) prevIcon.textContent = '+';
    }
    if (isOpen) {
      body.style.display = 'none';
      icon.textContent = '+';
      currentOpenFaq = null;
    } else {
      body.style.display = 'block';
      icon.textContent = '×';
      currentOpenFaq = id;
    }
  }