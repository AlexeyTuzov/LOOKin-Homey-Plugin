import Homey from 'homey';
import {pairingInfo, RemoteController} from "../../utilites/interfaces";

class SwitchDriver extends Homey.Driver {

  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Switch Driver has been initialized');
  }

  /**
   * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
   * This should return an array with the data of devices that are available for pairing.
   */
  async onPairListDevices() {
    let devicesList: pairingInfo[] = [];
    try {
      let switches = this.homey.env.LOOKinDevice.savedRC?.filter((item: RemoteController) => item.Type === '06');
      switches?.forEach((item: RemoteController) => devicesList.push({
        name: `${item.deviceInfo.Name}`,
        data: {
          id: `${item.deviceInfo.Name}${item.UUID}`
        },
        store: {
          UUID: `${item.UUID}`,
          functions: item.deviceInfo.Functions,
          IP: item.IP,
          status: item.deviceInfo.Status
        }
      }));
      return devicesList;
    } catch {
      return [];
    }
  }

}

module.exports = SwitchDriver;
