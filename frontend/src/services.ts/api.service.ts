import { getApiUrl } from "./config.service";
import { getUserToken } from "./token.service"

function getUrl(path: string): string {
    console.log(`api url: ${getApiUrl()}${path}`)
    return `${getApiUrl()}${path}`
}

const getAuthHeader = () => {
    const userToken = getUserToken();
    if (userToken) {
        return { Authorization: `Bearer ${userToken.token}` }
    }
    return {}
}

const fetchAPI = async (url: string, options: RequestInit) => {
    return await fetch(url, options)
        .then((response: Response) => {
            if (response.status >= 400) {
                throw response
            }
            if (response.status == 204) {
                // No content
                return
            }
            return response.json()
        })
}

export async function get(path: string, authRequired: boolean = false) {
    let options = {}
    if (authRequired) {
        options = {
            headers: { ...getAuthHeader() }
        }
    }

    return await fetchAPI(getUrl(path), options)
}

export async function post(path: string, body: object, authRequired: boolean = false) {
    let options = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (authRequired) {
        options = { ...options, headers: { ...options.headers, ...getAuthHeader() } }
    }

    return await fetchAPI(getUrl(path), options)
}
