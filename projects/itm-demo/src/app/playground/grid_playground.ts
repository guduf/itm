import { ItmControl } from '../../../../itm-core/src/public_api';
import { JsonPlaygroundView } from './json_playground.component';
import { GridPlaygroundViewComponent } from './grid_playground_view.component';

type GridJsonPlaygroundView = JsonPlaygroundView;

export const GRID_PLAYGROUND_VIEW: GridJsonPlaygroundView = {
  comp: GridPlaygroundViewComponent,
  playgrounds : {
    simple: {
      files: {
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
      }
    },
    control: {
      files: {
        grid: {
          areas: {
              control: [
              {
                key: 'id',
                label: '#ID',
                schema: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 999
                }
              },
              {
                key: 'firstName',
                label: 'First name',
                schema: {
                  type: 'string',
                  maxLength: 12
                }
              },
              {
                key: 'lastName',
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
    }
  }
};
