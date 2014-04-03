$(function() {

    "use strict";

    var JsonField = {

        /**
         * Variables
         *
         */

        id: '', // id of the wrapper
        name: '', // clean fieldname, without json or csv
        div: '', // the wrapper div
        parent: '', // jQuery .inputfield li
        input: '', // jQuery inputfield for JSON
        notes: '', // jQuery .notes
        desc: '', // text, csv description
        val: '', // inputfield value, raw data
        rows: 0, // Number of rows
        max: 0, // Maximum number of rows
        columns: 0, // Number of columns
        fixed_top: 1, // Fixed first row
        height: 0, // Max visible columns
        exists: null, // Does the inputfield exists
        data: null, // JSON data
        header: '', // Label title of the field
        width: 0, // width of the field


        /**
         * Functions
         *
         */

        // populate the values  
        setValue: function() {
            JsonField.id = $('.InputfieldJson div.handsontable');
            if (!JsonField.id.length) return false;
            JsonField.id = $('.InputfieldJson div.handsontable').attr('id');
            JsonField.name = JsonField.id.replace('table_', '');
            JsonField.div = $('#' + JsonField.id);
            JsonField.parent = JsonField.div.closest('.Inputfield');
            JsonField.rows = JsonField.div.data('rows');
            JsonField.max = JsonField.div.data('max');
            JsonField.columns = JsonField.div.data('columns');
            JsonField.fixed_top = JsonField.div.data('header');
            JsonField.height = JsonField.div.data('height');
            JsonField.input = $("input[name='" + JsonField.name + "_json']");
            JsonField.notes = JsonField.parent.find(".notes");
            JsonField.desc = JsonField.div.data('csv-description');;
            JsonField.val = JsonField.input.val();
            JsonField.header = $("#wrap_Inputfield_" + JsonField.name + " .InputfieldHeader").text();
            JsonField.width = JsonField.div.width();
            JsonField.exists = function() {
                return JsonField.div.length && JsonField.value ? true : false;
            };
            JsonField.data = JSON.parse(JsonField.val);
        },

        // source is one of the strings: "alter", "empty", "edit", "populateFromArray", "loadData", "autofill", "paste"
        setData: function(changes, source) {
            // no data setting if loaded
            if (source == 'loadData') return;

            var table = JsonField.div.handsontable('getInstance');
            JsonField.data = table.getData();

            if (!JsonField.data.length) {
                table.destroy();
                JsonField.input.val('[]');
                JsonField.parent.find(".description").remove();
                JsonField.notes.before("<p class='description csv'></p><textarea name='table_csv' rows='10' class='FieldtypeTextarea InputfieldMaxWidth'></textarea>");
                $(".description.csv").text(JsonField.desc);
                JsonField.notes.remove();
                JsonField.div.remove();
            } else {
                JsonField.input.val(JSON.stringify(table.getData()));
            }

        },

        updateNotes: function() {
            JsonField.rows = JsonField.div.handsontable('countRows'),
            JsonField.columns = JsonField.div.handsontable('countCols');
            JsonField.div.next(".notes").find(".rows").text(JsonField.rows);
            JsonField.div.next(".notes").find(".columns").text(JsonField.columns);
        },

        setHeight: function() {
            if (JsonField.rows >= JsonField.max) {
                var table = JsonField.div.handsontable('getInstance'),
                    options = {};
                options['height'] = (JsonField.height * 25) + 10;
                table.updateSettings(options);
            }
        },
        // handsontable
        table: function() {

            JsonField.div.handsontable({
                data: JsonField.data,
                outsideClickDeselects: true,
                stretchH: 'all',
                scrollH: 'auto',
                width: JsonField.width,
                autoWrapRow: true,
                contextMenu: true,
                fixedRowsTop: JsonField.fixed_top,
                maxRows: JsonField.max,
                height: function() {
                    if (JsonField.rows >= JsonField.height) {
                        return (JsonField.height * 25) + 10;
                    } else {
                        return (JsonField.rows * 25);
                    }
                },
                afterChange: function(changes, source) {
                    JsonField.setData(changes, source);
                },
                afterRemoveRow: function(index, amount) {
                    // index is an index of starter row.
                    // amount is an anount of removed rows.
                    JsonField.setData(index, amount);
                    JsonField.updateNotes();
                    JsonField.setHeight();
                },
                afterCreateRow: function(index, amount) {
                    // index represents the index of first newly created row in the data source array.
                    // amount number of newly created rows in the data source array.                    
                    JsonField.setData(index, amount);
                    JsonField.updateNotes();
                    JsonField.setHeight();
                },
                afterRemoveCol: function(changes, source) {
                    JsonField.setData(changes, source);
                    JsonField.updateNotes();
                    JsonField.setHeight();
                },
                afterCreateCol: function(changes, source) {
                    JsonField.setData(changes, source);
                    JsonField.updateNotes();
                    JsonField.setHeight();
                }
            });

            // Conditional settings
            var table = JsonField.div.handsontable('getInstance'),
                options = {};

            if (JsonField.div.data('minimum-columns')) {
                options['minCols'] = JsonField.div.data('minimum-columns');
            }

            if (JsonField.div.data('minimum-columns')) {
                options['maxCols'] = JsonField.div.data('maximum-columns');
            }

            options['fixedRowsTop'] = JsonField.fixed_top;
            table.updateSettings(options);

        },

        /**
         * Controller
         *
         */
        init: function() {
            if (JsonField.setValue() !== false) {
                JsonField.table();

                // visualize header row
                if (JsonField.div.data('header') == 1) {
                    JsonField.div.addClass('sticky');
                }
            }
        }
    };

    JsonField.init();

    // remove default description fron csv import
    if (!$('.InputfieldJson div.handsontable').length) {
        $(".InputfieldJson").find(".description").not(".csv").remove();
    }
});