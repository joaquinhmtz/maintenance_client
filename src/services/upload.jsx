import { api } from "./authentication";
/**
 * Sube uno o varios archivos al servidor.
 *
 * @param {Object} params
 * @param {string} params.modulo     - "ordenes-trabajo" | "solicitudes"
 * @param {string} params.entidadId  - _id del documento padre
 * @param {string} params.categoria  - "evidencias" | "firmas" | "adjuntos"
 * @param {File[]} params.files
 * @returns {Promise<Array>} - Lista de attachments con su url firmada
 */
export async function uploadFiles({ module, referencesId, category, files }) {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    const { data } = await api.post(
        `/api/uploads/${module}/${referencesId}/${category}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );

    return data.data;
}

/**
 * Obtiene los attachments de una entidad con URLs firmadas frescas.
 * Llama esto cada vez que abres el detalle de una OT/Solicitud —
 * así las URLs siempre están vigentes en pantalla.
 */
export async function getAttachments(modulo, entidadId, categoria) {
    const { data } = await api.get(`/api/uploads/${modulo}/${entidadId}`, {
        params: categoria ? { categoria } : {},
    });
    return data.data;
}

export async function deleteAttachment(attachmentId) {
    const { data } = await api.delete(`/api/uploads/${attachmentId}`);
    return data;
}

export async function GetAttachment(id) {
    const { data } = await api.get(`/api/files/${id}`);
    return data.data;
}