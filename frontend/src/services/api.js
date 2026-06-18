export const apiFetch = async (endpoint , content = {}) =>{
    const fullUrl = window.API_BASE_URL + endpoint;
    const defaultSettings = {
        credentials: "include",
        ...content
    };
    const response = await fetch(fullUrl , defaultSettings)
    return response
}