import CloudStorage from './src/CloudStorage'
import CloudStorageFactory from './src/CloudStorageFactory'
import IPFSAdapter from './src/IPFSAdapter'
import PersonalData from './src/PersonalData'

export { PersonalData, CloudStorageFactory }

// TODO: remove next line. Use only CloudStorageFactory for storage creating
export { CloudStorage, IPFSAdapter }
