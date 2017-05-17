const {createDeployment, githubKeys, Machine} = require("@quilt/quilt");
var etcd = require("./etcd.js");

var nWorker = 3;

var deployment = createDeployment({});

var baseMachine = new Machine({
    provider: "Amazon",
    sshKeys: githubKeys("ejj"), // Replace with your GitHub username.
});

deployment.deploy(baseMachine.asMaster())
deployment.deploy(baseMachine.asWorker().replicate(nWorker))
deployment.deploy(new etcd.Etcd(nWorker));
