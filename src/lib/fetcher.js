import axios from "axios"

const fetcher = {
    get: (url, data, headers) => {
        return axios.get(url, { headers })
    },
    post: (url, data, headers) => {
        return axios.post(url, data, { headers } )
    }
}

export default fetcher;