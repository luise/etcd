const { Container, PortRange, allow } = require('@quilt/quilt');

function Etcd(n) {
  const refContainer = new Container('etcd', 'quay.io/coreos/etcd:v3.0.2');
  this.cluster = refContainer.replicate(n);

  const initialCluster = this.cluster.map((c) => {
    const host = c.getHostname();
    return `${host}=http://${host}:2380`;
  });
  const initialClusterStr = initialCluster.join(',');

  this.cluster.forEach((c) => {
    const host = c.getHostname();
    c.setEnv('ETCD_NAME', host);
    c.setEnv('ETCD_LISTEN_PEER_URLS', `http://${host}:2380`);
    c.setEnv('ETCD_LISTEN_CLIENT_URLS', 'http://0.0.0.0:2379');
    c.setEnv('ETCD_INITIAL_ADVERTISE_PEER_URLS', `http://${host}:2380`);
    c.setEnv('ETCD_INITIAL_CLUSTER', initialClusterStr);
    c.setEnv('ETCD_INITIAL_CLUSTER_STATE', 'new');
    c.setEnv('ETCD_ADVERTISE_CLIENT_URLS', `http://${host}:2379`);
  });
  allow(this.cluster, this.cluster, new PortRange(1000, 65535));

  this.deploy = function deploy(deployment) {
    deployment.deploy(this.cluster);
  };
}

module.exports.Etcd = Etcd;
