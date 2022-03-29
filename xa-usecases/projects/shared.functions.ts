import { XAServices } from '@xa/lib-ui-common';
export const XASERVICE_TOKEN = 'XASERVICES_TOKEN';

export function windowFactory(): XAServices {
  return ((window as any).xa as XAServices);
}
