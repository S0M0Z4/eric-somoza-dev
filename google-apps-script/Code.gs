/**
 * API de contacto - Portafolio Eric Somoza
 * Despliegue: Google Apps Script > Implementar > Nueva implementación > Aplicación web
 * Ejecutar como: Yo
 * Acceso: Cualquier persona
 */

const CONTACT_CONFIG = {
  DESTINATION_EMAIL: "somozaeric01@gmail.com",
  SENDER_NAME: "Portafolio Eric Somoza",
  SUBJECT_PREFIX: "Nuevo contacto desde el portafolio",
  RATE_LIMIT_SECONDS: 45,
};

function doGet() {
  return HtmlService.createHtmlOutput(
    "<!doctype html><meta charset='utf-8'><title>API activa</title>" +
    "<p>API de contacto del portafolio activa.</p>"
  );
}

function doPost(e) {
  let requestId = safeRequestId_(e && e.parameter && e.parameter.request_id);

  try {
    const p = (e && e.parameter) || {};

    // Campo trampa para bots. Si viene lleno, no enviamos correo y respondemos como éxito.
    if (clean_(p.empresa, 120)) {
      return bridgeResponse_(true, requestId, "Mensaje recibido.");
    }

    const nombre = clean_(p.nombre, 80);
    const correo = clean_(p.correo, 120).toLowerCase();
    const telefono = clean_(p.telefono, 40);
    const mensaje = clean_(p.mensaje, 3000);
    const pagina = clean_(p.pagina, 500);

    if (!nombre || !correo || !telefono || mensaje.length < 10) {
      return bridgeResponse_(false, requestId, "Revisa que todos los campos estén completos.");
    }

    if (!isValidEmail_(correo)) {
      return bridgeResponse_(false, requestId, "El correo electrónico no parece válido.");
    }

    if (MailApp.getRemainingDailyQuota() < 1) {
      return bridgeResponse_(false, requestId, "El servicio de correo alcanzó su límite diario.");
    }

    // Limita envíos repetidos con el mismo correo durante unos segundos.
    const cache = CacheService.getScriptCache();
    const rateKey = "contact-" + digest_(correo);
    if (cache.get(rateKey)) {
      return bridgeResponse_(false, requestId, "Espera unos segundos antes de volver a enviar otro mensaje.");
    }
    cache.put(rateKey, "1", CONTACT_CONFIG.RATE_LIMIT_SECONDS);

    const subject = `${CONTACT_CONFIG.SUBJECT_PREFIX} — ${nombre}`;

    const plainBody = [
      "Nuevo mensaje desde tu portafolio",
      "",
      `Nombre: ${nombre}`,
      `Correo: ${correo}`,
      `Teléfono / WhatsApp: ${telefono}`,
      "",
      "Mensaje:",
      mensaje,
      "",
      pagina ? `Página de origen: ${pagina}` : "",
      `ID de solicitud: ${requestId}`,
    ].filter(Boolean).join("\n");

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;background:#f5f7fb;padding:24px;color:#172033">
        <div style="max-width:640px;margin:auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e7eaf0">
          <div style="font-size:12px;font-weight:700;letter-spacing:.12em;color:#e73545;text-transform:uppercase;margin-bottom:8px">
            Portafolio web
          </div>
          <h2 style="margin:0 0 20px;font-size:22px;color:#111827">Nuevo mensaje de ${escapeHtml_(nombre)}</h2>

          <table style="width:100%;border-collapse:collapse;margin-bottom:22px">
            <tr><td style="padding:8px 0;color:#6b7280;width:150px">Correo</td><td style="padding:8px 0;font-weight:600">${escapeHtml_(correo)}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280">Teléfono / WhatsApp</td><td style="padding:8px 0;font-weight:600">${escapeHtml_(telefono)}</td></tr>
          </table>

          <div style="padding:18px;background:#f7f8fb;border-radius:12px;line-height:1.65;white-space:pre-wrap">${escapeHtml_(mensaje)}</div>

          ${pagina ? `<p style="margin:18px 0 0;color:#8a94a6;font-size:12px">Origen: ${escapeHtml_(pagina)}</p>` : ""}
          <p style="margin:6px 0 0;color:#a0a8b6;font-size:11px">ID: ${escapeHtml_(requestId)}</p>
        </div>
      </div>`;

    MailApp.sendEmail({
      to: CONTACT_CONFIG.DESTINATION_EMAIL,
      replyTo: correo,
      subject: subject,
      body: plainBody,
      htmlBody: htmlBody,
      name: CONTACT_CONFIG.SENDER_NAME,
    });

    return bridgeResponse_(true, requestId, "Correo enviado correctamente.");
  } catch (error) {
    console.error(error);
    return bridgeResponse_(false, requestId, "Ocurrió un error al enviar el mensaje.");
  }
}

function bridgeResponse_(ok, requestId, message) {
  const payload = JSON.stringify({
    source: "eric-portfolio-mail-api",
    ok: Boolean(ok),
    requestId: safeRequestId_(requestId),
    message: String(message || ""),
  }).replace(/</g, "\\u003c");

  const output = HtmlService.createHtmlOutput(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8"></head>
      <body>
        <script>
          window.parent.postMessage(${payload}, "*");
        <\/script>
      </body>
    </html>
  `);

  // Necesario porque la respuesta se carga dentro del iframe oculto del portafolio.
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}

function clean_(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function isValidEmail_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email) && email.length <= 120;
}

function safeRequestId_(value) {
  const id = String(value || "").trim();
  if (/^[a-zA-Z0-9_-]{6,80}$/.test(id)) return id;
  return Utilities.getUuid();
}

function digest_(value) {
  const bytes = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    value,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64EncodeWebSafe(bytes).slice(0, 36);
}

function escapeHtml_(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
