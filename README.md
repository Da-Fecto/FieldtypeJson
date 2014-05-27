# FieldtypeJson & Inputfield


This Inputfield aims to be an easy way for editors to import CSV data and control the data within the admin. The Inputfield is made possible with the the awesome [Handsontable](http://handsontable.com/) (@warpech) an Excel-like data grid editor for HTML, JavaScript & jQuery. It's possible to skip the CSV part entirely and start direct with an empty table of data.

The fieldtype is always creating new CSV & JSON strings upon field change (Page save) and thus accessing the json or csv on runtime has no additional overhead.

## Settings for the Inputfield & Fieldtype

The settings are located in the settings of the inputfield !

#### Data Settings

Here you can set restrictions to the amount of rows & columns the dataset can have. The Fieldtype will cut all exceeding rows & columns of. These settings will be inheritted by the Inputfield as well. If the minimum & maximum columns are set to the same amount, the data will always have that amount of columns.

You can set the default **Delimiter** for import csv. The Inputfield inherits that delimiter and presets that in the delimiter select dropdown.

You can force the data to be **Numeric**. Checking Numeric, will also convert _European_ floats (12,34) to 12.34 thus making it ready for using it directly in javascript for example.

#### Inputfield Settings

These settings are for the behaviour of the Inputfield. The **Inputfield Height** will set the maximun amount of data rows for the Handsontable. **Sticky Row** will make the first row of data standout of the other rows. The sticky row will always be the first row shown and thus can be used as 'fake' header. This is ideal when you don't know the how many columns the imported CSV contains. Editors will recognize the first row as header. On template level when not rendering a table you can shift that row of.

If you know what data the editor is gonna use, you can add **Protected Column Headers**. These Headers are not editable by the editor and are not part of the data set.

Then you can optionaly check **Only Table**. This setting makes it possible to disable CSV import. If you don't use the CSV import part, you're likely better of with an other Inputfield.

#### Table Markup

Check **Table Header** if you want the default output render a table header. And for the HTML purist, you can set how the generated markup should look like.

## How to use

In the examples the fieldname 'fieldname' is used.

``` php
// (string) the table markup
$page->fieldname

// (string) JSON string
$page->fieldname->json

// (string) CSV string
$page->fieldname->csv

// (int) number of rows
$page->fieldname->rows

// (int) number of columns  
$page->fieldname->columns

/**
 * Saving data with the API
 *
 */

$json = '[["First Name","Last Name","Company Name","Address","City","State","Post","Phone","Email"],["Rebbecca","Diogo","Brandt, William F Esq","271 E 24th St","Lieth","TA","7315","03-8174-9123","mariko.didio@dodio.com.au"],["Stevie","Hallo","Landrum Temporary Services","22222 Acoma St","Priston","XT","4613","07-9937-3366","john.hallo@hotmail.com"],["Mariko","Stayer","Inabinet, Macre Esq","534 Schoenborn St #51","Tamel","Xv","6275","08-7257-9119","mariko_staynot@hotmail.com"]]';

$page->of(false);
$page->fieldname->json = $json;
$page->save();

// This will automagicly update the csv, rows and columns as well.

$csv = '"First Name","Last Name","Company Name",Address,City,State,Post,Phone,Email
Rebbecca,Diogo,"Brandt, William F Esq","271 E 24th St",Lieth,TA,7315,03-8174-9123,mariko.didio@dodio.com.au
Stevie,Hallo,"Landrum Temporary Services","22222 Acoma St",Priston,XT,4613,07-9937-3366,john.hallo@hotmail.com
Mariko,Stayer,"Inabinet, Macre Esq","534 Schoenborn St #51",Tamel,Xv,6275,08-7257-9119,mariko_staynot@hotmail.com';

$page->of(false);
$page->fieldname->csv = $csv;
$page->save();

// This will automagicly update the json, rows and columns as well.

```

## Where to use

* If you need a small set tabular json data, and you don't know how many columns it has.
* If you want to render tables quicky in your site.
* If the the site editors have their manage small sets of data in CSV

## Where NOT to use

* Store very large sets of data.
* If you have to rely rely on the data. ( all json is stored in a subfield, and the same for csv  )
* When the data needs to be query-able


### Special thanks to:
* **Marcin Warpechowski**, creator and maintainer of Handsontable
* **Raymond Geerts**, the CSV import part, originated from his idea)
* **Ryan Cramer**, Coding wizard ProcessWire
* All module developers.
