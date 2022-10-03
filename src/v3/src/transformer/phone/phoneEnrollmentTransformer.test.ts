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

import { getStubFormBag, getStubTransactionWithNextStep } from 'src/mocks/utils/utils';
import {
  FieldElement,
  WidgetProps,
} from 'src/types';

import { transformPhoneEnrollment } from '.';

describe('PhoneEnrollmentTransformer Tests', () => {
  const transaction = getStubTransactionWithNextStep();
  const widgetProps: WidgetProps = {};
  const formBag = getStubFormBag();
  beforeEach(() => {
    formBag.uischema.elements = [
      {
        type: 'Field',
        label: 'methodType',
        options: {
          inputMeta: {
            name: 'authenticator.methodType',
            options: [{
              value: 'sms',
              label: 'SMS',
            }, {
              value: 'voice',
              label: 'Phone Call',
            }],
          },
        },
      } as FieldElement,
      {
        type: 'Field',
        label: 'Phone number',
        options: { inputMeta: { name: 'authenticator.phoneNumber' } },
      } as FieldElement,
    ];
  });

  it('should create phone enrollment UI elements when multiple method types exist in transaction', () => {
    const updatedFormBag = transformPhoneEnrollment({ transaction, formBag, widgetProps });
    expect(updatedFormBag).toMatchSnapshot();
  });

  it('should create phone enrollment UI elements when only sms method types exist in transaction', () => {
    formBag.uischema.elements = [
      {
        type: 'Field',
        label: 'methodType',
        options: {
          inputMeta: {
            name: 'authenticator.methodType',
            options: [{
              value: 'sms',
              label: 'SMS',
            }],
          },
        },
      } as FieldElement,
      {
        type: 'Field',
        label: 'Phone number',
        options: { inputMeta: { name: 'authenticator.phoneNumber' } },
      } as FieldElement,
    ];
    const updatedFormBag = transformPhoneEnrollment({ transaction, formBag, widgetProps });
    expect(updatedFormBag).toMatchSnapshot();
  });

  it('should create phone enrollment UI elements when only voice method types exist in transaction', () => {
    formBag.uischema.elements = [
      {
        type: 'Field',
        label: 'methodType',
        options: {
          inputMeta: {
            name: 'authenticator.methodType',
            options: [{
              value: 'voice',
              label: 'Phone Call',
            }],
          },
        },
      } as FieldElement,
      {
        type: 'Field',
        label: 'Phone number',
        options: { inputMeta: { name: 'authenticator.phoneNumber' } },
      } as FieldElement,
    ];
    const updatedFormBag = transformPhoneEnrollment({ transaction, formBag, widgetProps });
    expect(updatedFormBag).toMatchSnapshot();
  });
});
