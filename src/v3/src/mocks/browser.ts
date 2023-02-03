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

/* eslint-disable no-console */
import './scenario';

import { setupWorker, SetupWorkerApi } from 'msw';

import { loadScenario } from './registry';

const DEFAULT_SCENARIO_NAME = 'development';

const getMockResponse = (mockResponseParam: string | null): any | undefined => {
  if (!mockResponseParam) {
    return undefined;
  }

  // Enables us to feed v2 mock files to be loaded as a mock response
  // i.e. '@okta/mocks/data/idp/idx/identify.json'
  if (mockResponseParam.includes('@okta/mocks')) {
    return require(mockResponseParam);
  }
  return require(`./response${mockResponseParam}.json`);
};

// This configures a Service Worker with the given request handlers.
export const getWorker = async (): Promise<SetupWorkerApi | null> => {
  const params = new URL(document.location.href).searchParams;

  const enableMocks = params.get('siw-use-mocks') === 'true';

  if (enableMocks) {
    const scenarioName = params.get('siw-mock-scenario') ?? DEFAULT_SCENARIO_NAME;

    // pass through mock response from query params
    const mockResponseParam = params.get('siw-mock-response');
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const mockResponse = getMockResponse(mockResponseParam);

    const handlers = loadScenario(scenarioName, mockResponse);

    console.info(`[MSW-Wrapper] Scenario selected: ${scenarioName}`);

    return setupWorker(...handlers);
  }

  console.info('[MSW-Wrapper] If you want to use mocking, add "siw-use-mocks=true" to the URL query parameters.');

  return null;
};
