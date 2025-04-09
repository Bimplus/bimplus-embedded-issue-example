define(function (require) {

  // Load websdk
  let WebSdk = require('bimplus/websdk');

  // Load Client integration
  let WebClient = require('bimplus/webclient');

  // Get values from URL
  let environment = WebClient.getUrlParameter('env');
  let currentToken = WebClient.getUrlParameter('token');
  let currentTeam =  WebClient.getUrlParameter('team');;
  let currentProject = WebClient.getUrlParameter('project');

  // Set some control variables
  let currentIssue = null;

  let issueList;
  let issueProperties;

  // Initalize api wrapper
  let api = new WebSdk.Api(WebSdk.createDefaultConfig(environment));
  api.setAccessToken(currentToken);

  // Create the external client or clients (separated messages) for communication with the bimplus controls
  let externalClient1 = new WebClient.ExternalClient("MyClient1");
  let externalClient2 = new WebClient.ExternalClient("MyClient2");

  // (optional) set source identification / application id + version info
  let source = "MyAppID-v0.0.1";

  let issueListFrameID = 'bimplusIssueList';
  let issuePropertiesFrameID = 'bimplusIssueProperties';

  // Create the proxy classes for issue list and properties, binding it to an exisiting iframe id
  issueList = new WebClient.BimTaskList(issueListFrameID, api.getAccessToken(), externalClient1, environment);
  issueProperties = new WebClient.BimTaskProperties(issuePropertiesFrameID, api.getAccessToken(), externalClient2, environment);

  let loadIssueProperties = (id) => {
    currentIssue = id;

    // reload issue property iframe to react on issue_id query parameter change
    let issuePropertiesFrame = document.getElementById(issuePropertiesFrameID);
    if (issuePropertiesFrame?.src) {
      document.body.removeChild(issuePropertiesFrame);
      let newIssuePropertiesFrame = document.createElement('iframe');
      newIssuePropertiesFrame.id = issuePropertiesFrameID;
      document.body.appendChild(newIssuePropertiesFrame);
    }

    issueProperties.load(currentTeam, currentProject, currentIssue, source);
  }

  let registerEventListener = () => {
    // handle messages for client/clients
    issueList.onIssueSelected = (id)=>{
      loadIssueProperties(id);
      console.log("IssueList: issue selected:" + id);
    }

    issueProperties.onIssueSelected = (id)=>{
      console.log("IssueProperties: issue selected:" + id);
      // if only one client is created, you can pass message to another proxy class
      //issueList.onIssueSelected(id);
    }

    issueList.onObjectSelected = (id/*, multiSelect, selected*/)=>{
      console.log("IssueList: object selected:" + id);
    }

    issueProperties.onObjectSelected = (id/*, multiSelect, selected*/)=>{
      console.log("issueProperties: object selected:" + id);
      // if only one client is created, you can pass message to another proxy class
      //issueList.onObjectSelected(id);
    }

    issueList.onObjectsSelected = (ids/*, multiSelect, selected*/)=>{
      console.log("IssueList: objects selected:" + ids);
    }

    issueProperties.onObjectsSelected = (ids/*, multiSelect, selected*/)=>{
      console.log("issueProperties: objects selected:" + ids);
      // if only one client is created, you can pass message to another proxy class
      //issueList.onObjectsSelected(ids);
    }

    issueList.onDataLoaded = ()=>{
      console.log("IssueList: finished loading");
    }

    issueProperties.onDataLoaded = ()=>{
      console.log("IssueProperties: finished loading");
    }

    issueList.onCheckAlive = (client)=>{
      console.log("IssueList: client:"  + client);
    }

    issueProperties.onCheckAlive = (client)=>{
      console.log("IssueProperties: client:"  + client);
    }

    issueProperties.onPinSelected = (id)=>{
      console.log("IssueProperties: selected Pin: "+id);
    }

    issueProperties.onClickedHyperlink = (url)=>{
      console.log("IssueProperties: clicked Hyperlink: "+url);
    }
  }

  registerEventListener();

  // Initialize the clients to listen for messages
  externalClient1.initialize();
  externalClient2.initialize();

  issueList.load(currentTeam, currentProject, source);
});
