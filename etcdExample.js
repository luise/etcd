const { Infrastructure, Machine } = require('kelda');
const etcd = require('./etcd.js');

const nWorker = 3;

const baseMachine = new Machine({ provider: 'Amazon' });
const infra = new Infrastructure({
  masters: baseMachine,
  workers: baseMachine.replicate(nWorker),
});

const etcdApp = new etcd.Etcd(nWorker);
etcdApp.deploy(infra);
