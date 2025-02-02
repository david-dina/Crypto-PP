import Onboard from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'

const injected = injectedModule()

let onboardInstance: any = null

export const initOnboard = () => {
  if (onboardInstance) {
    return onboardInstance
  }

  onboardInstance = Onboard({
    wallets: [injected],
    chains: [
      {
        id: 11155111,
        token: 'ETH',
        label: 'Sepolia',
        rpcUrl: 'https://sepolia.infura.io/v3/6318caa00e7a48e8a961f00bf056b473s'
      }
    ],
    appMetadata: {
      name: 'NexPay (Test)',
      icon: '<your-actual-icon-url>',
      description: 'Testing crypto processor on Sepolia',
    },
    theme: 'system',
    accountCenter: {
      desktop: { position: 'bottomRight', enabled: true },
      mobile: { position: 'bottomRight', enabled: true },
    },
    connect: {
      autoConnectAllPreviousWallet: true,
    },
  })

  return onboardInstance
}

export const getConnectedWalletAddresses = async (onboard: any) => {
  const { wallets } = onboard.state.get()
  console.log('Raw onboard wallets:', wallets)
  if (wallets.length === 0) {
    console.log('No connected wallets found')
    return []
  }
  
  const walletList = wallets.map(wallet => ({
    address: wallet.accounts[0].address,
    provider: wallet.label,
    blockchain: wallet.blockchain, // You might want to determine this from chain ID
    providerImage: wallet.icon
  }))
  
  console.log('Processed wallet list:', walletList)
  return walletList
}

export const subscribeToWallets = (onboard: any, callback: (wallets: any[]) => void) => {
  return onboard.state.select('wallets').subscribe((wallets: any) => {
    console.log('Wallet state changed:', wallets)
    if (wallets.length) {
      const connectedWallets = wallets.map(w => ({
        address: w.accounts[0].address,
        provider: w.label,
        blockchain: 'Sepolia',
        providerImage: w.icon
      }))
      callback(connectedWallets)
    } else {
      callback([])
    }
  })
}
