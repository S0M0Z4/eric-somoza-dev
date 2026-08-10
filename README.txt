PORTAFOLIO HTML CON MODALES PARA GITHUB PAGES
==============================================

Esta versión está hecha con:

- HTML
- CSS
- JavaScript

No usa PHP, por eso sirve para GitHub Pages.

CAMBIOS INCLUIDOS
-----------------

- Los proyectos ahora abren en modales profesionales.
- Cada modal tiene carrusel de capturas.
- Todo es responsivo para celular.
- El formulario de contacto está listo para enviar mensajes a:
  somozaeric01@gmail.com
- Contacto visible:
  +52 932 110 0099
- Diseño oscuro tecnológico.
- Animaciones y transiciones.

CAMBIAR CAPTURAS
----------------

Reemplaza las imágenes en:

assets/img/proyectos/plantel-09/
assets/img/proyectos/sistema-gestion/
assets/img/proyectos/upc/

Archivos actuales:

captura-1.png
captura-2.png
captura-3.png

Puedes reemplazarlos por:

captura-1.png
captura-2.png
captura-3.png

Si cambias extensión o nombre, edita también las rutas dentro de:

assets/js/main.js

CAMBIAR INFORMACIÓN DE PROYECTOS
--------------------------------

Edita los datos en:

assets/js/main.js

Busca el objeto:

const projects = { ... }

Ahí puedes cambiar:

- Nombre del proyecto
- Descripción
- Costo aproximado
- Estado
- Tipo
- Tecnologías
- Rutas de imágenes

CONTACTO
--------

El formulario usa esta acción:

https://formsubmit.co/somozaeric01@gmail.com

Cuando lo subas a internet y alguien envíe el primer mensaje, puede llegar un correo de confirmación para activar la recepción.

SUBIR A GITHUB PAGES
--------------------

1. Crea un repositorio en GitHub.
2. Sube todos los archivos.
3. Ve a Settings.
4. Ve a Pages.
5. Selecciona Deploy from a branch.
6. Selecciona main y root.
7. Guarda.


CAMBIO NUEVO
------------
- Se eliminaron los botones visibles de correo, teléfono y WhatsApp que aparecían al lado del formulario.
- Las imágenes de proyectos ahora usan extensión .png.
- Reemplaza captura-1.png, captura-2.png y captura-3.png por tus capturas reales en cada carpeta de proyecto.
