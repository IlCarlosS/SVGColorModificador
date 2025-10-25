#🎨 SVG Color Modificador

Visión General
SVG Color Modificador es una herramienta web sencilla y potente diseñada para modificar los colores de relleno (fill) en uno o varios archivos SVG (Scalable Vector Graphics). La aplicación permite identificar colores únicos en múltiples archivos cargados simultáneamente, seleccionar qué colores reemplazar y aplicar un nuevo valor HEX a todos los elementos afectados con un solo clic.

✨ Características Principales
>Carga Múltiple: Permite arrastrar y soltar o seleccionar hasta 100 archivos SVG a la vez.
>Análisis Inteligente: Identifica y lista todos los colores de relleno (fill) únicos presentes en los archivos cargados.
>Selección por Lote: Opciones para seleccionar todos los colores o solo aquellos que se repiten en múltiples archivos.
>Modificación Rápida: Reemplaza un color HEX antiguo por uno nuevo en todos los elementos y archivos seleccionados simultáneamente.
>Descarga Automática: Genera y descarga automáticamente los archivos SVG modificados, conservando la estructura original.
>Tecnología: Desarrollada puramente con HTML, CSS (Tema Oscuro Neumórfico) y JavaScript (sin librerías externas).

🛠️ Cómo Utilizar
Cargar Archivos:
>Arrastra y suelta tus archivos .svg en la Drop Zone (zona de arrastre) o utiliza el botón "Seleccionar Archivo(s)".
>El sistema consolidará los colores de todos los archivos cargados.

Seleccionar Colores:
>En la sección "Colores Únicos Encontrados", marca las casillas de los colores que deseas modificar.
>Utiliza las opciones "Seleccionar Todo" o "Seleccionar Repetidos" para agilizar el proceso.

Definir Reemplazo:
>Elige el nuevo color usando el selector de color o ingresando directamente el código HEX en el campo "Color de Reemplazo".

Aplicar y Descargar:
>Haz clic en "Aplicar Cambios y Descargar". La aplicación procesará los SVGs y se iniciará la descarga de los nuevos archivos (con el sufijo _modified.svg).

⚙️ Estructura del Proyecto
El proyecto está organizado de la siguiente manera:
index.html: La estructura principal de la aplicación.
style.css: Estilos visuales, incluyendo el tema oscuro con diseño neumórfico y responsividad.
main.js: Lógica principal del core, manejo de la carga de archivos, análisis DOM, modificación de colores y descarga.
modal.js: Lógica de la interfaz para los modales de "Avisos de Uso" y "Ayuda y Contacto".

📜 Licencia
Este proyecto está bajo la licencia Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
