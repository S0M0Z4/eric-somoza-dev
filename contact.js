/*
 * Contacto por Google Apps Script
 * 1) Despliega google-apps-script/Code.gs como Web App.
 * 2) Copia la URL que termina en /exec.
 * 3) Pégala abajo en GOOGLE_APPS_SCRIPT_URL.
 */
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwew6DG6EaUW9Cl1QwKvqaNrnO7pBh584nDpooaGgOCIfaO9R6nbDLUU83dcuWgv1VD/exec';

(() => {
  const form = document.getElementById("contactForm");
  const submitButton = document.getElementById("contactSubmit");
  const submitText = submitButton?.querySelector(".contact-submit-text");
  const statusBox = document.getElementById("contactStatus");
  const statusIcon = document.getElementById("contactStatusIcon");
  const statusTitle = document.getElementById("contactStatusTitle");
  const statusMessage = document.getElementById("contactStatusMessage");
  const requestIdInput = document.getElementById("contactRequestId");
  const pageUrlInput = document.getElementById("contactPageUrl");

  if (!form || !submitButton || !submitText || !statusBox) return;

  let pendingRequestId = null;
  let responseTimer = null;

  const endpointReady = () => {
    return /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/i.test(
      GOOGLE_APPS_SCRIPT_URL.trim()
    );
  };

  const makeRequestId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `contact-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  };

  const setLoading = (loading) => {
    submitButton.disabled = loading;
    submitButton.classList.toggle("is-loading", loading);
    submitText.textContent = loading ? "Enviando..." : "Enviar mensaje";
  };

  const showStatus = (type, title, message) => {
    statusBox.hidden = false;
    statusBox.classList.remove("is-success", "is-error", "is-info");
    statusBox.classList.add(`is-${type}`);
    statusIcon.textContent = type === "success" ? "✓" : type === "error" ? "!" : "…";
    statusTitle.textContent = title;
    statusMessage.textContent = message;
  };

  const finishRequest = () => {
    setLoading(false);
    pendingRequestId = null;
    if (responseTimer) {
      clearTimeout(responseTimer);
      responseTimer = null;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!endpointReady()) {
      showStatus(
        "error",
        "Falta conectar la API",
        "Pega la URL /exec de tu Google Apps Script en assets/js/contact.js."
      );
      return;
    }

    pendingRequestId = makeRequestId();
    requestIdInput.value = pendingRequestId;
    pageUrlInput.value = window.location.href;
    form.action = GOOGLE_APPS_SCRIPT_URL;

    showStatus("info", "Enviando mensaje", "Estamos entregando tu mensaje a Eric.");
    setLoading(true);

    // El POST se hace hacia un iframe oculto para evitar redirecciones y CORS.
    HTMLFormElement.prototype.submit.call(form);

    responseTimer = window.setTimeout(() => {
      if (!pendingRequestId) return;
      finishRequest();
      showStatus(
        "error",
        "No pude confirmar el envío",
        "El servidor tardó demasiado en confirmar el envío. Revisa tu correo o inténtalo nuevamente."
      );
    }, 45000);
  });

  window.addEventListener("message", (event) => {
    const googleOrigin =
      event.origin === "https://script.google.com" ||
      event.origin === "https://script.googleusercontent.com" ||
      /^https:\/\/[a-z0-9.-]+\.googleusercontent\.com$/i.test(event.origin);

    if (!googleOrigin) return;

    const data = event.data;
    if (!data || data.source !== "eric-portfolio-mail-api") return;
    if (!pendingRequestId || data.requestId !== pendingRequestId) return;

    if (data.ok === true) {
      form.reset();
      finishRequest();
      showStatus(
        "success",
        "¡Correo enviado con éxito!",
        "Estate atento a tu correo para recibir una respuesta."
      );
      return;
    }

    finishRequest();
    showStatus(
      "error",
      "No se pudo enviar el mensaje",
      data.message || "Inténtalo nuevamente en unos momentos."
    );
  });
})();
