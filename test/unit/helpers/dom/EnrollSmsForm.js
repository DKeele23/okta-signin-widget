import $ from 'jquery';
import Form from './Form';
import Dom from '../dom/Dom';

const PHONE_FIELD = 'phoneNumber';
const CODE_FIELD = 'passCode';
const COUNTRIES_FIELD = 'countryCode';
export default Form.extend({
  countriesList: function() {
    return this.selectOptions(COUNTRIES_FIELD);
  },

  selectedCountry: function() {
    return this.selectedOption(COUNTRIES_FIELD);
  },

  selectCountry: function(countryCode) {
    return this.selectOption(COUNTRIES_FIELD, countryCode);
  },

  hasCountriesList: function() {
    return this.inputWrap(COUNTRIES_FIELD).find('.chzn-container').length > 0;
  },

  countryDropdown: function() {
    return this.inputWrap(COUNTRIES_FIELD).find('.chzn-container');
  },

  phoneNumberField: function() {
    return this.input(PHONE_FIELD);
  },

  getPhoneNumberAutocomplete: function() {
    return this.autocomplete(PHONE_FIELD);
  },

  phonePrefixText: function() {
    return this.inlineLabel(PHONE_FIELD).trimmedText();
  },

  sendCodeButton: function() {
    return this.el('sms-request-button').filter((_, el) => Dom.isVisible($(el))).eq(0);
  },

  divider: function() {
    return this.$('.form-divider');
  },

  codeField: function() {
    return this.input(CODE_FIELD);
  },

  getCodeFieldAutocomplete: function() {
    return this.autocomplete(CODE_FIELD);
  },

  backLink: function() {
    return this.el('back-link');
  },

  setPhoneNumber: function(val) {
    const field = this.phoneNumberField();

    field.val(val);
    field.trigger('change');
  },

  setCode: function(val) {
    const field = this.codeField();

    field.val(val);
    field.trigger('change');
  },

  hasBoldTextInWarningMessage: function() {
    return this.$('.okta-form-infobox-warning b').length > 0;
  },

  getBoldTextInWarningMessage: function() {
    return this.$('.okta-form-infobox-warning b').text().trim();
  },
});
