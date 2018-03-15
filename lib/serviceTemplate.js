
let DEFAULT_TEMPLATE_URL = '/service-templates';
export default class ServiceTemplate {
    constructor(client) {
        this.client = client;
    }
    create(data, f) {
        return this.client.post(DEFAULT_TEMPLATE_URL, data, f);
    }
    update(params, data, f) {
        return this.client.put(`${DEFAULT_TEMPLATE_URL}/${params.id}`, data, f)
    }
    list(f) {
        return this.client.get(DEFAULT_TEMPLATE_URL, {}, f);
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
    getRequestBody(params, f) {
        if (params.id) {
            return this.client.get(`${DEFAULT_TEMPLATE_URL}/${params.id}/request`, {}, f);
        }
    }
    requestInstance(params, data, f) {
        return this.client.put(`${DEFAULT_TEMPLATE_URL}/${params.id}/request`, data, f)
    }
}