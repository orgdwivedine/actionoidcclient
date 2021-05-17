


const core = require('@actions/core');
const id = require('@dwivedine/oidc-client')

async function getID(){
   const id_token = await id.getIDToken('ghactions', 'HelloWorld123#')
   const val = `ID token is ${id_token}`
   core.setOutput('id_token', id_token);
      
}

getID()
  

//core.setOuput('response_json', username);

