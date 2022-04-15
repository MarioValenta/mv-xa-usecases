import { FormControl, ValidationErrors, FormArray } from '@angular/forms';

export class CustomValidators {


  static wbspattern(c: FormControl): ValidationErrors {
    const isValidWbs = /[A-Z]\.\d{8}\.\d{2}(?:\.\d{2})?(?:\.\d{2})?$/.test(c.value);
    const message = {
      'wbspattern': {
        'message': 'Cost center in wrong format! e.g. I.12345678.00.01 or I.12345678.00.01.01'
      }
    };
    return isValidWbs ? null : message;
  }

  static ipv4pattern(c: FormArray): ValidationErrors {
    const isValidipv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\/)([0-9]|[1-2][0-9]|3[0-2])$/.test(c.value);
    const message = {
      'ipv4pattern': {
        'message': 'No valid input for network-range. Please enter a valid IPv4 or IPv6 address range in CIDR format (e.g. "10.10.10.0/24" or "2001:0db8:85a3:08d3:1319:8a2e:0370:7347/64")'
      }
    };
    return isValidipv4 ? null : message;
  }
  static ipv6pattern(c: FormArray): ValidationErrors {
    const isValidipv6 = /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/.test(c.value);
    const message = {
      'ipv6pattern': {
        'message': 'No valid input for network-range. Please enter a valid IPv4 or IPv6 address range in CIDR format (e.g. "10.10.10.0/24" or "2001:0db8:85a3:08d3:1319:8a2e:0370:7347/64")'
      }
    };
    return isValidipv6 ? null : message;
  }

  static validNumber(c: FormArray): ValidationErrors {
    const isValidNumber = /^\d*(\.\d+)?$/.test(c.value);
    const message = {
      'validNumber': {
        'message': 'Please enter a valid number (e.g. 25.10)'
      }
    };
    return isValidNumber ? null : message;
  }

  static monthyearpattern(c: FormArray): ValidationErrors {
    const isValidmonthyearpattern = /[\d]{2}\.[\d]{4}/.test(c.value);
    const message = {
      'monthyearpattern': {
        'message': 'No valid input for Period. Please enter a valid format (e.g. 03.2019)'
      }
    };
    return isValidmonthyearpattern ? null : message;
  }

}
