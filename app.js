let selectedMods = [];

// Elementos del DOM
const searchInput = document.getElementById('search-input');
const btnSearch = document.getElementById('btn-search');
const resultsList = document.getElementById('results-list');
const addedList = document.getElementById('added-list');
const modCount = document.getElementById('mod-count');
const btnExport = document.getElementById('btn-export');

// Elementos del Modal
const modal = document.getElementById('preview-modal');
const closeModal = document.getElementById('close-modal');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalGallery = document.getElementById('modal-gallery');
const modalDescription = document.getElementById('modal-description');
const modalFooter = document.getElementById('modal-footer');

// BUSCAR MODS
async function searchMods() {
    const query = searchInput.value.trim();
    if (!query) return;

    resultsList.innerHTML = `<div class="text-gray-500 text-sm text-center py-8">Buscando...</div>`;

    const mcVersion = document.getElementById('mc-version').value;
    const loader = document.getElementById('loader-type').value;

    try {
        const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=[["categories:${loader}"],["versions:${mcVersion}"],["project_type:mod"]]&limit=10`;
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data.hits);
    } catch (error) {
        resultsList.innerHTML = `<div class="text-red-500 text-sm text-center py-8">Error al buscar mods.</div>`;
    }
}

// MOSTRAR RESULTADOS
function displayResults(mods) {
    if (mods.length === 0) {
        resultsList.innerHTML = `<div class="text-gray-500 text-sm text-center py-8">No se encontraron mods compatibles.</div>`;
        return;
    }

    resultsList.innerHTML = '';
    mods.forEach(mod => {
        const item = document.createElement('div');
        item.className = 'bg-[#161925] p-3 rounded-xl border border-gray-800 flex justify-between items-center gap-2 hover:border-purple-600 transition-all cursor-pointer';
        
        // Clic en la tarjeta abre la vista previa (pero no si hacen clic en el botón "+ Añadir")
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.add-btn')) {
                openPreview(mod.project_id);
            }
        });

        item.innerHTML = `
            <div class="flex items-center gap-3 pointer-events-none">
                <img src="${mod.icon_url || 'https://placehold.co/40'}" class="w-10 h-10 rounded-lg object-cover">
                <div class="text-left">
                    <h4 class="font-semibold text-sm text-white">${mod.title}</h4>
                    <p class="text-xs text-gray-400 line-clamp-1">${mod.description}</p>
                </div>
            </div>
            <button onclick="addMod('${mod.project_id}', '${mod.title}', '${mod.icon_url}')" class="add-btn bg-purple-600 hover:bg-purple-700 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors z-10">
                + Añadir
            </button>
        `;
        resultsList.appendChild(item);
    });
}

// ABRIR VISTA PREVIA (MODAL)
async function openPreview(projectId) {
    modal.classList.remove('hidden');
    modalDescription.innerText = "Cargando descripción detallada e imágenes...";
    modalGallery.innerHTML = '';
    modalFooter.innerHTML = '';

    try {
        // Pedir detalles completos del proyecto en Modrinth
        const response = await fetch(`https://api.modrinth.com/v2/project/${projectId}`);
        const project = await response.json();

        // Actualizar datos básicos en el modal
        modalIcon.src = project.icon_url || 'https://placehold.co/40';
        modalTitle.innerText = project.title;
        modalAuthor.innerText = `Creado por: ${project.organization || 'Autor Desconocido'}`;
        modalDescription.innerHTML = project.body || "No hay una descripción detallada disponible.";

        // Cargar galería de imágenes
        if (project.gallery && project.gallery.length > 0) {
            project.gallery.forEach(img => {
                const imageEl = document.createElement('img');
                imageEl.src = img.url;
                imageEl.className = 'h-24 rounded-lg object-cover border border-gray-700 flex-shrink-0 hover:scale-105 transition-transform cursor-zoom-in';
                modalGallery.appendChild(imageEl);
            });
        } else {
            modalGallery.innerHTML = `<span class="text-xs text-gray-500">Este mod no tiene imágenes en su galería.</span>`;
        }

        // Agregar botón de acción en el modal
        modalFooter.innerHTML = `
            <button onclick="addMod('${project.id}', '${project.title}', '${project.icon_url}'); closePreview();" class="purple-gradient px-6 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                + Añadir a mi Pack
            </button>
        `;

    } catch (e) {
        modalDescription.innerText = "Error al cargar la información del mod.";
    }
}

// CERRAR MODAL
function closePreview() {
    modal.classList.add('hidden');
}
closeModal.addEventListener('click', closePreview);
modal.addEventListener('click', (e) => { if (e.target === modal) closePreview(); });

// AÑADIR MOD A LA LISTA
async function addMod(projectId, title, iconUrl) {
    if (selectedMods.some(m => m.id === projectId)) return alert("El mod ya está añadido.");

    const mcVersion = document.getElementById('mc-version').value;
    const loader = document.getElementById('loader-type').value;

    try {
        const url = `https://api.modrinth.com/v2/project/${projectId}/version?loaders=["${loader}"]&game_versions=["${mcVersion}"]`;
        const response = await fetch(url);
        const versions = await response.json();

        if (versions.length === 0) {
            alert(`No se encontró un archivo compatible para ${title} en la versión ${mcVersion} (${loader}).`);
            return;
        }

        const bestVersion = versions[0];
        const file = bestVersion.files.find(f => f.primary) || bestVersion.files[0];

        selectedMods.push({
            id: projectId,
            title: title,
            icon: iconUrl,
            filename: file.filename,
            downloadUrl: file.url,
            hashes: file.hashes,
            size: file.size
        });

        updateAddedList();
    } catch (e) {
        alert("Error al obtener la versión del mod.");
    }
}

// ACTUALIZAR LISTA VISUAL DE AÑADIDOS
function updateAddedList() {
    modCount.innerText = selectedMods.length;
    if (selectedMods.length === 0) {
        addedList.innerHTML = `<p class="text-gray-500 text-sm text-center py-8">No has añadido mods aún.</p>`;
        return;
    }

    addedList.innerHTML = '';
    selectedMods.forEach((mod, index) => {
        const item = document.createElement('div');
        item.className = 'bg-[#161925] p-3 rounded-xl border border-gray-800 flex justify-between items-center gap-2';
        item.innerHTML = `
            <div class="flex items-center gap-3">
                <img src="${mod.icon || 'https://placehold.co/40'}" class="w-8 h-8 rounded-lg object-cover">
                <span class="font-semibold text-sm text-white truncate max-w-[120px]">${mod.title}</span>
            </div>
            <button onclick="removeMod(${index})" class="text-red-500 hover:text-red-400 text-xs font-semibold px-2">Quitar</button>
        `;
        addedList.appendChild(item);
    });
}

function removeMod(index) {
    selectedMods.splice(index, 1);
    updateAddedList();
}

// BUSCADOR EVENTOS
btnSearch.addEventListener('click', searchMods);
searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') searchMods(); });

// EXPORTAR CON METADATOS DE CREADOR
btnExport.addEventListener('click', async () => {
    if (selectedMods.length === 0) {
        alert("¡Añade al menos un mod para exportar!");
        return;
    }

    const packName = document.getElementById('pack-name').value;
    const packAuthor = document.getElementById('pack-author').value; // Autor leído desde la UI
    const packVer = document.getElementById('pack-version').value;
    const mcVersion = document.getElementById('mc-version').value;
    const loader = document.getElementById('loader-type').value;

    const zip = new JSZip();

    const indexJson = {
        formatVersion: 1,
        game: "minecraft",
        versionId: packVer,
        name: packName,
        summary: `Modpack creado por ${packAuthor} de forma ultra ligera desde la Web con PackCraft`,
        files: selectedMods.map(mod => ({
            path: `mods/${mod.filename}`,
            hashes: {
                sha1: mod.hashes.sha1,
                sha256: mod.hashes.sha256
            },
            env: {
                client: "required",
                server: "required"
            },
            downloads: [mod.downloadUrl],
            fileSize: mod.size
        })),
        dependencies: {
            minecraft: mcVersion
        }
    };

    indexJson.dependencies[loader] = "recommended";

    zip.file("modrinth.index.json", JSON.stringify(indexJson, null, 2));
    zip.folder("overrides");

    zip.generateAsync({ type: "blob" }).then((content) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = `${packName.toLowerCase().replace(/\s+/g, '-')}-${packVer}.mrpack`;
        link.click();
    });
});
