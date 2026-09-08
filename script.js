// Everbound — interações básicas do site

(function () {
  var nav = document.getElementById('nav');
  var onScroll = function () {
    if (window.scrollY > 12) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // ------------------------------------------------------------------
  // Formulário de cadastro (newsletter)
  //
  // Os cadastros são enviados por e-mail para contatojtgamesstudios@gmail.com
  // usando o FormSubmit (formsubmit.co) — um serviço gratuito que entrega
  // o formulário direto na caixa de entrada, sem precisar de servidor próprio.
  //
  // IMPORTANTE — ativação única: na primeira pessoa que se cadastrar, o
  // FormSubmit manda um e-mail de confirmação para contatojtgamesstudios@gmail.com
  // pedindo para clicar em um link e ativar o recebimento. Isso só acontece
  // uma vez. Antes disso, os cadastros de teste não chegam na caixa de entrada.
  // ------------------------------------------------------------------
  var FORM_ENDPOINT = 'https://formsubmit.co/ajax/contatojtgamesstudios@gmail.com';

  var form = document.getElementById('signupForm');
  var success = document.getElementById('signupSuccess');
  var emailInput = document.getElementById('emailInput');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.textContent;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = emailInput.value.trim();
    var isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      emailInput.focus();
      emailInput.style.outline = '3px solid #C85A1C';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    success.classList.remove('visible');
    success.classList.remove('error');

    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        _subject: 'Novo cadastro - Everbound',
        _template: 'table'
      })
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok) {
          form.reset();
          success.textContent = '✓ Prontinho! Você vai receber as novidades de Everbound em breve.';
          success.classList.remove('error');
          success.classList.add('visible');
        } else {
          throw new Error('Falha no envio');
        }
      })
      .catch(function () {
        success.textContent = 'Não foi possível enviar agora. Tente novamente em instantes.';
        success.classList.add('error');
        success.classList.add('visible');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = submitLabel;
      });
  });
})();
