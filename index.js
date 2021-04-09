
/*
const client_id = core.getInput('client_id', {required: true});
const client_secret = core.getInput('client_secret', {required: true});
const username = core.getInput('username', {required: true});
const password = core.getInput('password', {required: true});
const scope = core.getInput('scope', {required: true}); */

//let data = {'grant_type':"password", 'client_id':client_id, 'username':username, 'password':password, 'scope':scope, 'client_secret':client_secret};
//console.log(data);
const fetch = require("node-fetch");
const core = require('@actions/core');

async function postData(){
    const response = await fetch("https://ghactionsoidc.azurewebsites.net/connect/token/", {
        method: "POST", 
        body: new URLSearchParams({'grant_type':'password', 'client_id':'ghactions', 'username':'demorepo', 'password':'HelloWorld123#', 'scope':'openid', 'client_secret':'HelloWorld123#' }),
      });
      return response.json();
      
}

postData()
  .then(data => {
    core.setOutput('response_json', data);
  });

