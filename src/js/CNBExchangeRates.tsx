import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { chains, assets } from 'chain-registry'
import { wallets as keplrWallets } from '@cosmos-kit/keplr'
import { wallets as leapWallets } from '@cosmos-kit/leap'

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

const InnerInner = (props: InnerInnerProps) : JSX.Element => {
  const [render, forceRender] = React.useState(0)
  const [state, setState] = React.useState<State>(State.Init)
  const [data, setData] = React.useState<Data | undefined>(undefined)
  const [message, setMessage] = React.useState<string | undefined>(undefined)

  // TODO: Need to update this when preserving session after refresh
  const [wallet, setWallet] = React.useState<ChainWalletBase | undefined>(undefined)

  React.useEffect(
    () => {
      props.walletManager.setActions({
        data: setData,
        message: setMessage,
        state: setState,
        render: forceRender
      })

      props.walletManager.walletRepos.forEach((walletRepo) => {
        walletRepo.setActions({
          data: setData,
          message: setMessage,
          state: setState,
          render: forceRender
        })

        walletRepo.wallets.forEach((wallet) => {
          wallet.setActions({
            data: setData,
            message: setMessage,
            state: setState,
            render: forceRender
          })
        })
      })

      props.walletManager.mainWallets.forEach((wallet) => {
          wallet.setActions({
            data: setData,
            message: setMessage,
            state: setState,
            render: forceRender
          })
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

  const handleConnect = React.useCallback(
    (wallet: ChainWalletBase) => {
      setWallet(wallet)
      connect(props.walletRepo, wallet)
    },
    [props.walletRepo]
  )

  const handleDisconnect = React.useCallback(
    (wallet: ChainWalletBase) => {
      disconnect(props.walletRepo, wallet)
    },
    [props.walletRepo]
  )

  return (
    <>
      <h1>Hello. This is version 6</h1>

      { data && wallet && <div><button onClick={() => handleDisconnect(wallet)}>Disconnect</button></div>}

      <>
        <div>
          Wallet manager state is {JSON.stringify(state)}
        </div>
      </>

      <>
        <div>
          Wallet manager message is {JSON.stringify(message)}
        </div>
      </>

      <>
        <div>
          Wallet manager data is {JSON.stringify(data)}
        </div>
      </>

      <div>
        Choose from the list of wallets below
      </div>

      <div>
        {props.walletRepo.wallets.map((wallet) => {
          return (
            <div key={wallet.walletName}>
              <button onClick={() => { handleConnect(wallet) }}>
                {wallet.walletName}
              </button>
            </div>
          )
        })}
      </div>
    </>
  )  
}

function App(): JSX.Element {
  const chain = chains.find((chain) => { 
    return chain.chain_id === 'sgenet-1'}
  )

  const filteredAssets = assets.filter((asset) => asset.chain_name === 'sge' )

  if(chain) {
    const walletManager = new WalletManager(
      [chain],
      [...keplrWallets, ...leapWallets],
      new Logger('INFO'),
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
      undefined
    );

    const cosmosWalletRepo = walletManager
      .walletRepos
      .find((walletRepo) => walletRepo.namespace === 'cosmos')

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
  } else {
    return (
      <>
        <h1>Hello</h1>
        <div>No chain found</div>
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
