$(function () {

    "use strict";

    var JsonField = {

        // id of the handson wrapper
        id: '',
        // fieldname, without json or csv
        name: '',
        // the wrapper div
        div: '',
        // jQuery .inputfield li
        parent: '',
        // jQuery inputfield for JSON
        input: '',
        // jQuery textarea for CSV
        textarea: '',
        // jQuery .notes
        notes: '',
        // inputfield value, raw data
        val: '',
        // number of rows
        rows: 0,
        // number of columns
        columns: 0,
        // min / max
        cols: {
            min: 0,
            max: 0
        },
        // max number of rows
        max_rows: 0,
        // fixed first row
        fixed_top: 1,
        // hight in rows
        height: 0,
        // extra height if protected header is rendered
        header_height: 0,
        // column headers
        col_headers: null,
        // does the inputfield exists
        exists: null,
        // JSON data
        data: null,
        // label title of the field
        header: '',
        // no CSV import
        no_import: 0,
        // width of the field
        width: 0,
        // containers
        containers: {
            json: null,
            csv: null
        },
        // option for handson
        options: {},
        // full contextMenu
        contextMenu: ["row_above", "row_below", "hsep1", "col_left", "col_right", "hsep2", "remove_row", "remove_col", "hsep3", "undo", "redo"],
        // temperary
        tempMenu: [],

        // populate the values
        setValues: function () {
            JsonField.id = $('.InputfieldJson div.handsontable');
            if (!JsonField.id.length) return false;
            JsonField.id = $('.InputfieldJson div.handsontable').attr('id');
            JsonField.name = JsonField.id.replace('table_', '');
            JsonField.div = $('#' + JsonField.id);
            JsonField.parent = JsonField.div.closest('.Inputfield');
            JsonField.rows = JsonField.div.data('rows');
            JsonField.max_rows = JsonField.div.data('max');
            JsonField.columns = JsonField.div.data('columns');
            JsonField.fixed_top = JsonField.div.data('header');
            JsonField.height = JsonField.div.data('height');
            JsonField.no_import = JsonField.div.data('only-json');
            JsonField.col_headers = JsonField.div.data('column-headers');
            JsonField.cols.min = JsonField.div.data('minimum-columns');
            JsonField.cols.max = JsonField.div.data('maximum-columns');
            JsonField.input = $("input[name='" + JsonField.name + "_json']");
            JsonField.textarea = $("textarea[name='" + JsonField.name + "_csv']");
            JsonField.notes = JsonField.parent.find(".notes");
            JsonField.val = JsonField.input.val();
            JsonField.header = $("#wrap_Inputfield_" + JsonField.name + " .InputfieldHeader").text();
            JsonField.width = JsonField.div.width();
            JsonField.containers.json = $("#" + JsonField.name + "_json_container");
            JsonField.containers.csv = $("#" + JsonField.name + "_csv_container");
            JsonField.data = JSON.parse(JsonField.val);
            JsonField.exists = function () {
                return JsonField.div.length && JsonField.value ? true : false;
            };
        },

        // source is one of the strings: "alter", "empty", "edit", "populateFromArray", "loadData", "autofill", "paste"
        setData: function (index, amount) {

            var table = JsonField.div.handsontable('getInstance');
            JsonField.rows = JsonField.div.handsontable('countRows'),
            JsonField.columns = JsonField.div.handsontable('countCols');
            JsonField.tempMenu = JsonField.contextMenu;

            // conditionals
            if (JsonField.col_headers) {
                JsonField.options['colHeaders'] = JsonField.col_headers;
                JsonField.tempMenu = ["row_above", "row_below", "hsep1", "remove_row", "hsep3", "undo", "redo"];
            }

            if (JsonField.cols.min) {
                JsonField.options['minCols'] = JsonField.cols.min;
            }

            if (JsonField.cols.max) {
                JsonField.options['maxCols'] = JsonField.cols.max;
            }

            if (JsonField.no_import) {
                JsonField.options['minRows'] = 1;
                if (JsonField.rows === 1) {
                    JsonField.tempMenu = ["row_above", "row_below", "hsep1", "col_left", "col_right", "hsep3", "undo", "redo"];
                    $(".notes .delete").css({
                        display: 'none'
                    });
                } else {
                    $(".notes .delete").css({
                        display: 'inline'
                    });
                }
            }

            JsonField.options['contextMenu'] = JsonField.tempMenu;

            if ((!JsonField.rows || !JsonField.columns) && !JsonField.no_import) {
                $(".InputfieldJson .InputfieldContent > .description").slideUp("slow");
                JsonField.input.val('');
                JsonField.input.prop('disabled', 'disabled');
                JsonField.containers.json.slideUp("slow");
                JsonField.textarea.val('');
                JsonField.textarea.prop("disabled", false);
                JsonField.containers.csv.slideDown("slow");
                table.updateSettings({
                    data: [[]]
                });
                table.destroy();
            } else {
                JsonField.data = table.getData();
                JsonField.input.val(JSON.stringify(JsonField.data));
                table.updateSettings(JsonField.options);
                return true;
            }

        },

        updateNotes: function () {
            JsonField.div.next(".notes").find(".rows").text(JsonField.rows);
            JsonField.div.next(".notes").find(".columns").text(JsonField.columns);
        },

        setHeight: function () {
            var table = JsonField.div.handsontable('getInstance'),
                options = {};
            if (JsonField.rows > JsonField.max_rows) {
                options['height'] = (JsonField.height * 25) + JsonField.header_height + 10;
            }
            table.updateSettings(options);
        },

        // handsontable
        table: function () {
            JsonField.div.handsontable({
                data: JsonField.data,
                outsideClickDeselects: true,
                stretchH: 'all',
                scrollH: 'auto',
                width: JsonField.width,
                autoWrapRow: true,
                contextMenu: true,
                fixedRowsTop: JsonField.fixed_top,
                maxRows: JsonField.max_rows,
                variableRowHeights: false,
                height: function () {
                    if (JsonField.div.data('column-headers')) {
                        JsonField.header_height = 25;
                    }

                    if (JsonField.rows >= JsonField.height) {
                        // JsonField.notes.css({
                        //     paddingTop: 10
                        // });
                        return (JsonField.height * 25);
                    } else {
                        // JsonField.notes.css({
                        //     paddingTop: 0
                        // });
                        return (JsonField.rows * 25) + JsonField.header_height;
                    }
                },
                afterChange: function (changes, source) {
                    JsonField.setData(changes, source);
                },
                afterRemoveRow: function (index, amount) {
                    // index is an index of start row.
                    // amount is an amount of removed rows.
                    JsonField.exists = JsonField.setData(index, amount);
                    if (JsonField.exists) {
                        JsonField.setHeight();
                        JsonField.updateNotes();
                    }
                },
                afterCreateRow: function (index, amount) {
                    // index is an index of start row.
                    // amount is an amount of newly created rows.
                    JsonField.exists = JsonField.setData(index, amount);
                    if (JsonField.exists) {
                        JsonField.setHeight();
                        JsonField.updateNotes();
                    }
                },
                afterRemoveCol: function (index, amount) {
                    // index is an index of start column.
                    // amount is an amount of removed columns.
                    JsonField.exists = JsonField.setData(index, amount);
                    if (JsonField.exists) {
                        JsonField.setHeight();
                        JsonField.updateNotes();
                    }
                },
                afterCreateCol: function (index, amount) {
                    // index is an index of start column.
                    // amount is an amount of created columns.
                    JsonField.exists = JsonField.setData(index, amount);
                    if (JsonField.exists) {
                        JsonField.setHeight();
                        JsonField.updateNotes();
                    }
                }
            });
        },

        /**
         * Controller
         *
         */
        init: function () {
            if (JsonField.setValues() !== false) {

                JsonField.table();
                JsonField.setData('initialize', null);

                // visualize header row
                if (JsonField.div.data('header') == 1) {
                    JsonField.div.addClass('sticky');
                }
            }
        }
    };

    JsonField.init();

    // redraw when in tab
    $(".WireTabs a").on('click', function() {
        JsonField.init();
    });

    // remove default description from csv import
    if (!$('.InputfieldJson div.handsontable').length) {
        $(".InputfieldJson").find(".description").not(".csv").remove();
    }

    $(".tooltip").tooltip({
        tooltipClass: "ui-tooltip anti-aliased",
        position: {
            my: "center bottom-20",
            at: "center top",
            using: function (position, feedback) {
                $(this).css(position);
                $("<div>")
                    .addClass("arrow anti-aliased")
                    .addClass(feedback.vertical)
                    .addClass(feedback.horizontal)
                    .appendTo(this);
            }
        }
    });



    $(".superuser").tooltip($(".tooltip").tooltip("option"));
    $(".superuser").tooltip({
        content: function () {
            var array = $(this).attr('title').split(','),
                string = '';
            $.each(array, function (index, element) {
                string += element + "<br>";
            });
            return string;
        }
    });

    $(".tooltip").tooltip();

    // delete table
    $('.delete-popup').dialog({
        // prevent annoying jump bug
        open: function (event, ui) {
            $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close').hide();
        },
        show: {
            effect: "puff",
            duration: 150
        },
        autoOpen: false,
        // dialogClass: "no-close",
        title: "Delete all rows from " + JsonField.header + "?",
        width: 400,
        position: {
            my: "center",
            at: "center",
            of: window
        },
        modal: true,
        buttons: {
            Cancel: function () {
                $(this).find("input").val('');
                $(this).dialog("close");
            },
            Delete: function () {
                delete_rows();
            }
        }
    });

    $(".InputfieldJson .delete").click(function () {
        $(".delete-popup").dialog("open");
        $(".ui-widget-overlay").click(function () {
            $(".delete-popup").dialog("close");
        });
    });

    // press return/enter confirm
    $(".delete-popup").keyup(function (event) {
        if (event.keyCode == 13) {
            $(".ui-dialog-buttonset button").eq(1).click();
        }
    });



    function delete_rows() {
        $(".delete-popup").dialog("close");
        if ($(".delete-popup input").val() === 'DELETE') {
            if (JsonField.no_import) {
                JsonField.div.handsontable('alter', 'remove_row', 1, JsonField.rows);
                JsonField.div.handsontable('alter', 'insert_row');
                JsonField.div.handsontable('alter', 'remove_row', 0);
            } else {
                JsonField.div.handsontable('alter', 'remove_row', 0, JsonField.rows);
            }
        }
    }


});
