let Client = require('../dist/lib').Client;
require('jest');

let client = new Client('https://demobot.serviceshop.io', 'midkiffks2@gmail.com', '12341234');


let testCreate = {
    category_id: 1,
    created_by: 1,
    name: 'Client Created Template 2',
    description: 'This is a great service that was created from the client',
    details: '<p>details</p>',
    published: true,
    statement_descriptor: 'demobot',
    trial_period_days: 30,
    amount: 10000,
    overhead: null,
    currency: 'usd',
    interval: 'month',
    interval_count: 1,
    type: 'subscription',
    subscription_prorate: true,
};


it('create new template', async () => {
    expect.assertions(5);
    //expect(data.body).toHaveProperty('body.', value); could check for length or values
    let template = await client.serviceTemplates.create(testCreate);
    if(template.statusCode !== 200){
        throw(template.body.error)
    }
    expect(template.statusCode).toEqual(200);

    let templateId = template.body.id;
    console.log("Template created:", templateId);

    let newTemplate = await client.serviceTemplates.find({id: templateId});
    console.log("The New Template:", newTemplate.body);
    expect(newTemplate.statusCode).toEqual(200);

    let templateRequest = await client.serviceTemplates.getRequestBody({id:templateId});
    if(templateRequest.statusCode !== 200){
        throw(templateRequest.body.error)
    }
    console.log("Template Request:", templateRequest.body);
    expect(templateRequest.statusCode).toEqual(200);

    //request Instance
    let templateRequestBody = templateRequest.body;
    templateRequestBody.email = "ClientTest@servicebot.io"

    let instanceRequest = await client.serviceTemplates.requestInstance({id:templateId}, templateRequestBody);
    if(instanceRequest.statusCode !== 200){
        throw(templateRequest.body.error)
    }
    console.log("Instance Request:", instanceRequest.body);
    expect(instanceRequest.statusCode).toEqual(200);
/*
    let deleteReq = await client.serviceTemplates.delete({id: templateId});
    if(deleteReq.statusCode !== 200){
        throw(deleteReq.body.error)
    }
    console.log("Delete Response:", deleteReq.body.message);

    expect(deleteReq.statusCode).toEqual(200);

    let oldTemplate = await client.serviceTemplates.find({id: templateId});
    console.log("The Old Template:", oldTemplate.statusCode);
    expect(oldTemplate.statusCode).toEqual(404);
    //return await client.serviceTemplates.list();
    */
});




async function testTemplateLifecycle(){
    let template = await client.serviceTemplates.create(testCreate);
    if(template.statusCode !== 200){
        throw(template.body.error)
    }
    let templateId = template.body.id;
    console.log("Template created:", templateId);

    let list = await client.serviceTemplates.find({id: templateId});
    console.log("The New Template:", list.body);

    let templateRequest = await client.serviceTemplates.getRequestBody({id:templateId});
    if(templateRequest.statusCode !== 200){
        throw(templateRequest.body.error)
    }
    console.log("Template Request:", templateRequest.body);
    //request Instance

    let deleteReq = await client.serviceTemplates.delete({id: templateId});
    if(deleteReq.statusCode !== 200){
        throw(deleteReq.body.error)
    }
    console.log("Delete Response:", deleteReq.body.message);
    return await client.serviceTemplates.list();
}


/*
try {
    testTemplateLifecycle().then(resp => {
        console.log(resp.body);
    }).catch(error => {
        console.error(error);
    });
}catch(e){
    console.error(e);
}*/
