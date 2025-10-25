const avisosLink = document.getElementById('avisosLink');
const ayudaLink = document.getElementById('ayudaLink');
const avisosModalOverlay = document.getElementById('avisosModal');
const ayudaModalOverlay = document.getElementById('ayudaModal');

/**
 * Genera el contenido HTML del modal y lo inyecta en el overlay.
 * @param {string} title 
 * @param {string} contentHtml 
 * @returns {string} 
 */
const generateModalContent = (title, contentHtml) => {
    return `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3>${title}</h3>
            ${contentHtml}
        </div>
    `;
};

const avisosContent = `
    <p>Esta aplicación es una herramienta de código abierto y se proporciona "tal cual" (AS-IS).</p>
    <p><strong>Riesgo de Uso:</strong> Al cargar archivos SVG, el navegador los procesa directamente. Asegúrese de que los archivos cargados sean de una fuente confiable, ya que la manipulación de código externo conlleva riesgos inherentes.</p>
    <p><strong>Derechos de Autor:</strong> Usted es responsable de poseer los derechos de uso y modificación de cualquier archivo SVG que cargue en esta herramienta. Los archivos modificados conservan la licencia de los archivos originales.</p>
    <p>Esta aplicación no almacena ni transmite sus archivos SVG. Todo el procesamiento se realiza localmente en su navegador.</p>
`;

const ayudaContent = `
    <p><strong>¿Cómo Funciona?</strong></p>
    <ul>
        <li>Carga uno o varios (20) archivos SVG arrastrándolos o usando el botón.</li>
        <li>La aplicación analiza los colores de relleno (fill) y los muestra en la lista.</li>
        <li>Selecciona los colores que deseas reemplazar (puedes seleccionar un color que aparezca en varios archivos).</li>
        <li>Elige el nuevo color HEX (Hexadecimal) y presiona "Aplicar Cambios y Descargar".</li>
    </ul>
    <p><strong>Contacto:</strong> Para sugerencias, reportes de errores o contacto, por favor visite el repositorio de este proyecto en: <a href="https://github.com/IlCarlosS/SVGColorModificador.git">SVG Color Modificador</a></p>
`;

//Funciones de Apertura y Cierre
/**
 * @param {HTMLElement} modalOverlay - 
 * @param {string} title - .
 * @param {string} contentHtml - 
 */
const openModal = (modalOverlay, title, contentHtml) => {
    modalOverlay.innerHTML = generateModalContent(title, contentHtml);
    modalOverlay.style.display = 'flex';
    const closeButton = modalOverlay.querySelector('.modal-close');
    closeButton.addEventListener('click', () => closeModal(modalOverlay));
    document.body.style.overflow = 'hidden';
};

/**
 * Cierra el modal especificado.
 * @param {HTMLElement} modalOverlay - 
 */
const closeModal = (modalOverlay) => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = ''; 
    modalOverlay.innerHTML = ''; 
};

avisosLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(avisosModalOverlay, 'Avisos de Uso y Descargo de Responsabilidad', avisosContent);
});

ayudaLink.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(ayudaModalOverlay, 'Ayuda y Preguntas Frecuentes', ayudaContent);
});

[avisosModalOverlay, ayudaModalOverlay].forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay);
        }
    });
});