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

import { Ref, useEffect, useRef } from 'preact/hooks';

import { useWidgetContext } from '../contexts';

type InteractiveElement =
  | HTMLInputElement
  | HTMLButtonElement
  | HTMLTextAreaElement
  | HTMLSelectElement
  | HTMLAnchorElement;

export function useAutoFocus<T extends InteractiveElement>(
  focus?: boolean,
): Ref<T> {
  const { widgetProps } = useWidgetContext();
  // Product requests autoFocus default to be false
  const { features: { autoFocus = false } = {} } = widgetProps;
  const inputRef = useRef<T>(null);
  useEffect(() => {
    if (autoFocus && focus && inputRef.current) {
      if (inputRef.current?.focus) {
        inputRef.current.focus();
      } else if ((inputRef.current as any).base) { //todo
        (inputRef.current as any).base.focus?.();
      }
    }
  }, [autoFocus, focus]);
  return inputRef;
}
