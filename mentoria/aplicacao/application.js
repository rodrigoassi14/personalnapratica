(function () {
  'use strict';
  var form = document.getElementById('application');
  var review = document.getElementById('review');
  var error = document.getElementById('error');
  var phone = document.getElementById('telefone');
  function normalizePhone(value) {
    var digits = value.replace(/\D/g, '');
    if (digits.length === 10 || digits.length === 11) digits = '55' + digits;
    return /^55[1-9]\d(?:9\d{8}|[2-5]\d{7})$/.test(digits) ? '+' + digits : null;
  }
  phone.addEventListener('input', function () { phone.setCustomValidity(''); });
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    error.textContent = '';
    var normalized = normalizePhone(phone.value);
    if (!normalized) {
      phone.setCustomValidity('Informe um WhatsApp brasileiro válido, com DDD.');
      phone.reportValidity();
      return;
    }
    var values = {};
    ['nome', 'email', 'momento', 'objetivo', 'dificuldade'].forEach(function (key) {
      values[key] = document.getElementById(key).value.trim();
    });
    if (values.nome.length < 3 || values.objetivo.length < 10 || values.dificuldade.length < 10) {
      error.textContent = 'Preencha nome, objetivo e dificuldade com mais detalhes.';
      return;
    }
    var message = 'Olá, equipe do Rodrigo! Quero me candidatar à Mentoria Personal na Prática.\n\n' +
      'Nome: ' + values.nome + '\nE-mail: ' + values.email + '\nWhatsApp: ' + normalized +
      '\nMomento: ' + values.momento + '\nObjetivo: ' + values.objetivo +
      '\nDificuldade: ' + values.dificuldade +
      '\n\nSolicito atendimento sobre esta candidatura. Entendo que isso não garante vaga.';
    document.getElementById('summary').textContent = message;
    document.getElementById('send').href = 'https://api.whatsapp.com/send?phone=5511976563187&text=' + encodeURIComponent(message);
    form.hidden = true;
    review.hidden = false;
    document.getElementById('review-title').setAttribute('tabindex', '-1');
    document.getElementById('review-title').focus();
  });
  document.getElementById('edit').addEventListener('click', function () {
    review.hidden = true;
    form.hidden = false;
    document.getElementById('nome').focus();
  });
})();
