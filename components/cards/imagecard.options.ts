import { pick } from '../../helpers/utils/object';
import { RATIOS } from '../../types';

export const IMAGE_RATIO_OPTIONS = pick(RATIOS, '19/27', '1/1', '4/3');
export type ImageRatioType = keyof typeof IMAGE_RATIO_OPTIONS;