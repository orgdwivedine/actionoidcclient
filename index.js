


const core = require('@actions/core');
const id = require('@dwivedine/oidc-client')

async function getID(){
   
   const t = github.token 
   const id_token = await id.getIDToken('ghactions', 'HelloWorld123#')
   const val = `ID token is ${t}`
   core.setOutput('id_token', t);
      
}

getID()
  

//core.setOuput('response_json', username);

