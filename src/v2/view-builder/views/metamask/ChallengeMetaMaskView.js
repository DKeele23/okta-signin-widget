import { loc } from "okta";
import BaseAuthenticatorView from "v2/view-builder/components/BaseAuthenticatorView";
import { BaseForm, BaseHeader } from "v2/view-builder/internals";
import { ethers } from 'ethers';
import { SiweMessage } from 'siwe';
import { FORMS } from "v2/ion/RemediationConstants";
import HeaderBeacon from "v2/view-builder/components/HeaderBeacon";

const domain = window.location.host;
const origin = window.location.origin;

let currentAccount = null;
const handleAccountsChanged = (accounts) => {
  if (accounts.length && accounts.length > 0 && accounts[0] !== currentAccount) {
    currentAccount = accounts[0];
  }
};
// initial wallet check
if (typeof window.ethereum !== 'undefined' && ethereum.isMetaMask) {
  ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error(err);
    });
}

const Body = BaseForm.extend({

  title() {
    return loc('oie.verify.metamask.title', 'login');
  },

  async initialize() {
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.nonce = this.options.appState.get('currentAuthenticator').contextualData.challengeData.challenge;
    this.stateHandle = this.options.currentViewState.value.filter((val) => { return val.name === 'stateHandle' })[0].value;

    const credentials = await this.challengeMetaMask();
    this.model.set({
      credentials
    });
    this.saveForm(this.model);
  },

  async challengeMetaMask() {
    const signer = await this.provider.getSigner();
    // get nonce
    // const nonce = await getNonce(nonceHref, stateHandle);

    const message = await this.createSiweMessage(
      currentAccount,
      'Sign in with Ethereum to the app.',
      this.nonce
    );
    const signature = await signer.signMessage(message);
    console.log(signature);
    console.log(currentAccount);

    const credentials = {
      credentialId: currentAccount,
      signatureData: signature
    };

    return credentials;
  },

  async getNonce(href, stateHandle) {
    const resp = await fetch(href, {
      method: "POST",
      body: {
        stateHandle
      }
    });
    const body = await resp.json();
    return body.nonce;
  },

  async createSiweMessage(address, statement, nonce) {
    const message = new SiweMessage({
      domain,
      address,
      statement,
      uri: origin,
      version: '1',
      chainId: '1',
      nonce: nonce
    });
    return message.prepareMessage();
  },

  className: 'oie-verify-metamask',

  noButtonBar: true,
});

export default BaseAuthenticatorView.extend({
  Header: BaseHeader.extend({
    HeaderBeacon: HeaderBeacon.extend({
      authenticatorKey() {
        return this.options.appState.get('authenticatorKey');
      },
      getBeaconClassName: function () {
        return 'mfa-metamask';
      },
    }),
  }),
  Body,
  postRender() {
    BaseAuthenticatorView.prototype.postRender.apply(this, arguments);
  },
});