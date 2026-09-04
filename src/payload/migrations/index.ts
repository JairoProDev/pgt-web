import * as migration_20260903_234016_initial from './20260903_234016_initial';
import * as migration_20260904_012944_cms_seo_fields from './20260904_012944_cms_seo_fields';

export const migrations = [
  {
    up: migration_20260903_234016_initial.up,
    down: migration_20260903_234016_initial.down,
    name: '20260903_234016_initial',
  },
  {
    up: migration_20260904_012944_cms_seo_fields.up,
    down: migration_20260904_012944_cms_seo_fields.down,
    name: '20260904_012944_cms_seo_fields'
  },
];
