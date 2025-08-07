// Servicio para manejar operaciones CRUD de fotografías
import { supabase } from "./auth.js";

// Obtener todas las fotografías
export async function getAllPhotography() {
  try {
    const { data, error } = await supabase
      .from("photography")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener fotografías:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Obtener una fotografía por ID
export async function getPhotographyById(id) {
  try {
    const { data, error } = await supabase
      .from("photography")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error al obtener fotografía:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Crear nueva fotografía
export async function createPhotography(photographyData) {
  try {
    // Validar datos requeridos
    if (
      !photographyData.title ||
      !photographyData.image_url ||
      !photographyData.date
    ) {
      throw new Error("Título, imagen y fecha son requeridos");
    }

    const { data, error } = await supabase
      .from("photography")
      .insert([
        {
          title: photographyData.title,
          description: photographyData.description || "",
          image_url: photographyData.image_url,
          price: photographyData.price || null,
          location: photographyData.location || "",
          date: photographyData.date,
          tags: photographyData.tags || [],
          status: photographyData.status || "available",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error al crear fotografía:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Crear nueva fotografía con subida de archivo
export async function createPhotographyWithUpload(photographyData, imageFile) {
  try {
    // Validar datos requeridos
    if (!photographyData.title || !photographyData.date) {
      throw new Error("Título y fecha son requeridos");
    }

    let imageUrl = photographyData.image_url;

    // Si se proporciona un archivo, subirlo primero
    if (imageFile) {
      const { uploadPhotographyImage } = await import("./storage.js");
      const uploadResult = await uploadPhotographyImage(imageFile);

      if (!uploadResult.success) {
        throw new Error(`Error al subir imagen: ${uploadResult.error}`);
      }

      imageUrl = uploadResult.publicUrl;
    }

    // Crear la fotografía con la URL de la imagen
    const { data, error } = await supabase
      .from("photography")
      .insert([
        {
          title: photographyData.title,
          description: photographyData.description || "",
          image_url: imageUrl,
          price: photographyData.price || null,
          location: photographyData.location || "",
          date: photographyData.date,
          tags: photographyData.tags || [],
          status: photographyData.status || "available",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error al crear fotografía:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Funciones de manejo de UI para fotografías
export class PhotographyUI {
  constructor() {
    this.currentPhotography = [];
    this.editingPhotoId = null;
    this.setupEventListeners();
  }

  // Configurar event listeners
  setupEventListeners() {
    this.setupFileUpload();
    this.setupImageSourceToggle();
    this.setupFormSubmission();
    this.setupFilters();
    this.setupSearch();
    this.setupExport();
  }

  // Configurar subida de archivos
  setupFileUpload() {
    const fileInput = document.getElementById("photo-image-file");
    const filePreview = document.getElementById("file-preview");
    const previewImage = document.getElementById("preview-image");
    const fileName = document.getElementById("file-name");
    const fileSize = document.getElementById("file-size");
    const removeFileBtn = document.getElementById("remove-file");

    if (fileInput) {
      fileInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];

        if (file) {
          const { validateImageFile, fileToBase64, getFileInfo } = await import(
            "./storage.js"
          );

          // Validar archivo
          const validation = validateImageFile(file);
          if (!validation.isValid) {
            this.showError("Error: " + validation.errors.join(", "));
            fileInput.value = "";
            return;
          }

          // Mostrar preview
          try {
            const base64 = await fileToBase64(file);
            const fileInfo = getFileInfo(file);

            previewImage.src = base64;
            fileName.textContent = fileInfo.name;
            fileSize.textContent = `${fileInfo.sizeInMB} MB`;
            filePreview.classList.remove("hidden");
          } catch (error) {
            console.error("Error al generar preview:", error);
            this.showError("Error al generar preview de la imagen");
          }
        }
      });
    }

    if (removeFileBtn) {
      removeFileBtn.addEventListener("click", () => {
        fileInput.value = "";
        filePreview.classList.add("hidden");
      });
    }
  }

  // Configurar toggle de fuente de imagen
  setupImageSourceToggle() {
    const uploadRadio = document.querySelector(
      'input[name="image_source"][value="upload"]'
    );
    const urlRadio = document.querySelector(
      'input[name="image_source"][value="url"]'
    );
    const uploadSection = document.getElementById("upload-section");
    const urlSection = document.getElementById("url-section");

    if (uploadRadio && urlRadio) {
      uploadRadio.addEventListener("change", () => {
        uploadSection.classList.remove("hidden");
        urlSection.classList.add("hidden");
      });

      urlRadio.addEventListener("change", () => {
        uploadSection.classList.add("hidden");
        urlSection.classList.remove("hidden");
      });
    }
  }

  // Configurar envío de formulario
  setupFormSubmission() {
    const form = document.getElementById("photo-form");
    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleFormSubmission();
      });
    }
  }

  // Manejar envío de formulario
  async handleFormSubmission() {
    const form = document.getElementById("photo-form");
    const formData = new FormData(form);
    const imageSource = formData.get("image_source");
    const imageFile = document.getElementById("photo-image-file").files[0];
    const imageUrl = formData.get("image_url");

    // Validar que se proporciona una imagen
    if (imageSource === "upload" && !imageFile) {
      this.showError("Por favor selecciona una imagen para subir");
      return;
    }

    if (imageSource === "url" && !imageUrl) {
      this.showError("Por favor proporciona una URL de imagen");
      return;
    }

    const photoData = {
      title: formData.get("title"),
      description: formData.get("description"),
      image_url: imageSource === "url" ? imageUrl : "",
      price: formData.get("price") ? parseFloat(formData.get("price")) : null,
      location: formData.get("location"),
      date: formData.get("date") || null, // Fecha opcional
      tags: formData
        .get("tags")
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      status: formData.get("status"),
    };

    const submitBtn = document.getElementById("save-btn");
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Guardando...";
    submitBtn.disabled = true;

    try {
      let result;

      if (this.editingPhotoId) {
        // Actualizar
        result = await updatePhotography(this.editingPhotoId, photoData);
      } else {
        // Crear
        if (imageSource === "upload" && imageFile) {
          // Crear con subida de archivo
          result = await createPhotographyWithUpload(photoData, imageFile);
        } else {
          // Crear con URL externa
          result = await createPhotography(photoData);
        }
      }

      if (result.error) {
        this.showError("Error al guardar: " + result.error.message);
        return;
      }

      this.closeModal();
      await this.loadPhotography();
      this.showSuccess(
        this.editingPhotoId
          ? "Fotografía actualizada exitosamente"
          : "Fotografía creada exitosamente"
      );
    } catch (error) {
      this.showError("Error inesperado: " + error.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  }

  // Configurar filtros
  setupFilters() {
    const statusFilter = document.getElementById("status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", async (e) => {
        const status = e.target.value;
        if (status) {
          const { data, error } = await getPhotographyByStatus(status);
          if (!error) {
            this.currentPhotography = data || [];
            this.renderPhotography();
          }
        } else {
          await this.loadPhotography();
        }
      });
    }
  }

  // Configurar búsqueda
  setupSearch() {
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", async (e) => {
        const query = e.target.value.trim();
        if (query.length > 2) {
          const { data, error } = await searchPhotography(query);
          if (!error) {
            this.currentPhotography = data || [];
            this.renderPhotography();
          }
        } else if (query.length === 0) {
          await this.loadPhotography();
        }
      });
    }
  }

  // Configurar exportación
  setupExport() {
    const exportBtn = document.getElementById("export-btn");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const csvContent = this.generateCSV();
        this.downloadCSV(csvContent, "fotografias.csv");
      });
    }
  }

  // Cargar fotografías
  async loadPhotography() {
    try {
      this.showLoading();

      const { data, error } = await getAllPhotography();

      if (error) {
        this.showError("Error al cargar las fotografías: " + error.message);
        return;
      }

      this.currentPhotography = data || [];
      this.renderPhotography();
    } catch (error) {
      this.showError("Error inesperado: " + error.message);
    }
  }

  // Renderizar fotografías
  renderPhotography() {
    const photosGrid = document.getElementById("photos-grid");

    if (this.currentPhotography.length === 0) {
      this.showEmpty();
      return;
    }

    this.hideEmpty();
    this.hideError();
    this.hideLoading();

    photosGrid.innerHTML = this.currentPhotography
      .map(
        (photo) => `
      <div class="bg-dark-800 rounded-lg overflow-hidden hover:bg-dark-700 transition-colors" data-id="${
        photo.id
      }">
        <div class="aspect-square bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
          ${
            photo.image_url
              ? `
            <img 
              src="${photo.image_url}" 
              alt="${photo.title}"
              class="w-full h-full object-cover"
              loading="lazy"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
          `
              : ""
          }
          <div class="w-full h-full bg-dark-700 flex items-center justify-center" style="${
            photo.image_url ? "display: none;" : ""
          }">
            <span class="text-4xl">📷</span>
          </div>
          <div class="absolute top-4 right-4 flex space-x-2">
            <button
              class="edit-photo-btn p-2 bg-dark-800 rounded-lg text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
              data-id="${photo.id}"
              aria-label="Editar"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="delete-photo-btn p-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition-colors"
              data-id="${photo.id}"
              aria-label="Eliminar"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
          ${
            photo.status === "sold"
              ? `
            <div class="absolute top-4 left-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
              Vendida
            </div>
          `
              : ""
          }
        </div>
        <div class="p-4">
          <h3 class="text-lg font-semibold text-gray-100 mb-2">${
            photo.title
          }</h3>
          <p class="text-gray-400 text-sm mb-3">${
            photo.description || "Sin descripción"
          }</p>
          <div class="flex items-center justify-between mb-3">
            <span class="text-primary-400 font-medium">${
              photo.price ? `$${photo.price}` : "Precio no especificado"
            }</span>
            <div class="text-gray-500 text-sm">
              ${photo.location || "Sin ubicación"}
              ${photo.date ? ` • ${photo.date}` : ""}
            </div>
          </div>
          <div class="flex flex-wrap gap-1 mb-3">
            ${(photo.tags || [])
              .map(
                (tag) => `
              <span class="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded">
                ${tag}
              </span>
            `
              )
              .join("")}
          </div>
          <div class="flex space-x-2">
            <button
              class="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors view-details-btn"
              data-id="${photo.id}"
            >
              Ver Detalles
            </button>
            <button
              class="px-3 py-2 bg-dark-700 text-gray-300 text-sm rounded hover:bg-dark-600 transition-colors duplicate-btn"
              data-id="${photo.id}"
            >
              Duplicar
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    // Agregar event listeners
    this.addEventListeners();
  }

  // Agregar event listeners a las tarjetas
  addEventListeners() {
    // Botones de editar
    document.querySelectorAll(".edit-photo-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const photoId = btn.getAttribute("data-id");
        this.editPhotography(photoId);
      });
    });

    // Botones de eliminar
    document.querySelectorAll(".delete-photo-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const photoId = btn.getAttribute("data-id");
        this.showDeleteConfirmation(photoId);
      });
    });

    // Botones de duplicar
    document.querySelectorAll(".duplicate-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const photoId = btn.getAttribute("data-id");
        this.duplicatePhotography(photoId);
      });
    });
  }

  // Editar fotografía
  async editPhotography(photoId) {
    try {
      const photo = this.currentPhotography.find((p) => p.id === photoId);
      if (!photo) {
        this.showError("Fotografía no encontrada");
        return;
      }

      this.editingPhotoId = photoId;

      // Actualizar título del modal
      const modalTitle = document.getElementById("modal-title");
      if (modalTitle) {
        modalTitle.textContent = "Editar Fotografía";
      }

      // Llenar formulario con datos de la fotografía
      this.fillForm(photo);

      // Abrir modal
      this.openModal();

      console.log("✅ Modal de edición abierto para:", photo.title);
    } catch (error) {
      console.error("❌ Error al editar fotografía:", error);
      this.showError("Error al cargar datos de la fotografía");
    }
  }

  // Duplicar fotografía
  async duplicatePhotography(photoId) {
    const photo = this.currentPhotography.find((p) => p.id === photoId);
    if (!photo) {
      this.showError("Fotografía no encontrada");
      return;
    }

    this.editingPhotoId = null;
    document.getElementById("modal-title").textContent = "Duplicar Fotografía";

    // Crear copia sin ID
    const photoCopy = { ...photo };
    delete photoCopy.id;
    photoCopy.title = photoCopy.title + " (Copia)";

    this.fillForm(photoCopy);
    this.openModal();
  }

  // Mostrar confirmación de eliminación
  showDeleteConfirmation(photoId) {
    const photo = this.currentPhotography.find((p) => p.id === photoId);
    if (!photo) {
      this.showError("Fotografía no encontrada");
      return;
    }

    document.getElementById(
      "delete-message"
    ).textContent = `¿Estás seguro de que quieres eliminar "${photo.title}"? Esta acción no se puede deshacer.`;

    document.getElementById("delete-modal").classList.remove("hidden");

    // Configurar confirmación
    document.getElementById("confirm-delete").onclick = () => {
      this.handleDeletePhotography(photoId);
      document.getElementById("delete-modal").classList.add("hidden");
    };
  }

  // Manejar eliminación de fotografía
  async handleDeletePhotography(photoId) {
    try {
      const { success, error } = await deletePhotography(photoId);

      if (error) {
        this.showError("Error al eliminar: " + error.message);
        return;
      }

      if (success) {
        // Recargar fotografías
        await this.loadPhotography();
        this.showSuccess("Fotografía eliminada exitosamente");
      }
    } catch (error) {
      this.showError("Error inesperado: " + error.message);
    }
  }

  // Llenar formulario
  fillForm(photo) {
    // Llenar campos del formulario de manera segura
    const elements = {
      "photo-id": photo.id || "",
      "photo-title": photo.title || "",
      "photo-description": photo.description || "",
      "photo-price": photo.price || "",
      "photo-location": photo.location || "",
      "photo-date": photo.date || "",
      "photo-tags": (photo.tags || []).join(", "),
      "photo-status": photo.status || "available",
      "photo-image-url": photo.image_url || "",
    };

    // Llenar cada campo si existe el elemento
    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = value;
      }
    });

    // Configurar el toggle de fuente de imagen
    const uploadRadio = document.querySelector(
      'input[name="image_source"][value="upload"]'
    );
    const urlRadio = document.querySelector(
      'input[name="image_source"][value="url"]'
    );
    const uploadSection = document.getElementById("upload-section");
    const urlSection = document.getElementById("url-section");

    if (photo.image_url) {
      // Si hay URL, seleccionar opción de URL
      if (urlRadio) {
        urlRadio.checked = true;
        if (uploadSection) uploadSection.classList.add("hidden");
        if (urlSection) urlSection.classList.remove("hidden");
      }
    } else {
      // Si no hay URL, seleccionar opción de subida
      if (uploadRadio) {
        uploadRadio.checked = true;
        if (uploadSection) uploadSection.classList.remove("hidden");
        if (urlSection) urlSection.classList.add("hidden");
      }
    }

    // Mostrar preview de imagen si existe
    if (photo.image_url) {
      const previewImage = document.getElementById("preview-image");
      const fileName = document.getElementById("file-name");
      const fileSize = document.getElementById("file-size");
      const filePreview = document.getElementById("file-preview");

      if (previewImage && fileName && fileSize && filePreview) {
        previewImage.src = photo.image_url;
        fileName.textContent = "Imagen actual";
        fileSize.textContent = "URL externa";
        filePreview.classList.remove("hidden");
      }
    }
  }

  // Funciones de estado
  showLoading() {
    document.getElementById("loading-state").classList.remove("hidden");
    document.getElementById("photos-grid").classList.add("hidden");
    document.getElementById("error-state").classList.add("hidden");
    document.getElementById("empty-state").classList.add("hidden");
  }

  hideLoading() {
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("photos-grid").classList.remove("hidden");
  }

  showError(message) {
    document.getElementById("error-state").classList.remove("hidden");
    document.getElementById("error-message").textContent = message;
    document.getElementById("photos-grid").classList.add("hidden");
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("empty-state").classList.add("hidden");
  }

  hideError() {
    document.getElementById("error-state").classList.add("hidden");
  }

  showEmpty() {
    document.getElementById("empty-state").classList.remove("hidden");
    document.getElementById("photos-grid").classList.add("hidden");
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("error-state").classList.add("hidden");
  }

  hideEmpty() {
    document.getElementById("empty-state").classList.add("hidden");
  }

  showSuccess(message) {
    console.log("✅ " + message);
  }

  // Funciones de modal
  openModal() {
    const modal = document.getElementById("photo-modal");
    if (modal) {
      modal.classList.remove("hidden");

      // Solo resetear si no estamos editando
      if (!this.editingPhotoId) {
        this.resetForm();
      }
    }
  }

  closeModal() {
    const modal = document.getElementById("photo-modal");
    if (modal) {
      modal.classList.add("hidden");
    }

    // Siempre resetear al cerrar
    this.resetForm();
  }

  resetForm() {
    // Resetear formulario de manera segura
    const form = document.getElementById("photo-form");
    if (form) {
      form.reset();
    }

    // Limpiar campos específicos
    const elements = [
      "photo-id",
      "photo-title",
      "photo-description",
      "photo-price",
      "photo-location",
      "photo-date",
      "photo-tags",
      "photo-status",
      "photo-image-url",
    ];

    elements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.value = "";
      }
    });

    // Resetear estado de edición
    this.editingPhotoId = null;

    // Actualizar título del modal
    const modalTitle = document.getElementById("modal-title");
    if (modalTitle) {
      modalTitle.textContent = "Añadir Fotografía";
    }

    // Limpiar preview de archivo
    const filePreview = document.getElementById("file-preview");
    if (filePreview) {
      filePreview.classList.add("hidden");
    }

    // Resetear toggle de fuente de imagen
    const uploadRadio = document.querySelector(
      'input[name="image_source"][value="upload"]'
    );
    const urlRadio = document.querySelector(
      'input[name="image_source"][value="url"]'
    );
    const uploadSection = document.getElementById("upload-section");
    const urlSection = document.getElementById("url-section");

    if (uploadRadio && urlRadio) {
      uploadRadio.checked = true;
      if (uploadSection) uploadSection.classList.remove("hidden");
      if (urlSection) urlSection.classList.add("hidden");
    }
  }

  // Funciones de exportación
  generateCSV() {
    const headers = [
      "Título",
      "Descripción",
      "Precio",
      "Ubicación",
      "Fecha",
      "Estado",
      "Etiquetas",
    ];
    const rows = this.currentPhotography.map((photo) => [
      photo.title,
      photo.description || "",
      photo.price || "",
      photo.location || "",
      photo.date,
      photo.status,
      (photo.tags || []).join(", "),
    ]);

    return [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
  }

  downloadCSV(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}

// Actualizar fotografía
export async function updatePhotography(id, photographyData) {
  try {
    // Validar que la fotografía existe
    const { data: existingPhoto, error: fetchError } = await getPhotographyById(
      id
    );
    if (fetchError) {
      throw new Error("Fotografía no encontrada");
    }

    const { data, error } = await supabase
      .from("photography")
      .update({
        title: photographyData.title,
        description: photographyData.description,
        image_url: photographyData.image_url,
        price: photographyData.price,
        location: photographyData.location,
        date: photographyData.date,
        tags: photographyData.tags,
        status: photographyData.status,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar fotografía:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Eliminar fotografía
export async function deletePhotography(id) {
  try {
    // Validar que la fotografía existe
    const { data: existingPhoto, error: fetchError } = await getPhotographyById(
      id
    );
    if (fetchError) {
      throw new Error("Fotografía no encontrada");
    }

    const { error } = await supabase.from("photography").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar fotografía:", error);
      throw error;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { success: false, error };
  }
}

// Obtener fotografías por estado
export async function getPhotographyByStatus(status) {
  try {
    const { data, error } = await supabase
      .from("photography")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al obtener fotografías por estado:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Buscar fotografías por título o descripción
export async function searchPhotography(query) {
  try {
    const { data, error } = await supabase
      .from("photography")
      .select("*")
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al buscar fotografías:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}

// Obtener estadísticas de fotografías
export async function getPhotographyStats() {
  try {
    const { data, error } = await supabase.rpc("get_photography_stats");

    if (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { data: null, error };
  }
}
