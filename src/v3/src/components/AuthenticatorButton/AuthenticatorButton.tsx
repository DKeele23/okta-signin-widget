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

import { useOdysseyDesignTokens } from '@okta/odyssey-react-mui';
import { ArrowLeftIcon, ArrowRightIcon } from '@okta/odyssey-react-mui/icons';
import { Box, Typography } from '@okta/odyssey-react-mui-legacy';
import classNames from 'classnames';
import { h } from 'preact';

import { useWidgetContext } from '../../contexts';
import { useAutoFocus, useOnSubmit, useOnSubmitValidation } from '../../hooks';
import {
  AuthenticatorButtonElement,
  ClickHandler,
  UISchemaElementComponent,
} from '../../types';
import { getTranslation, getValidationMessages } from '../../util';
import AuthCoin from '../AuthCoin/AuthCoin';

const AuthenticatorButton: UISchemaElementComponent<{
  uischema: AuthenticatorButtonElement
}> = ({ uischema }) => {
  const {
    translations = [],
    focus,
    ariaDescribedBy,
    noTranslate,
    options: {
      type,
      key: authenticationKey,
      actionParams,
      description,
      nickname,
      usageDescription,
      logoUri,
      ctaLabel,
      dataSe,
      iconName,
      iconDescr,
      step,
      includeData,
      includeImmutableData,
    },
  } = uischema;
  const label = getTranslation(translations, 'label');
  const {
    dataSchemaRef, data, loading, languageDirection,
  } = useWidgetContext();
  const onSubmitHandler = useOnSubmit();
  const onValidationHandler = useOnSubmitValidation();
  const focusRef = useAutoFocus<HTMLButtonElement>(focus);
  const describedByIds = [
    ariaDescribedBy,
    description && `${iconName}-description`,
    nickname && `${iconName}-nickname`,
    usageDescription && `${iconName}-usageDescription`,
    `${iconName}-ctaLabel`,
  ].filter(Boolean).join(' ');
  const tokens = useOdysseyDesignTokens();

  const onClick: ClickHandler = async () => {
    const dataSchema = dataSchemaRef.current!;
    const errorMessages = getValidationMessages(
      dataSchema,
      dataSchema.fieldsToValidate,
      data,
      actionParams,
    );
    if (errorMessages) {
      onValidationHandler(errorMessages);
      return;
    }
    onSubmitHandler({
      step,
      params: actionParams,
      includeData,
      includeImmutableData,
    });
  };

  return (
    <Box
      component="button"
      type={type}
      sx={{
        '&:focus': {
          outlineColor: tokens.PalettePrimaryMain,
          outlineOffset: tokens.FocusOutlineOffsetMain,
          outlineStyle: tokens.FocusOutlineStyle,
          outlineWidth: tokens.FocusOutlineWidthMain,
        },
        '&:hover': {
          color: tokens.PalettePrimaryDark,
          cursor: 'pointer',
          borderColor: tokens.PalettePrimaryMain,
        },
        width: 1,
        // Assuming we want to allow users to customize this color, we should try to map this to
        // a more semantic token. We also don't want users to override white just for this
        backgroundColor: tokens.HueNeutralWhite,
        paddingBlock: tokens.Spacing3,
        paddingInline: tokens.Spacing3,
      }}
      display="flex"
      border={1}
      borderColor="grey.200"
      borderRadius={tokens.BorderRadiusMain}
      className="authenticator-row"
      data-se="authenticator-button"
      tabIndex={0}
      onClick={onClick}
      onKeyPress={onClick}
      ref={focusRef}
      disabled={loading}
      aria-labelledby={`${iconName}-label`}
      aria-describedby={describedByIds}
    >
      { authenticationKey && (
        <Box
          className="authenticator-icon-container"
          data-se="authenticator-icon"
        >
          <AuthCoin
            authenticatorKey={authenticationKey}
            url={logoUri}
            name={iconName}
            description={iconDescr}
            customClasses={['authenticator-icon']}
          />
        </Box>
      )}
      <Box
        className="authenticator-description"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          paddingBlock: 0,
          paddingInline: '12px 0',
          // needed to solve ie11 'flexbug' where nested flex element overflows container
          minInlineSize: '0%',
        }}
      >
        <Typography
          variant="h3"
          id={`${iconName}-label`}
          sx={{
            fontSize: tokens.TypographySizeBody,
            fontWeight: tokens.TypographyWeightBodyBold,
            margin: 0,
            marginBlockEnd: '6px',
            textAlign: 'start',
          }}
          data-se="authenticator-button-label"
          className="authenticator-label no-translate"
        >
          {label}
        </Typography>
        {description && (
          <Typography
            paragraph
            id={`${iconName}-description`}
            sx={{
              fontSize: tokens.TypographySizeSubordinate,
              margin: 0,
              marginBlockEnd: '6px',
              textAlign: 'start',
            }}
            data-se="authenticator-button-description"
            className={classNames('authenticator-description--text', { 'no-translate': noTranslate })}
          >
            {description}
          </Typography>
        )}
        {nickname && (
          <Typography
            paragraph
            id={`${iconName}-nickname`}
            sx={{
              fontSize: '.875rem',
              margin: 0,
              marginBlockEnd: '6px',
              textAlign: 'start',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
            title={nickname}
            data-se="authenticator-button-nickname"
            className={classNames('authenticator-enrollment-nickname', 'no-translate')}
          >
            {nickname}
          </Typography>
        )}
        {usageDescription && (
          <Typography
            variant="caption"
            id={`${iconName}-usageDescription`}
            textAlign="start"
            sx={{
              fontSize: '.875rem',
              margin: 0,
              marginBlockEnd: '6px',
              color: 'text.secondary',
            }}
            data-se="authenticator-button-usage-text"
            className="authenticator-usage-text"
          >
            {usageDescription}
          </Typography>
        )}
        <Box
          className="cta-button authenticator-button"
          data-se={dataSe}
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBlockStart: '5px',
            marginInline: 0,
            color: tokens.TypographyColorAction,
            '& svg': {
              marginBlock: 0,
              marginInline: '5px 0',
            },
          }}
        >
          <Box
            component="span"
            id={`${iconName}-ctaLabel`}
            sx={{
              fontWeight: tokens.TypographyWeightBodyBold,
              fontSize: tokens.TypographySizeBody
            }}
            data-se="cta-button-label"
            className="button select-factor link-button"
          >
            {ctaLabel}
          </Box>
          {
            languageDirection === 'rtl'
              ? <ArrowLeftIcon titleAccess={ctaLabel} />
              : <ArrowRightIcon titleAccess={ctaLabel} />
          }
        </Box>
      </Box>
    </Box>
  );
};
export default AuthenticatorButton;
