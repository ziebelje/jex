


/**
 * Creates a table with the chosen number of rows and columns. Makes it easy
 * and fast to create a table and offers a few functions for easily accessing
 * elements inside the table or appending rows/columns.
 *
 * @example
 * // Create a table with 0 rows and 0 columns.
 * var table = new jex.table();
 *
 * @example
 * // Create a table with four rows and 0 columns.
 * var table = new jex.table({'rows': 4});
 *
 * @example
 * // Create a table with four columns and 0 rows.
 * var table = new jex.table({'columns': 4});
 *
 * @example
 * // Create a table with four rows and two columns.
 * var table = new jex.table({'rows': 4, 'columns': 2});
 *
 * @example
 * // Create a table with four rows and two columns with the top row in a thead.
 * var table = new jex.table({'rows': 4, 'columns': 2, 'header': true});
 *
 * @example
 * // Create a table and then add a row to it, then add a row above that row.
 * var table = new jex.table();
 * table.add_row();
 * table.add_row(0);
 *
 * @constructor
 *
 * @param {{rows: number, columns: number, header: boolean}} options
 * <strong>rows</strong> - How many rows are in the table, including any header. Default 0.<br/>
 * <strong>columns</strong> - How many columns are in the table. Default 0.<br/>
 * <strong>header</strong> - Whether or not a thead is placed on the table. A thead counts as
 * one of your rows. Default false.
 */
jex.table = function(options) {
  var rows = options.rows || ((options.header === true) ? 1 : 0);
  this.columns_ = options.columns || 0;

  this.table_ = rocket.createElement('table');
  this.table_.setAttribute({
    'cellpadding': '0',
    'cellspacing': '0'
  });
  this.tbody_ = rocket.createElement('tbody');
  this.trs_ = [];
  this.tds_ = [];

  var tr;
  if (options.header === true) {
    // This is adding the first row, so subtract one from the row count to avoid
    // adding too many rows because the passed row count includes the header
    // row.
    rows--;

    this.thead_ = rocket.createElement('thead');
    tr = this.render_tr_('th');
    this.trs_.push(tr);
    this.thead_.appendChild(tr);
    this.table_.appendChild(this.thead_);
  }

  var tbody = rocket.createElement('tbody');
  for (var i = 0; i < rows; i++) {
    tr = this.render_tr_('td');
    this.trs_.push(tr);
    this.tbody_.appendChild(tr);
  }

  this.table_.appendChild(this.tbody_);
};


/**
 * The number of columns currently in the table.
 *
 * @type {number}
 */
jex.table.prototype.columns_;


/**
 * An array of all the trs in the table.
 *
 * @type {Array.<rocket.Elements>}
 */
jex.table.prototype.trs_;


/**
 * An array of arrays of all the tds in the table organized by row then column.
 *
 * @type {Array.<Array.<rocket.Elements>>}
 */
jex.table.prototype.tds_;


/**
 * Renders a tr with the number of columns specified on the table.
 *
 * @private
 *
 * @param {string} cell_type Either "th" or "td" depending on what type of row
 * this is.
 * @param {number=} opt_row_index The row to place these tds in. The placement
 * is important for the storage of this.tds_ so that it can be properly used
 * to place values.
 *
 * @return {rocket.Elements}
 */
jex.table.prototype.render_tr_ = function(cell_type, opt_row_index) {
  var row_index = opt_row_index || this.trs_.length;

  var tr = rocket.createElement('tr');
  var tds = [];
  var cell;
  for (var i = 0; i < this.columns_; i++) {
    cell = rocket.createElement(cell_type);
    tds.push(cell);
    tr.appendChild(cell);
  }
  this.tds_.splice(row_index, 0, tds);
  return tr;
};


/**
 * Fills a row in the table with the given data.
 *
 * @param {number} row_index The index of the row to fill in.
 * @param {Array.<string|rocket.Elements>} data The data to put in the row.
 * This can either be an array of strings or elements; they can be mixed.
 */
jex.table.prototype.fill_row = function(row_index, data) {
  var column = 0;
  var len = data.length;
  for (; column < len; column++) {
    if (jex.type(data[column]) === 'object') {
      // Allow placing of elements directly into the td.
      this.td(column, row_index).innerHTML('');
      this.td(column, row_index).appendChild(/** @type {rocket.Elements} */ (data[column]));
    }
    else {
      this.td(column, row_index).innerHTML(/** @type {string} */ (data[column]));
    }
  }
};


/**
 * Add a row to the table, either at the end or the position specified by
 * opt_row_index.
 *
 * @param {number=} opt_row_index Optional placement in the table, including
 * any header rows, 0-indexed. This will take that position and scoot
 * everything else below it. If ommitted, place the new row at the end.
 *
 * @return {number} The index of the row you just added. It will be
 * opt_row_index when provided, else the number of the rows in the table
 * (including headers) minus one.
 */
jex.table.prototype.add_row = function(opt_row_index) {
  var row_index = opt_row_index || this.trs_.length;
  var tr = this.render_tr_('td', opt_row_index);

  this.tbody_.insertBefore(tr, this.trs_[row_index]);
  this.trs_.splice(row_index, 0, tr);

  return row_index;
};


/**
 * Remove a specific row from the table specified by row_index.
 *
 * @param {number} row_index The row to remove, 0-indexed, beginning with the
 * header row as index 0.
 *
 * @return {number} The number of rows in the table (including headers) after
 * this adjustment.
 */
jex.table.prototype.remove_row = function(row_index) {
  this.trs_[row_index].parentNode().removeChild(this.trs_[row_index]);
  this.trs_.splice(row_index, 1);
  this.tds_.splice(row_index, 1);

  return this.trs_.length;
};


/**
 * Get the table element from this instance of the jex.table class.
 *
 * @return {rocket.Elements} The table element.
 */
jex.table.prototype.table = function() {
  return this.table_;
};


/**
 * Get the tbody element from this instance of the jex.table class.
 *
 * @return {rocket.Elements} The tbody element.
 */
jex.table.prototype.tbody = function() {
  return this.tbody_;
};


/**
 * Get the tr element at the specified index.
 *
 * @param {number} row_index The index of the row to fetch. Includes the
 * header row.
 *
 * @return {rocket.Elements} The tr element.
 */
jex.table.prototype.tr = function(row_index) {
  return this.trs_[row_index];
};


/**
 * Get the td element at the specified row/column index. The arguments
 * are ordered such that x and y both increment moving outward to the right
 * and down from the origin (top left).
 *
 * @param {number} column_index The index of the column the td is located in.
 * @param {number} row_index The index of the row the td is located in.
 * Includes the header row.
 *
 * @return {rocket.Elements} The td element.
 */
jex.table.prototype.td = function(column_index, row_index) {
  // The arguments get swapped because it's more convenient to store tds as they
  // get placed into the tr, which means they are organized somewhat counter-
  // intuitively.
  return this.tds_[row_index][column_index];
};
