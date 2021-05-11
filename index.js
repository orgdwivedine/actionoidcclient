
/*
const client_id = core.getInput('client_id', {required: true});
const client_secret = core.getInput('client_secret', {required: true});*/
//const username = core.getInput('username', {required: false});
/*const password = core.getInput('password', {required: true});
const scope = core.getInput('scope', {required: true}); */

//let data = {'grant_type':"password", 'client_id':client_id, 'username':username, 'password':password, 'scope':scope, 'client_secret':client_secret};
//console.log(data);
const fetch = require("node-fetch");
const core = require('@actions/core');
const id = require('@dwivedine/oidc-client')
const github = require('@actions/github')

async function postData(){
  const github_data = JSON.stringify(github, undefined, 2)
  core.setOutput('id_token', github_data);

  /*
   const id_token = await id.getIDToken('ghactions', 'HelloWorld123#', '3')
   const val = `ID token is ${id_token}`
   core.setOutput('id_token', id_token);
   */
      
}

postData()
  

//core.setOuput('response_json', username);

