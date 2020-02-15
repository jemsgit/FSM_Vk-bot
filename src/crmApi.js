import fetcher from './lib/fetcher';
import { config, apiConfig } from './config';
import request from 'request';

let customHeaders = {
    'accept': 'application/json;charset=UTF-8',
    'authorization': config.crmApiKey,
    'Host': config.crmMainHost
}

let service = {
    loadRooms: () => {
        console.log('loading rooms req11')
        return fetcher.get(`${apiConfig.crm.getRooms.url}?shopGuid=${config.shop}`, null, customHeaders)
            .then((res) => {
                return res.data
            })
    },
    loadPlaces: (date, timeFrom, timeTo) => {
        return fetcher.get(`${apiConfig.crm.getBusyPlaces.url}?shopGuid=${config.shop}&date=${date}&timeFrom=${timeFrom}&timeTo=${timeTo}`, null, customHeaders)
            .then((res) => {
                console.log(res)
            })
    },
    book: (account, data) => {
        return fetcher.post(apiConfig.crm.book.url.replace('{account}', account), data, customHeaders)
            .then((res) => {
                console.log(res)
            })
    }
}

export default service;