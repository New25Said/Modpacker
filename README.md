# ⚡ PackCraft Web — Modpack Creator

<p align="center">
  <img src="https://img.shields.io/badge/Minecraft-Modpack--Creator-7c3aed?style=for-the-badge&logo=minecraft&logoColor=white" alt="Minecraft Badge">
  <img src="https://img.shields.io/badge/Platform-Modrinth-00C070?style=for-the-badge&logo=modrinth&logoColor=white" alt="Modrinth Badge">
  <img src="https://img.shields.io/badge/Hosted_on-GitHub_Pages-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages Badge">
</p>

---

**PackCraft Web** es una herramienta web ultraligera y minimalista diseñada con una estética oscura y morada. Te permite buscar, previsualizar y añadir mods directamente desde la base de datos oficial de **Modrinth** para generar un archivo `.mrpack` compatible y listo para publicar, todo **100% desde tu navegador** y sin descargar archivos pesados a tu computadora física.

Ideal para creadores de modpacks que utilizan Chromebooks, laptops de bajos recursos o que simplemente prefieren evitar herramientas de terminal complicadas.

---

## 🚀 Características Clave

- 💻 **100% en la Web:** Olvídate de instalar launchers pesados o configurar entornos de desarrollo locales.
- 🎨 **Estética Dark/Purple:** Interfaz moderna, limpia, responsiva y optimizada para el cansancio visual.
- 🔍 **Buscador en Tiempo Real:** Conectado directamente a la API oficial de Modrinth. Filtra automáticamente por versión de Minecraft y Mod Loader (Fabric, Forge, NeoForge).
- 🖼️ **Vista Previa Avanzada:** Haz clic en cualquier tarjeta de mod para leer su descripción completa, ver su creador original y explorar su galería de imágenes oficiales.
- ⚙️ **Campos Personalizables:** Configura el nombre del pack, la versión, el autor/creador, la versión de Minecraft y el loader correspondiente.
- 📥 **Exportación al Instante:** Genera el archivo `.mrpack` utilizando memoria del navegador mediante `JSZip` en cuestión de milisegundos.

---

## 🛠️ Cómo Utilizar la Herramienta

1. **Configura tu Pack:** Define el nombre, tu nombre de creador, la versión de Minecraft que deseas (ej. `1.20.1`) y tu Loader preferido en la columna izquierda.
2. **Busca tus Mods:** Escribe el nombre del mod en la barra de búsqueda y presiona Enter o el botón "Buscar".
3. **Explora Detalles:** Haz clic en la tarjeta de cualquier mod para abrir la ventana emergente con imágenes y descripciones completas.
4. **Arma tu Colección:** Haz clic en **+ Añadir** para incluir mods en la lista de tu pack.
5. **Descarga:** Haz clic en el botón gigante **📥 Exportar .mrpack** y el archivo se descargará automáticamente a tu dispositivo.
6. **Sube a la Red:** Sube el archivo `.mrpack` a la web de Modrinth ¡y listo para jugar!

---

## 🛠️ Tecnologías Utilizadas

* **HTML5 & CSS3** (Estructura y animaciones avanzadas).
* [Tailwind CSS](https://tailwindcss.com/) - Framework CSS para diseño responsivo e interfaces modernas con acentos neón.
* [JSZip](https://stuk.github.io/jszip/) - Librería de JavaScript para empaquetado y compresión de archivos ZIP al vuelo en el cliente.
* [Modrinth API v2](https://docs.modrinth.com/) - Conexión de datos estructurados para búsqueda de proyectos Minecraft.

---

## 🤝 Créditos

Desarrollado y mantenido con ❤️ por [Sa1xp](https://github.com/New25Said) con el propósito de facilitar la creación de modpacks optimizados para computadoras de bajos recursos.
