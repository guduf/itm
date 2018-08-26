/** The global config for the module */
export class ItmConfig {
  /** The component to create if not specified. Default: ItmDefaultCellComponent */
  defaultCellComp?: any;
  /** The header component to create if not specified. Default: ItmDefaultHeaderCellComponent */
  defaultHeaderCellComp?: any;
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
