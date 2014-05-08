FieldtypeJson & Inputfield
==========================
This Inputfield aims to be an easy way for editors to import CSV data and control the data within the admin. The Inputfield is made possible with the the awesome [Handsontable](http://handsontable.com/) an Excel-like data grid editor for HTML, JavaScript & jQuery. It's possible to skip the CSV part intirely and start directly with an empty table of data.

The fieldtype is always creating new CSV & JSON strings upon field change and thus accessing the json or csv on runtime doesn't have lot of overhead. 

### Behaviour of the Inputfield




### Behaviour of the Fieldtype

If “**Only Table**” is unchecked (by default) an empty textarea is presented to the editor. Under the textarea there's a select to let the editor select the delimiter to use for the CSV data. The default value of the select inherit the setting 