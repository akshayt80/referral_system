import { UserToken } from "../interfaces/token.interfaces"

const USER_TOKEN_KEY = "userToken"
export const getUserToken = (): UserToken | null => {
    const tokenJson = localStorage.getItem(USER_TOKEN_KEY)
    if (tokenJson === null) {
        return tokenJson
    }
    return JSON.parse(tokenJson)
}

export const setUserToken = (userToken: UserToken) => {
    return localStorage.setItem(USER_TOKEN_KEY, JSON.stringify(userToken))
}

export const removeUserToken = () => {
    localStorage.removeItem(USER_TOKEN_KEY)
}
