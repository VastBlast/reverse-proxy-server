const os = require('os');

// Check if the IP address belongs to the local machine
function isLocalHost(targetIP) {
  targetIP = targetIP.split(':')[0];
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];

    for (const iface of interfaces) {
      // Check if the IP address is IPv4 and matches the target IP
      if (iface.family === 'IPv4' && iface.address === targetIP) {
        return true;
      }
    }
  }

  return false;
}

module.exports = {
  isLocalHost
}