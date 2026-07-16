
let loadedSVGs = []; // Array global para almacenar los datos de los SVGs cargados
let svgCounter = 0; // Contador para asignar IDs únicos a cada SVG cargado

//Obtener referencias del DOM
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const selectFileButton = document.getElementById('selectFileButton');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const svgModifierContainer = document.getElementById('svgModifierContainer');
const colorsList = document.getElementById('colorsList');
const svgPreview = document.getElementById('svgPreview');
const newHexColorPicker = document.getElementById('newHexColorPicker');
const newHexColorInput = document.getElementById('newHexColorInput');
const applyChangesButton = document.getElementById('applyChangesButton');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const selectRepeatedCheckbox = document.getElementById('selectRepeatedCheckbox');
const deselectAllCheckbox = document.getElementById('deselectAllCheckbox');
let selectedColors = new Set();// Array para guardar los colores que el usuario quiere modificar

// ----------------------------------------------------
// Funciones de Ayuda
// ----------------------------------------------------

/**
 * @param {string} colorValue - Valor de color extraído.
 * @returns {string} El color normalizado o el valor original si es un HEX.
 */
const normalizeColor = (colorValue) => {
    return colorValue ? colorValue.toUpperCase() : 'NONE';
};

/**
 * Analiza una cadena de texto SVG, extrae colores 'fill'
 * @param {string} svgContent 
 * @param {string} fileName - Nombre del archivo original.
 */
const processSVG = (svgContent, fileName) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, "image/svg+xml");
    
    // Si el parseo falla se detiene
    if (doc.getElementsByTagName("parsererror").length) {
        console.error(`Error al analizar el SVG: ${fileName}`);
        alert(`Error al analizar el archivo SVG: ${fileName}. Verifique la sintaxis.`);
        return;
    }

    svgCounter++;
    const svgId = `svg-${svgCounter}`;
    const uniqueColors = new Map(); 
    let elementCount = 0;
    const colorElements = doc.querySelectorAll('[fill], [stroke]');

    colorElements.forEach(element => {
        const elementId = `${svgId}-el-${elementCount++}`;// Asignar un ID unico al elemento dentro del SVG
        element.setAttribute('data-color-id', elementId);

        // Extraer el color 'fill'
        let fillColor = element.getAttribute('fill');
        if (fillColor && fillColor.toLowerCase() !== 'none') {
            const color = normalizeColor(fillColor);
            if (!uniqueColors.has(color)) {
                uniqueColors.set(color, []);
            }
            // Ahora guardamos un objeto indicando que es un 'fill'
            uniqueColors.get(color).push({ id: elementId, type: 'fill' });
        }

        // Extraer el color 'stroke' para que detecte el currentColor
        let strokeColor = element.getAttribute('stroke');
        if (strokeColor && strokeColor.toLowerCase() !== 'none') {
            const color = normalizeColor(strokeColor);
            if (!uniqueColors.has(color)) {
                uniqueColors.set(color, []);
            }
            // Ahora guardamos un objeto indicando que es un 'stroke'
            uniqueColors.get(color).push({ id: elementId, type: 'stroke' });
        }
    });

    // Crear el objeto de datos del SVG
    const svgData = {
        id: svgId,
        fileName: fileName,
        content: svgContent, 
        dom: doc.documentElement,
        colors: uniqueColors,
        elementCount: elementCount
    };
    
    loadedSVGs.push(svgData);
    if (loadedSVGs.length > 20) { //limite de archivos
        loadedSVGs = loadedSVGs.slice(0, 20);
        alert("Se ha alcanzado el límite de 20 archivos SVG. Solo se conservan los 20 primeros.");
    }
    
    // Actualizar la interfaz de usuario
    updateUI(); 
};


// ----------------------------------------------------
// Manejo de Eventos de Carga
// ----------------------------------------------------
selectFileButton.addEventListener('click', () => {
    fileInput.click();
});

// Manejar la selección de archivos 
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    handleFiles(files);
    event.target.value = null;
});


// Manejar el arrastre y soltado de archivos (Drag and Drop)
// Prevenir el comportamiento por defecto (abrir el archivo en el navegador)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('highlight'), false);
});

dropZone.addEventListener('drop', handleDrop, false);

function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

/**
 * Función principal para iterar sobre los archivos cargados
 * @param {FileList} files 
 */
function handleFiles(files) {
    const currentCount = loadedSVGs.length;
    const maxFiles = 10;
    const filesToProcess = Array.from(files)// Convertir a Array, filtrar por .svg
        .filter(file => file.name.endsWith('.svg'))
        .slice(0, maxFiles - currentCount); 

    if (filesToProcess.length === 0) {
        if (currentCount >= maxFiles) {
            fileNameDisplay.textContent = `Límite alcanzado: Ya tienes ${maxFiles} SVGs cargados.`;
        } else {
            fileNameDisplay.textContent = "No se cargó ningún archivo SVG válido.";
        }
        return;
    }

    filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const svgContent = e.target.result;
            processSVG(svgContent, file.name);
        };
        reader.readAsText(file);
    });
    fileNameDisplay.textContent = `Se están procesando ${filesToProcess.length} nuevo(s) archivo(s) SVG.`;
}

// ----------------------------------------------------
// Actualización de la UI
// ----------------------------------------------------
const updateUI = () => {
    // Si hay SVGs cargados, mostrar
    if (loadedSVGs.length > 0) {
        svgModifierContainer.style.display = 'block';
    } else {
        svgModifierContainer.style.display = 'none';
        colorsList.innerHTML = '';
        svgPreview.innerHTML = '';
        return;
    }

    colorsList.innerHTML = '';
    svgPreview.innerHTML = '';

    const allUniqueColors = new Map(); // {color: {totalElements: N, files: [fileId1, fileId2]}}
    loadedSVGs.forEach(svg => {
        svg.colors.forEach((elementIds, color) => {// Itera sobre el mapa de colores únicos de CADA SVG
            if (!allUniqueColors.has(color)) {
                allUniqueColors.set(color, {
                    totalElements: 0,
                    files: new Set()
                });
            }
            const data = allUniqueColors.get(color);
            data.totalElements += elementIds.length; // Sumar la cantidad de elementos con este color
            data.files.add(svg.id); // Agregar el archivo ID
        });
        
        // Mostrar vista previa del último SVG cargado
        // Usamos innerHTML para inyectar el SVG. Es importante sanitizar en proyectos reales!
        svgPreview.innerHTML += `<div class="svg-single-preview" data-svg-id="${svg.id}">
                                    <h4>${svg.fileName}</h4>
                                    ${svg.content}
                                </div>`;
    });
    
    //Generar la lista de checkboxes
    allUniqueColors.forEach((data, color) => {
        const fileNames = Array.from(data.files).map(id => loadedSVGs.find(s => s.id === id).fileName).join(', ');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'colorToModify';
        checkbox.value = color;
        checkbox.dataset.filesCount = data.files.size; 
        checkbox.addEventListener('change', handleColorCheckboxChange); 
        const colorItem = document.createElement('div');

        colorItem.classList.add('color-item');
        colorItem.innerHTML = `
            <label class="color-checkbox-label">
                <span class="color-swatch" style="background-color: ${color};"></span>
                <span class="color-value">${color}</span>
                <span class="color-count">(${data.totalElements} elementos en ${data.files.size} archivos: ${fileNames})</span>
            </label>
        `;
        colorItem.querySelector('label').prepend(checkbox); 
        colorsList.appendChild(colorItem);
    });
};

// ----------------------------------------------------
// Estilos de Resaltado (CSS para JS)
// ----------------------------------------------------

// CSS para el efecto de arrastre y la lista de colores
const style = document.createElement('style');
style.textContent = `
    .drop-zone.highlight {
        border-color: var(--dark-terciario);
        background-color: var(--dark-enfasis);
    }
    .color-item {
        padding: 5px;
        border-bottom: 1px solid var(--dark-secundario);
    }
    .color-checkbox-label {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
    }
    .color-swatch {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid var(--dark-secundario);
        flex-shrink: 0;
    }
    .svg-single-preview {
        margin-bottom: 20px;
        padding: 10px;
        border: 1px solid var(--dark-secundario);
        border-radius: var(--border-radius);
    }
    .svg-single-preview svg {
        max-width: 100%;
        height: auto;
    }
`;
document.head.appendChild(style);

// ----------------------------------------------------
// Sincronización de Inputs de Color
// ----------------------------------------------------
newHexColorPicker.addEventListener('input', (e) => {
    newHexColorInput.value = e.target.value.toUpperCase();
});

newHexColorInput.addEventListener('input', (e) => {
    const value = e.target.value.toUpperCase();
    // Validación básica de formato HEX
    if (/^#[0-9A-F]{6}$/.test(value) || /^#[0-9A-F]{3}$/.test(value)) {
        newHexColorPicker.value = value.length === 4 ? `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}` : value;
    }
});

// ----------------------------------------------------
// Manejo de Checkboxes Globales
// ----------------------------------------------------
const updateSelectedColors = () => {
    selectedColors.clear();
    const checkboxes = colorsList.querySelectorAll('input[name="colorToModify"]:checked');
    checkboxes.forEach(cb => {
        selectedColors.add(cb.value);
    });
    console.log(`Colores seleccionados para modificar: ${Array.from(selectedColors).join(', ')}`);
};


selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = colorsList.querySelectorAll('input[name="colorToModify"]');
    checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
    // 💡 Sincronizar el set después de cambiar el DOM
    updateSelectedColors(); 
});

selectRepeatedCheckbox.addEventListener('change', () => {
    const checkboxes = colorsList.querySelectorAll('input[name="colorToModify"]');
    checkboxes.forEach(cb => {
        // Asumimos "repetido" si el color aparece en más de un archivo (data-files-count > 1)
        if (parseInt(cb.dataset.filesCount) > 1) {
            cb.checked = selectRepeatedCheckbox.checked;
        } else if (selectRepeatedCheckbox.checked === false) {
             // Si desmarcamos "Seleccionar Repetidos", solo desmarcamos los que cumplían la condición
             cb.checked = false;
        }
    });
    updateSelectedColors();
});

deselectAllCheckbox.addEventListener('click', () => {
    const checkboxes = colorsList.querySelectorAll('input[name="colorToModify"]');
    checkboxes.forEach(cb => cb.checked = false);
    selectAllCheckbox.checked = false;
    selectRepeatedCheckbox.checked = false;
    updateSelectedColors();
});

// Evento para aplicar los cambios (funciona con el Set sincronizado)
applyChangesButton.addEventListener('click', applyColorChanges);

/**
 * Funcin que se añade al generar cada checkbox en updateUI
 * para actualizar el set de colores seleccionados individualmente
 */
const handleColorCheckboxChange = (e) => {
    const color = e.target.value;
    if (e.target.checked) {
        selectedColors.add(color);
    } else {
        selectedColors.delete(color);
    }
    
    // Opcional: Desactivar 'Seleccionar Todo' si se desmarca uno individualmente
    if (!e.target.checked && selectAllCheckbox.checked) {
        selectAllCheckbox.checked = false;
    }
    
    console.log(`Colores seleccionados para modificar: ${Array.from(selectedColors).join(', ')}`);
};


/**
 * Aplica los cambios de color a los SVGs seleccionados y ofrece la descarga.
 */
function applyColorChanges() {
    if (selectedColors.size === 0) {
        alert('Por favor, selecciona al menos un color a modificar.');
        return;
    }
    
    const newColor = newHexColorInput.value.toUpperCase();
    if (!/^#[0-9A-F]{6}$/.test(newColor) && !/^#[0-9A-F]{3}$/.test(newColor)) {
        alert('El color de reemplazo no es un código HEX válido (#RRGGBB).');
        return;
    }

    // Iterar sobre todos los SVGs cargados
    loadedSVGs.forEach(svgData => {
        let changesMade = false;

        // Iterar sobre los colores que el usuario quiere modificar
        selectedColors.forEach(oldColor => {
            if (svgData.colors.has(oldColor)) {
                const elementIds = svgData.colors.get(oldColor);
                // Iterar sobre esos elementos y aplicar el nuevo color
                elementIds.forEach(item => {
                    const element = svgData.dom.querySelector(`[data-color-id="${item.id}"]`);
                    if (element) {
                        // Usamos item.type dinámicamente ('fill' o 'stroke')
                        element.setAttribute(item.type, newColor);
                        changesMade = true;
                    }
                });
                
                if (changesMade) {
                    svgData.colors.delete(oldColor);
                    // Si el nuevo color no existe, inicializarlo; si existe, agregar los IDs
                    if (!svgData.colors.has(newColor)) {
                         svgData.colors.set(newColor, []);
                    }
                    svgData.colors.get(newColor).push(...elementIds);
                }
            }
        });
        
        // Si se hicieron cambios, actualizar la vista previa
        if (changesMade) {
            updateSVGPreview(svgData);
        }
    });
    offerDownload();// Finalizar y ofrecer la descarga
    updateUI(); 
}


/**
 * Crea la versión serializada del SVG y la ofrece para descarga.
 */
function offerDownload() {
    loadedSVGs.forEach(svgData => {
        const serializer = new XMLSerializer();
        const modifiedSvgString = serializer.serializeToString(svgData.dom);
        const blob = new Blob([modifiedSvgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);// Crear un URL temporal para la descarga
        const a = document.createElement('a');// Crear un enlace de descarga (oculto)
        a.href = url;
        const newFileName = svgData.fileName.replace('.svg', '_modified.svg');
        a.download = newFileName;
        
        // Simular un clic en el enlace para iniciar la descarga
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    alert(`¡Cambios aplicados! Se han descargado ${loadedSVGs.length} archivo(s) SVG modificado(s).`);
}

/**
 * Actualiza la vista previa de un solo SVG después de la modificación.
 * @param {object} svgData 
 */
function updateSVGPreview(svgData) {
    const previewDiv = document.querySelector(`.svg-single-preview[data-svg-id="${svgData.id}"]`);
    if (previewDiv) {
        // Reemplazar solo el elemento SVG dentro del contenedor
        const oldSvgElement = previewDiv.querySelector('svg');
        if (oldSvgElement) {
            oldSvgElement.parentNode.replaceChild(svgData.dom.cloneNode(true), oldSvgElement);
        }
    }
}