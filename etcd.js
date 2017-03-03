function Etcd(n) {
    var refContainer = new Container("quay.io/coreos/etcd:v3.0.2");
    this.etcd = new Service("etcd", refContainer.replicate(n));
    var children = this.etcd.children();

    var initialCluster = [];
    children.forEach(function(host) {
        initialCluster.push(host + "=http://" + host + ":2380");
    });
    var initialClusterStr = initialCluster.join(",");

    this.etcd.containers.forEach(function(c, i) {
        var host = children[i];
        c.setEnv("ETCD_NAME", host);
        c.setEnv("ETCD_LISTEN_PEER_URLS", "http://" + host + ":2380");
        c.setEnv("ETCD_LISTEN_CLIENT_URLS", "http://0.0.0.0:2379");
        c.setEnv("ETCD_INITIAL_ADVERTISE_PEER_URLS", "http://" + host + ":2380");
        c.setEnv("ETCD_INITIAL_CLUSTER", initialClusterStr);
        c.setEnv("ETCD_INITIAL_CLUSTER_STATE", "new");
        c.setEnv("ETCD_ADVERTISE_CLIENT_URLS", "http://" + host + ":2379");
    })
    this.etcd.connect(new PortRange(1000, 65535), this.etcd);

    this.deploy = function(deployment) {
        deployment.deploy(this.etcd);
    }
}

module.exports.Etcd = Etcd;
