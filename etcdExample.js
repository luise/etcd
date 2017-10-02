const { createDeployment, githubKeys, Machine } = require('@quilt/quilt');
const etcd = require('./etcd.js');

const nWorker = 3;

const deployment = createDeployment({});

const baseMachine = new Machine({
  provider: 'Amazon',
  sshKeys: githubKeys('ejj'), // Replace with your GitHub username.
});

deployment.deploy(baseMachine.asMaster());
deployment.deploy(baseMachine.asWorker().replicate(nWorker));
deployment.deploy(new etcd.Etcd(nWorker));
