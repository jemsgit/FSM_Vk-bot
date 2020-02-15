const config = {
    botApiKey: '123',
    groupId: 123,
    crmApiKey: '123',
    crmMainHost: 'host',
    crmHost: 'host',
    shop: '123'
};

const apiConfig = {
    crm: {
        getRooms: {
            url: `${config.crmHost}/list`,
            method: "GET"
        },
        getBusyPlaces: {
            url: `${config.crmHost}/busyPlaces`,
            method: "GET"
        },
        book: {
            url: `${config.crmHost}/update/{account}`,
            method: "POST"
        }
    }
}

export { config, apiConfig }