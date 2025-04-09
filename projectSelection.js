define(function (require) {

  // Load websdk
  let WebSdk = require('bimplus/websdk');

  // Load Client integration
  let WebClient = require('bimplus/webclient');

  // Get parameters from URL
  let environment = WebClient.getUrlParameter('env');
  let token = WebClient.getUrlParameter('token');

  // Initalize api wrapper and set access token
  let api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));
  api.setAccessToken(token);

  let currentProject;
  let currentTeam;

  // Create the external client for communication with the bimplus controls
  let externalClient = new WebClient.ExternalClient("MyClient");

  let projects = new WebClient.BimPortal('projects', api.getAccessToken(), externalClient, environment);

  // Initialize the client to listen for messages
  externalClient.initialize();

  projects.onTeamChanged = (teamId) => {
    currentTeam = teamId;
    console.debug("onTeamChanged team-Id = " + teamId);
  };

  projects.onProjectSelected = (prjId) => {
    currentProject = prjId;
    console.debug("onProjectSelected project-Id = " + prjId);
    window.location.href = "/issues.html"
      + "?token="   + token 
      + "&env="     + environment
      + "&team="    + currentTeam 
      + "&project=" + currentProject;
  }

  // Load the project selection
  projects.load();
});