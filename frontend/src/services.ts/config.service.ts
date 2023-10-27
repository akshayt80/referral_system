export const getApiUrl = () => {
    return `${backendHost()}/api/v1`
}

export const backendHost = () => {
    return `${process.env.REACT_APP_BACKEND_URL}`
}

export const frontendHost = () => {
    return `${process.env.REACT_APP_FRONTEND_URL}`
}
