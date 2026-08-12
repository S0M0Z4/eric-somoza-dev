/*
 * Formulario de contacto - Google Apps Script
 * Portafolio Eric Somoza
 *
 * GitHub Pages -> fetch no-cors -> Apps Script -> Gmail
 */

const GOOGLE_APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwew6DG6EaUW9Cl1QwKvqaNrnO7pBh584nDpooaGgOCIfaO9R6nbDLUU83dcuWgv1VD/exec";

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

  if (
    !form ||
    !submitButton ||
    !submitText ||
    !statusBox ||
    !statusIcon ||
    !statusTitle ||
    !statusMessage
  ) {
    return;
  }

  const endpointReady = () =>
    /^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/i.test(
      GOOGLE_APPS_SCRIPT_URL.trim()
    );

  const makeRequestId = () => {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }

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

    statusIcon.textContent =
      type === "success" ? "✓" :
      type === "error" ? "!" : "…";

    statusTitle.textContent = title;
    statusMessage.textContent = message;
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    if (!endpointReady()) {
      showStatus(
        "error",
        "API no configurada",
        "La URL de Google Apps Script no es válida."
      );
      return;
    }

    if (requestIdInput) requestIdInput.value = makeRequestId();
    if (pageUrlInput) pageUrlInput.value = window.location.href;

    setLoading(true);

    showStatus(
      "info",
      "Enviando mensaje",
      "Estamos enviando tu mensaje. No cierres esta página."
    );

    try {
      const formData = new FormData(form);

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData,
        cache: "no-store",
        redirect: "follow"
      });

      form.reset();

      showStatus(
        "success",
        "¡Correo enviado con éxito!",
        "Estate atento a tu correo para recibir una respuesta."
      );

    } catch (error) {
      console.error("Error al enviar formulario:", error);

      showStatus(
        "error",
        "No se pudo enviar el mensaje",
        "Parece haber un problema de conexión. Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  });
})();
