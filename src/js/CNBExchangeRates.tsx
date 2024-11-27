import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { chains, assets } from 'chain-registry'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { wallets as leapWallets } from '@cosmos-kit/leap'
import { SigningStargateClient } from '@cosmjs/stargate'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'

import { 
  ChainWalletBase, 
  Data, 
  Logger, State, WalletManager, 
  WalletRepo
} from '@cosmos-kit/core'

type InnerInnerProps = {
  walletRepo: WalletRepo
  walletManager: WalletManager
}

const connect = async (walletRepo: WalletRepo, wallet: ChainWalletBase) => {
  return walletRepo.connect(wallet.walletName, false)
}

const disconnect = async (walletRepo: WalletRepo, wallet: ChainWalletBase) => {
  return walletRepo.disconnect(wallet.walletName, false)
}

const CurrentWalletKey = 'cosmos-kit@2:core//current-wallet'

const InnerInner = (props: InnerInnerProps) : JSX.Element => {
  const [render, forceRender] = React.useState(0)

  React.useEffect(
    () => {
      props.walletManager.setActions({
        render: forceRender,
        data: forceRender,
        message: forceRender,
        state: forceRender
      })

      props.walletRepo.setActions({
        render: forceRender,
        data: forceRender,
        message: forceRender,
        state: forceRender
      })
    },
    []
  )

  const [walletStates, setWalletStates] = React.useState<Record<string, State>>({})
  const [walletData, setWalletData] = React.useState<Record<string, Data | undefined>>({})
  const [walletMessages, setWalletMessages] = React.useState<Record<string, string | undefined>>({})

  const [wallet, setWallet] = React.useState<ChainWalletBase | undefined>(undefined)
  const [isConnecting, setIsConnecting] = React.useState<boolean>(false)
  const [isDisconnecting, setIsDisonnecting] = React.useState<boolean>(false)

  const [signingStargateClient, setSigningStargateClient] = React.useState<SigningStargateClient | undefined>(undefined)
  const [signingStargateClientError, setSigningStargateClientError] = React.useState<Error | undefined>(undefined)

  const [signingCosmWasmClient, setSigningCosmWasmClient] = React.useState<SigningCosmWasmClient | undefined>(undefined)
  const [signingCosmWasmClientError, setSigningCosmWasmClientError] = React.useState<Error | undefined>(undefined)

  const handleConnect = React.useCallback(
    (wallet_: ChainWalletBase) => {
      setWallet(wallet_)
      setIsConnecting(true)
      connect(props.walletRepo, wallet_)
        .catch(err => alert(JSON.stringify(err)))
        .finally(() => setIsConnecting(false))
    },
    [props.walletRepo]
  )

  const handleDisconnect = React.useCallback(
    (wallet: ChainWalletBase) => {
      setIsDisonnecting(true)
      disconnect(props.walletRepo, wallet)
        .catch(err => alert(JSON.stringify(err)))
        .finally(() => setIsDisonnecting(false))

      setWallet(undefined)
    },
    [props.walletRepo]
  )

  React.useEffect(
    () => {
      const currentWalletName = localStorage.getItem(CurrentWalletKey)

      if(currentWalletName) {
        const foundWallet = props.walletRepo.wallets.find((wallet_) => wallet_.walletName === currentWalletName)        

        if(foundWallet) {
          setWallet(foundWallet)
          connect(props.walletRepo, foundWallet)
        }
      }
    },
    []
  )

  const setWalletActions = React.useCallback(
    (wallet_: ChainWalletBase) => {
      const walletName = wallet_.walletName

      wallet_.setActions({
        data: (data) => {
          setWalletData((walletData_) => {
            return {
              ...walletData_,
              [walletName]: data
            }
          })
        },
        message: (data) => {
          setWalletMessages((walletMessages_) => {
            return {
              ...walletMessages_,
              [walletName]: data
            }
          })
        },
        state: (data) => {
          setWalletStates((walletStates_) => {
            return {
              ...walletStates_,
              [walletName]: data
            }
          })
        },
        render: forceRender,
      })
    },
    []
  )

  React.useEffect(
    () => {
      props.walletRepo.wallets.forEach((repoWallet) => {
        setWalletActions(repoWallet)
      })
    },
    []
  )

  React.useEffect(
    () => {
      props.walletManager.onMounted()

      return () => {
        props.walletManager.onUnmounted()
      }
    }, 
    [render]
  )

  return (
    <>
      <h1>Hello. This is version 7</h1>

      { isConnecting && <div>Connecting ...</div> }
      { isDisconnecting && <div>Disconnecting ...</div> }
      { wallet && walletData[wallet.walletName] &&
          <>
            <div>
              <button disabled={isConnecting || isDisconnecting} onClick={() => handleDisconnect(wallet)}>Disconnect</button>
            </div>

            <div>
              { signingCosmWasmClient 
                 ? <div>Signing cosmwasm client ready</div>
                 : <div>
                     <button 
                       onClick={
                         () => { 
                           wallet.getSigningCosmWasmClient()
                             .then((client) => setSigningCosmWasmClient(client)) 
                             .catch((error: Error) => setSigningCosmWasmClientError(error)) 
                         }
                      }
                     >
                       Create Signing CosmWasm client
                     </button>
                     { signingCosmWasmClientError && <div>Got this error when trying to create the signing cosmwasm client: {signingCosmWasmClientError}</div> }
                   </div>
              }

              { signingStargateClient 
                 ? <div>Signing stargate client ready</div>
                 : <div>
                     <button 
                       onClick={
                         () => { 
                           wallet.getSigningStargateClient()
                             .then((client) => setSigningStargateClient(client)) 
                             .catch((error: Error) => setSigningStargateClientError(error)) 
                         }
                      }
                     >
                       Create Signing Stargate client
                     </button>
                     { signingStargateClientError && <div>Got this error when trying to create the signing stargate client: {signingStargateClientError}</div> }
                   </div>
              }
            </div>
          </>
      }

      <div>
        Choose from the list of wallets below
      </div>

      <div>
        {props.walletRepo.wallets.map((wallet_) => {
          return (
            <div key={wallet_.walletName}>
              <button disabled={isConnecting || isDisconnecting || (wallet !== undefined && !!walletData[wallet?.walletName])} onClick={() => { handleConnect(wallet_) }}>
                {wallet_.walletName}
              </button>
            </div>
          )
        })}
      </div>

      <hr />

      <h2>Wallets</h2>

      <>
        <div>
          Wallet states are {JSON.stringify(walletStates)}
        </div>
      </>

      <>
        <div>
          Wallet data are {JSON.stringify(walletData)}
        </div>
      </>

      <>
        <div>
          Wallet messages are {JSON.stringify(walletMessages)}
        </div>
      </>
    </>
  )  
}

const chain = chains.find((chain) => { 
  return chain.chain_id === 'sgenet-1'}
)

const filteredAssets = assets.filter((asset) => asset.chain_name === 'sge' )

if(!chain) { throw new Error('No chain') }

const walletManager = new WalletManager(
  [chain],
  [...keplrWallets, ...leapWallets],
  new Logger('DEBUG'),
  true,
  true,
  undefined,
  filteredAssets,
  "icns",
  {
    signClient: {
      projectId: 'ba2e675298b4da3e862de7fbef16de91',
    }
  },
  undefined,
  undefined,
  {
    // 1 year
    duration: 31556926000,
    callback: () => {
      console.log('Callback')
    }
  }
);

const cosmosWalletRepo = walletManager
  .walletRepos
  .find((walletRepo) => walletRepo.namespace === 'cosmos')

function App(): JSX.Element {
  if(cosmosWalletRepo) {
    return <InnerInner walletManager={walletManager} walletRepo={cosmosWalletRepo} />
  } else {
    return (
      <>
        <h1>Hello</h1>
        <div>Wallet repo not found</div>
      </>
    );
  }
}

const init = (outletId : string) : void => {
  ReactDOM.render(
    <App/ >,
    document.getElementById(outletId)
  );
}

declare global {
    interface Window { CNBExchangeRates: (outletId: string) => void; }
}

window.CNBExchangeRates = init;
