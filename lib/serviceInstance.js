
let DEFAULT_TEMPLATE_URL = '/service-instances';
export default class Instance {
    constructor(client) {
        this.client = client;
    }
    update(params, data, f) {
        return this.client.put(`${DEFAULT_TEMPLATE_URL}/${params.id}`, data, f)
    }
    list(f) {
        return this.client.get(DEFAULT_TEMPLATE_URL, {}, f);
    }
    listOwn(f) {
        return this.client.get(`${DEFAULT_TEMPLATE_URL}/own`, f);
    }
    listSearch(params, f) {
        return this.client.get(`${DEFAULT_TEMPLATE_URL}/search`, params, f);
    }
    find(params, f) {
        if (params.id) {
            return this.client.get(`${DEFAULT_TEMPLATE_URL}/${params.id}`, {}, f);
        }
    }

    delete(params, f) {
        if (params.id) {
            return this.client.delete(`${DEFAULT_TEMPLATE_URL}/${params.id}`, {}, f);
        }
    }
    approve(params, f) {
        if (params.id) {
            return this.client.post(`${DEFAULT_TEMPLATE_URL}/${params.id}/approve`, {}, f);
        }
    }
    reactivate(params, f) {
        if (params.id) {
            return this.client.post(`${DEFAULT_TEMPLATE_URL}/${params.id}/reactivate`, {}, f);
        }
    }
    changePrice(params, data, f) {
        if (params.id) {
            return this.client.post(`${DEFAULT_TEMPLATE_URL}/${params.id}/change-price`, data, f);
        }
    }
    cancel(params, f) {
        if (params.id) {
            return this.client.post(`${DEFAULT_TEMPLATE_URL}/${params.id}/cancel`, {}, f);
        }
    }
    requestCancellation(params, f) {
        if (params.id) {
            return this.client.post(`${DEFAULT_TEMPLATE_URL}/${params.id}/request-cancellation`, {}, f);
        }
    }
}