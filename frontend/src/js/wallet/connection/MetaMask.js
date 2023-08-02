import AbstractConnector from "./AbstractConnector";
import { parseChainId } from "../parseChainId";

export class MetaMask extends AbstractConnector {

  constructor() {
    super();
    this.eagerConnection = null;
  }

  /**
   * interface AddEthereumChainParameter {
   *  chainId: number;
   *  chainName: string;
   *  nativeCurrency: {
   *    name: string;
   *    symbol: string; // 2-6 characters long
   *    decimals: 18;
   *  };
   *  rpcUrls: string[];
   *  blockExplorerUrls?: string[];
   *  iconUrls?: string[]; // Currently ignored.
   * }
   */

  /**
   * 如果定义了，表示希望连接到的目标链。如果用户已经连接到该链，将不会采取任何额外步骤。
   * 否则，如果满足以下两种条件之一，用户将被提示切换到该链：
   * 要么在扩展中已经添加了该链，
   * 要么参数是 AddEthereumChainParameter 类型，在这种情况下，用户将首先被提示根据指定参数添加该链，然后再提示切换。
   * @param {*} desiredChainIdOrChainParameters
   */
  async activate(desiredChainIdOrChainParameters) {
    return this.isomorphicInitialize().then(async() => {
        if (!this.provider) throw new Error('MetaMask not installed');
        return Promise.all([
          this.provider.request({ method: 'eth_chainId' }),
          this.provider.request({ method: 'eth_requestAccounts' }),
        ]).then(([chainId, accounts]) => {
          const receivedChainId = parseChainId(chainId);
          const desiredChainId = typeof desiredChainIdOrChainParameters === 'number'
            ? desiredChainIdOrChainParameters
            : desiredChainIdOrChainParameters?.chainId;

          if (!desiredChainId || receivedChainId === desiredChainId) {
            this.accounts = accounts;
            this.chainId = receivedChainId;
            this.emit('onChange', { chainId: receivedChainId, accounts });
            return;
          }

          const desiredChainIdHex = `0x${desiredChainId.toString(16)}`;

          return this.provider?.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: desiredChainIdHex,
            }],
          }).catch((error) => {
            if (error.code === 4902 && typeof desiredChainIdOrChainParameters !== 'number') {
              return this.provider?.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    ...desiredChainIdOrChainParameters,
                    chainId: desiredChainIdHex,
                  },
                ],
              });
            }
            throw error;
          }).then(() => this.activate(desiredChainId));
        });
      }).catch((error) => {
        throw error;
      });
  }

  /**
   * @private
   * @returns
   */
  async isomorphicInitialize() {
    if (this.eagerConnection) {
      return;
    }
    return (this.eagerConnection = import('@metamask/detect-provider').then(async (m) => {
      const provider = await m.default(this.options);
      if (provider) {
        this.provider = provider;
        if (this.provider.providers?.length) {
          this.provider = this.provider.providers.find((p) => p.isMetaMask) ?? this.provider.providers[0];
        }

        this.provider.on('connect', ({ chainId }) => {
          this.chainId = chainId;
          this.emit('onConnect', { chainId: parseChainId(chainId) });
        });

        this.provider.on('disconnect', (error) => {
          this.chainId = null;
          this.accounts = null;
          this.emit('onDisconnect');
        });

        this.provider.on('chainChanged', (chainId) => {
          this.emit('onChange', { chainId: parseChainId(chainId) });
        });

        this.provider.on('accountsChanged', (accounts) => {
          if (accounts.length === 0) {
            this.accounts = null;
          } else {
            this.accounts = accounts;
          }
          this.emit('onChange', { accounts });
        });
      }
    }));
  }
}
