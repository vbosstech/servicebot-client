import request from 'request';
import Bluebird from 'bluebird';
import ServiceTemplate from './serviceTemplate';


export default class Client {
    constructor(...args) {
        if (args.length === 3) {
            this.baseUrl = args[0] + '/api/v1';
            this.username = args[1];
            this.password = args[2];
        }
        if (!this.username || this.password === undefined || !this.baseUrl) {
            throw new Error('Could not construct a client with those parameters');
        }
        this.serviceTemplates = new ServiceTemplate(this);

        this.promises = false;
        this.token = null;
    }
    auth(f){
        console.log(`attempting to authenticate to ${this.baseUrl}`);
        let args = {
            method: 'post',
            uri: 'auth/token',
            body: {
                "email": this.username,
                "password": this.password
            },
            baseUrl: this.baseUrl,
            json: true,
            headers: {
                Accept: 'application/json'
            }
        };

        return request(args, f);
    }
    usePromises() {
        this.promises = true;
        return this;
    }
    useBaseUrl(baseUrl) {
        this.baseUrl = baseUrl;
        return this;
    }

    promiseProxy(f, args) {
        if (this.promises || !f) {
            const callbackHandler = this.callback;
            return new Bluebird((resolve, reject) => {
                const resolver = (err, data) => {
                    if (err) {
                        reject(new Error(JSON.stringify(err)));
                    } else {
                        resolve(data);
                    }
                };
                this.request(args, (_, r) => {
                    callbackHandler(resolver, r);
                });
            });
        } else {
            this.request(args, (_, r) => this.callback(f, r));
        }
    }
    ping(f) {
        this.request({
            uri: '/admins'
        }, (_, response) => f(response.statusCode));
    }
    put(endpoint, data, f) {
        return this.promiseProxy(f,
            {
                method: 'put',
                uri: endpoint,
                body: data
            }
        );
    }
    post(endpoint, data, f) {
        return this.promiseProxy(f,
            {
                method: 'post',
                uri: endpoint,
                body: data
            }
        );
    }
    get(endpoint, data, f) {
        return this.promiseProxy(f,
            {
                method: 'get',
                uri: endpoint,
                qs: data
            }
        );
    }
    nextPage(paginationObject, f) {
        return this.promiseProxy(f,
            {
                method: 'get',
                uri: paginationObject.next,
                baseUrl: null
            }
        );
    }
    delete(endpoint, data, f) {
        return this.promiseProxy(f,
            {
                method: 'delete',
                uri: endpoint,
                qs: data
            }
        );
    }
    request(args, callback) {
        let defaultArgs = {
            baseUrl: this.baseUrl,
            json: true,
            headers: {
                Accept: 'application/json'
            }
        };
        if(!this.token){
            this.auth((err, r) => {
                this.token = r.body.token;
                defaultArgs.headers.Authorization = "JWT " + r.body.token;
                return request(
                    Object.assign({}, defaultArgs, args),
                    callback
                );
            })
        }
        else {
            defaultArgs.headers.Authorization = "JWT " + this.token;
            return request(
                Object.assign({}, defaultArgs, args),
                callback
            );
        }
    }
    callback(f, data) {
        if (!f) {
            return;
        }
        if (f.length >= 2) {
            const hasErrors = data.error || (data.body && data.body.type === 'error.list');
            if (hasErrors) {
                f(data, null);
            } else {
                f(null, data);
            }
        } else {
            f(data);
        }
    }
}