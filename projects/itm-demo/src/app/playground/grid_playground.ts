import { ItmGrid } from '../../../../itm-core/src/public_api';

export interface GridPlayground {
  grid: ItmGrid.Config;
  target: Object;
}

export const GRID_PLAYGROUNDS: { [key: string]: GridPlayground } = {
  simple: {
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
      lastName: 'Sperring'
    }
  },
  control: {
    grid: {
      areas: {
          control: [
          {
            key: 'id',
            text: '`#$.id`'
          },
          {
            key: 'name',
            text: '`$.firstName $.lastName`'
          }
        ]
      },
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
      lastName: 'Sperring'
    }
  }
};
