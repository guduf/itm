import { ItmGrid, ItmControl } from '../../../../itm-core/src/public_api';

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
            type: 'string',
            label: '#ID'
          },
          {
            key: 'firstName',
            type: 'string',
            label: 'First name'
          },
          {
            key: 'lastName',
            type: 'string',
            label: 'Last name'
          }
        ] as ItmControl.Config[]
      },
      template: [
        [
          'control:id'
        ],
        [
          'control:firstName',
          '=',
          '=',
          'control:lastName',
          '=',
          '='
        ]
      ]
    },
    target: {
      id: 2,
      firstName: 'Mark',
      lastName: 'Kingsberg'
    }
  }
};
