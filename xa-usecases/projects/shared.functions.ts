import { XAServices } from '@xa/lib-ui-common';
export const XASERVICE_TOKEN = 'XASERVICES_TOKEN';
import { FlatpickrOptions } from './shared/ng2-flatpickr/ng2-flatpickr.module';

export function windowFactory(): XAServices {
  return ((window as any).xa as XAServices);
}

export function getFlatpickrSettings(flatpickrSettings?: Partial<FlatpickrOptions>, addHoursToMinDate?: number) {

  return {
    enableTime: true,
    mode: 'single',
    time_24hr: true,
    weekNumbers: true,
    minuteIncrement: 15,
    defaultHour: 10,
    altInput: true,
    altFormat: 'l j.F Y, H:i',
    minDate: getDate(addHoursToMinDate),
    locale: {
      firstDayOfWeek: 1 // start week on Monday
    },
    ...flatpickrSettings
  } as FlatpickrOptions;
  // be aware there is also another defaultFlatpickrOptions in the Ng2FlatpickrComponent
}

export function getDate(addHours: number = 1): Date {
  const dt = new Date();
  return new Date(dt.setHours(dt.getHours() + addHours, 0, 0, 0));
}

export function getDateTimeUTC(addHours: number = 1): Date {
  const dt = new Date();
  return new Date(dt.setHours(dt.getUTCHours() + addHours, dt.getUTCMinutes(), dt.getUTCSeconds(), dt.getUTCMilliseconds()));
}

export function getDateTimeLocal(addHours: number = 1): Date {
  const dt = new Date();
  return new Date(dt.setHours(dt.getHours() + addHours, dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds()));
}
