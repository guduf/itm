import { ItmGrid } from '../../../../itm-core/src/public_api';

export interface GridPlayground {
  label: string;
  grid: ItmGrid.Config;
  target: Object;
}

export const GRID_PLAYGROUNDS: { [key: string]: GridPlayground } = {
  simple: {
    label: 'Simple grid',
    grid: {
      areas: [
        {
          key: 'id',
          text: '`#$.id`'
        },
        {
          key: 'name',
          text: '`$.firstName $.lastName`'
        }
      ],
      template: [
        [
          'id'
        ],
        [
          'name',
          '=',
          '='
        ]
      ]
    },
    target: {
      id: 1,
      firstName: 'Bernice',
      lastName: 'Sperring',
      email: 'bsperring0@reddit.com',
      gender: 'Female',
      ipAddress: '113.72.188.91'
    }
  }
};
