/** The global config for the module */
export class ItmConfig {
  /** The component for text area if not specified. Default: ItmTextAreaComponent */
  defaultTextAreaComp?: any;
  /** The header component to create if not specified. Default: ItmHeaderCellComponent */
  defaultColumnHeaderComp?: any;
  /** The actions component to create if not specified. Default: ItmActionsCellComponent */
  defaultActionsAreaComp?: any;
  /**
   * The icon to display in the button of selection column when item is selected.
   * Default: 'check_box' */
  selectedCheckBoxIcon?: string;
  /**
   * The icon to display in the button of selection column when item is not selected.
   * Default: 'check_box_outline_blank' */
  unselectedCheckBoxIcon?: string;
  /**
   * The icon to display in the header button of selection column when some items are selected.
   * Default: 'indeterminate_check_box' */
  indeterminateCheckBoxIcon?: string;
}
