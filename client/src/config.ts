// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'jsp6j9jbsb'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-5-85zgsg.auth0.com',            // Auth0 domain
  clientId: 'Rd6ye8R4GwuI5Tjvdl5Qi8OAV5aAfAx6',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
