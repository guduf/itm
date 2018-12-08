import { ItmTable } from '../../../../itm-core/src/public_api';
import { JsonPlaygroundView } from './json_playground.component';
import { TablePlaygroundViewComponent } from './table_playground_view.component';

export interface TableJsonPlaygroundFiles {
  table: ItmTable.Config;
  targets: Object[];
}

// tslint:disable-next-line:max-line-length
export type TableJsonPlaygroundView = JsonPlaygroundView<TableJsonPlaygroundFiles>;

export const TABLE_PLAYGROUND_VIEW: TableJsonPlaygroundView = {
    playgrounds: {
      simple: {
        files: {
          table: {
            template: [
              [
                'id'
              ]
            ],
            areas: {
              control: [{key: 'id'}]
            }
          },
          targets: [
            {id: 63}
          ]
        }
      }
    },
    comp: TablePlaygroundViewComponent
  };
