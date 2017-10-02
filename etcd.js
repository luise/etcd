const { Container, PortRange, allow } = require('@quilt/quilt');

function Etcd(n) {
  this.containers = [];
  for (let i = 0; i < n; i += 1) {
    this.containers.push(new Container('etcd', 'quay.io/coreos/etcd:v3.0.2'));
  }

  const initialCluster = this.containers.map((c) => {
    const host = c.getHostname();
    return `${host}=http://${host}:2380`;
  });
  const initialClusterStr = initialCluster.join(',');

  this.containers.forEach((c) => {
    const host = c.getHostname();
    c.setEnv('ETCD_NAME', host);
    c.setEnv('ETCD_LISTEN_PEER_URLS', `http://${host}:2380`);
    c.setEnv('ETCD_LISTEN_CLIENT_URLS', 'http://0.0.0.0:2379');
    c.setEnv('ETCD_INITIAL_ADVERTISE_PEER_URLS', `http://${host}:2380`);
    c.setEnv('ETCD_INITIAL_CLUSTER', initialClusterStr);
    c.setEnv('ETCD_INITIAL_CLUSTER_STATE', 'new');
    c.setEnv('ETCD_ADVERTISE_CLIENT_URLS', `http://${host}:2379`);
  });
  allow(this.containers, this.containers, new PortRange(1000, 65535));

  this.deploy = function deploy(deployment) {
    this.containers.forEach(container => container.deploy(deployment));
  };
}

module.exports.Etcd = Etcd;
