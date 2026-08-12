# Conectar el formulario con Google Apps Script

El portafolio ya está preparado para enviar mensajes sin salir de la página. Solo falta desplegar la API una vez en tu cuenta de Google y pegar su URL en `assets/js/contact.js`.

## 1. Crear el Apps Script

1. Entra a Google Apps Script con la cuenta que recibirá los mensajes.
2. Crea un proyecto nuevo, por ejemplo `API Portafolio Eric`.
3. Abre `Code.gs` y reemplaza todo por el contenido del archivo `google-apps-script/Code.gs` incluido en este paquete.
4. Guarda el proyecto.

El correo receptor ya está configurado como:

`SOMOZAERIC01@GMAIL.COM`

## 2. Autorizar el envío de correo

1. En el editor de Apps Script, selecciona la función `doGet` o ejecuta temporalmente una función que use `MailApp` si Google solicita autorización al desplegar.
2. Acepta los permisos de envío de correo con tu cuenta.

Apps Script necesita autorización porque `MailApp` envía los mensajes usando la cuenta propietaria del script.

## 3. Desplegar como aplicación web

1. Pulsa **Implementar** > **Nueva implementación**.
2. En **Seleccionar tipo**, elige **Aplicación web**.
3. En **Ejecutar como**, selecciona **Yo**.
4. En quién tiene acceso, selecciona **Cualquier persona**.
5. Pulsa **Implementar**.
6. Copia la URL del Web App. Debe terminar en `/exec`.

Ejemplo de formato:

`https://script.google.com/macros/s/XXXXXXXXXXXXXXXXXXXXXXXX/exec`

No uses la URL `/dev`; esa es solo para pruebas dentro de Apps Script.

## 4. Pegar la URL en el portafolio

Abre:

`assets/js/contact.js`

Busca:

```js
const GOOGLE_APPS_SCRIPT_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
```

Y reemplázalo por tu URL `/exec`:

```js
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/TU_ID/exec";
```

## 5. Subir los cambios a GitHub

En tu repositorio conserva tus carpetas de imágenes actuales y agrega/reemplaza estos archivos:

- `index.html` — reemplazar.
- `assets/js/contact.js` — agregar.
- `assets/css/contact-api.css` — agregar.

Tu `assets/js/main.js`, `assets/css/styles.css` y todas las capturas existentes permanecen igual.

## Qué sucede al enviar

1. El visitante llena Nombre, Correo, Teléfono/WhatsApp y Mensaje.
2. El portafolio envía los datos al Web App de Google dentro de un iframe invisible.
3. Apps Script valida los datos, aplica una protección básica antispam y usa `MailApp` para enviarte el correo.
4. El correo llega a `somozaeric01@gmail.com`.
5. El `Reply-To` queda configurado con el correo del visitante, por lo que en Gmail puedes pulsar **Responder** y contestarle directamente.
6. Apps Script confirma el resultado al portafolio mediante `postMessage`.
7. Si salió bien, el visitante ve:

**¡Correo enviado con éxito!**

**Estate atento a tu correo para recibir una respuesta.**

## Seguridad incluida

- No se publica ninguna contraseña de Gmail.
- No se guarda ningún token OAuth en GitHub.
- Campo honeypot invisible contra bots simples.
- Validación en navegador y nuevamente en Apps Script.
- Límite temporal básico para evitar envíos repetidos desde el mismo correo.
- Escape de HTML antes de construir el correo.
- El botón queda bloqueado mientras el mensaje se procesa.
- El usuario nunca es redirigido fuera del portafolio.

## Si modificas Code.gs después

Cuando cambies el Apps Script, entra a **Implementar > Administrar implementaciones**, edita la implementación y crea una versión nueva para que los cambios lleguen a la URL `/exec`.
