import {XANotifyStyle} from '@xa/ui';

/**
 * XANotify default configuration object
 */
export const XAToastDefaults = {
  global: {
    newOnTop: true,
    maxOnScreen: 8,
    maxAtPosition: 8,
    filterDuplicates: false
  },
  toast: {
    type: 'simple',
    showProgressBar: true,
    timeout: 4000,
    closeOnClick: true,
    pauseOnHover: true,
    bodyMaxLength: 150,
    titleMaxLength: 16,
    backdrop: -1,
    icon: null,
    iconClass: null,
    html: null,
    position: 'rightBottom',
    animation: {enter: 'fadeIn', exit: 'fadeOut', time: 400}
  },
  type: {
    [XANotifyStyle.prompt]: {
      timeout: 0,
      closeOnClick: false,
      buttons: [
        {text: 'Ok', action: null, bold: true},
        {text: 'Cancel', action: null, bold: false},
      ],
      placeholder: 'Enter answer here...',
      type: 'prompt',
    },
    [XANotifyStyle.confirm]: {
      timeout: 0,
      closeOnClick: false,
      buttons: [
        {text: 'Ok', action: null, bold: true},
        {text: 'Cancel', action: null, bold: false},
      ],
      type: 'confirm',
    },
    [XANotifyStyle.simple]: {
      type: 'simple'
    },
    [XANotifyStyle.success]: {
      type: 'success'
    },
    [XANotifyStyle.error]: {
      type: 'error'
    },
    [XANotifyStyle.warning]: {
      type: 'warning'
    },
    [XANotifyStyle.info]: {
      type: 'info'
    },
    [XANotifyStyle.async]: {
      pauseOnHover: false,
      closeOnClick: false,
      timeout: 0,
      showProgressBar: false,
      type: 'async'
    }
  }
};
