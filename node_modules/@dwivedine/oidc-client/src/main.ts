import * as core from '@actions/core'
import {HttpClient} from '@actions/http-client'
import {BearerCredentialHandler} from '@actions/http-client/auth'
import {IRequestOptions, IHeaders} from '@actions/http-client/interfaces'
import {Octokit} from '@octokit/core'

async function getTokenEndPoint(): Promise<string> {
  const httpclient: HttpClient = createHttpClient()
  core.debug(`Httpclient created ${httpclient} `) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

  const url: string =
    'https://ghactionsoidc.azurewebsites.net/.well-known/openid-configuration'
  core.debug(`Url is ${url}`)

  const response = await httpclient.get(url)
  if(response.message.statusCode != 200)
  {
    throw new Error(
      `Failed to get Token end point. Error code :${response.message.statusCode} `
    )
  }
  
  const body: string = await response.readBody()
  const val = JSON.parse(body)
  const token_endpoint_url: string= val['token_endpoint']
  core.debug(`token endpoint url in function is  ${token_endpoint_url}`)
  return token_endpoint_url
}

function createAcceptHeader(type: string, apiVersion: string): string {
  return `${type};api-version=${apiVersion}`
}

function getRequestOptions(): IRequestOptions {
  const requestOptions: IRequestOptions = {
    headers: {
      Accept: createAcceptHeader('application/json', '6.0-preview.1')
    }
  }

  return requestOptions
}

function createHttpClient(): HttpClient {
  const token = process.env['GITHUB_TOKEN'] || ''
  const bearerCredentialHandler = new BearerCredentialHandler(token)

  return new HttpClient(
    'actions/cache',
    [bearerCredentialHandler],
    getRequestOptions()
  )
}

function getApiVersion(): string {
  return '6.0-preview'
}

function getUploadHeaders(contentType: string): IHeaders {
  const requestOptions: IHeaders = {}
  requestOptions['Accept'] = `application/json;api-version=${getApiVersion()}`
  if (contentType) {
    requestOptions['Content-Type'] = contentType
    requestOptions['Grant_Type'] = 'password'
  }

  return requestOptions
}

export async function getIDToken(
  clientid: string,
  clientsecret: string,
  url: string
): Promise<string> {
  try {
    const url_token_endpoint : string = await getTokenEndPoint()

    core.debug(`token endpoint url is ${url_token_endpoint}`)

    const token: string | undefined = process.env['GITHUB_TOKEN']
    const repo_path: string | undefined = process.env['GITHUB_REPOSITORY']
    const workspace: string | undefined = process.env['GITHUB_WORKSPACE']
    const ref: string | undefined = process.env['GITHUB_REF']

    if(repo_path === undefined || token === undefined || workspace === undefined || ref === undefined)
    {
      throw new Error(
        `One of the value is undefined. Token : ${token}, Repo : ${repo_path}, Workspace : ${workspace}, Ref : ${ref}`
      )
      
    }
    
    const [owner, repo]: string[] = repo_path!.split('/')
    const branch = ref!.match(/(?<=refs\/heads\/).+/g)![0]

    if(owner == undefined || repo == undefined || branch == undefined)
    {
      throw new Error(
        `One of the value is undefined. Owner : ${owner}, Repo : ${repo}, Branch : ${branch}`
      )
    }
    core.debug(`owner is ${owner}`)
    core.debug(`repo is ${repo}`)
    core.debug(`branch is ${branch}`)


    const httpclient: HttpClient = createHttpClient()
    core.debug(`Httpclient created ${httpclient} `) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const parameters = `grant_type=password&client_id=${clientid}&username=demorepo&password=HelloWorld123#&scope=openid&client_secret=${clientsecret}`


    const headers = getUploadHeaders('application/x-www-form-urlencoded')
    core.debug(`header is ${headers}`)

    const response = await httpclient.post(
      url_token_endpoint,
      parameters,
      headers
    )

    if(response.message.statusCode != 200)
  {
    throw new Error(
      `Failed to get ID Token. Error code :${response.message.statusCode} `
    )
  }

    const body: string = await response.readBody()
    const val = JSON.parse(body)
    const id_token = val['id_token']

    return id_token
  } catch (error) {
    core.setFailed(error.message)
    return error.message
  }
}

module.exports.getIDToken = getIDToken
