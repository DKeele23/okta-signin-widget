/*
 * Copyright (c) 2022-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import { waitFor } from '@testing-library/preact';
import { createAuthJsPayloadArgs, setup } from './util';

import mockResponse from '../../src/mocks/response/idp/idx/credential/enroll/enroll-phone-voice-code-mfa.json';

describe('authenticator-enroll-phone-voice', () => {
  it('should render form', async () => {
    const { container, findByText } = await setup({ mockResponse });
    await findByText(/Set up phone authentication/);
    expect(container).toMatchSnapshot();
  });

  it('should send correct payload', async () => {
    const {
      authClient, user, findByTestId, findByText, findByRole,
    } = await setup({ mockResponse });

    await findByText(/Set up phone authentication/);
    await findByText(/Calling your phone. Enter the code below to verify./);
    await findByText(/Carrier messaging charges may apply/);

    const submitButton = await findByText('Verify', { selector: 'button' });
    const otpEle = await findByTestId('credentials.passcode') as HTMLInputElement;

    const otp = '123456';
    await waitFor(async () => expect(await findByRole('heading', { level: 2 })).toHaveFocus());
    await user.type(otpEle, otp);

    expect(otpEle.value).toEqual(otp);

    await user.click(submitButton);

    expect(authClient.options.httpRequestClient).toHaveBeenCalledWith(
      ...createAuthJsPayloadArgs('POST', 'idp/idx/challenge/answer', {
        credentials: { passcode: otp },
      }),
    );
  });
});
