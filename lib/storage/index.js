import CloudStorage from './src/CloudStorage'
import CloudStorageFactory from './src/CloudStorageFactory'
import IPFSAdapter from './src/IPFSAdapter'
import PersonalData from './src/PersonalData'
import PersonalDataBlockchainRepository from './src/Repository/PersonalDataBlockchain'
import PersonalDataStorageRepository from './src/Repository/PersonalDataStorage'

export { PersonalData, PersonalDataBlockchainRepository as PersonalDataBlockchainRepository,
    PersonalDataStorageRepository as PersonalDataStorageRepository, CloudStorageFactory }

// TODO: remove next line. Use only CloudStorageFactory for storage creating
export { CloudStorage, IPFSAdapter }
