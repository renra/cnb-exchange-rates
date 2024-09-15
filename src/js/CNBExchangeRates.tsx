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

const connectViaCosmos = async (walletRepo: WalletRepo, wallet: ChainWalletBase) => {
  // const wc = new WalletConnect()

  // const connector = await wc.connect({
  // })
  // console.log(connector.connected)
  
  // return wallet.connect(false)
  return walletRepo.connect(wallet.walletName, false)
}

const connect = async (walletRepo: WalletRepo, wallet: ChainWalletBase) => {
  return connectViaCosmos(walletRepo, wallet)
}

const InnerInner = (props: InnerInnerProps) : JSX.Element => {
  // const [anotherState, setAnotherState] = useState<AnotherState | undefined>(undefined)

  const [render, forceRender] = React.useState(0)
  const [state, setState] = React.useState<State>(State.Init)
  const [data, setData] = React.useState<Data | undefined>(undefined)
  const [message, setMessage] = React.useState<string | undefined>(undefined)

  React.useEffect(
    () => {
      props.walletManager.setActions({
        data: setData,
        message: setMessage,
        state: setState,
      })

      props.walletManager.walletRepos.forEach((walletRepo) => {
        walletRepo.setActions({
          data: setData,
          message: setMessage,
          state: setState,
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
      // wallet.updateCallbacks({
      //   afterConnect: () => {
      //     setState({
      //       wallet,
      //       state: { type: 'connected' }
      //     })
      //   },
      //   afterDisconnect : () => {
      //     setState(undefined)
      //   },
      // })

      // setState({ wallet, state: { type: 'connecting' } })
      connect(props.walletRepo, wallet)
        // .catch((error) => { setState({ wallet, state: { type: 'error', error } }) })
    },
    [props.walletRepo]
  )

  // useEffect(() => {
  //   if(state?.state.type === 'error') {
  //     console.error(state.state.error)
  //   }
    
  // }, [state?.state.type])
            // { 'error' in state.state &&
            //     <>
            //       <div>
            //         And the error name is {state.state.error.name}
            //       </div>

            //       <div>
            //         And the error message is {state.state.error.message}
            //       </div>
            //     </>
            // }

  return (
    <>
      <h1>Hello. This is version 3</h1>

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
      new Logger('DEBUG'),
      true,
      true,
      undefined,
      filteredAssets,
      "icns",
      {
        signClient: {
          projectId: '0592f75fa032204a69cda88879fcc53c',
          // logger: generateClientLogger({ opts: { prettyPrint: true } }).logger
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
          <div>Chain found</div>
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
