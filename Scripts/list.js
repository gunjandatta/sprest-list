"use strict";

// Demo
var GD = (function() {
    // Global Variables
    var _items = [];
    var _rows = null;

    // Method to create the list
    var createList = function() {
        // Wait for the the SP script to be loaded
        ExecuteOrDelayUntilScriptLoaded(function() {
            // Create the list
            (new $REST.Web_Async(false)).addList({
                BaseTemplate: 100,
                Title: "SPRESTListDemo"
            }).done(function(list) {
                var fields = [
                    /* Core Fields */
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F0112}" Name="ParentID" StaticName="ParentID" DisplayName="Parent ID" Type="Integer" JSLink="~site/Scripts/bravo.jslink.fields.js" />',

                    /* Main Fields */
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F0212}" Name="DemoChoice" StaticName="DemoChoice" DisplayName="Choice" Type="Choice"><CHOICES><CHOICE>1</CHOICE><CHOICE>2</CHOICE><CHOICE>3</CHOICE></CHOICES></Field>',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F1212}" Name="DemoNote" StaticName="DemoNote" DisplayName="Note" Type="Note" />',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F3212}" Name="DemoUser" StaticName="DemoUser" DisplayName="User" Type="User" />',

                    /* Child Fields */
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017207F0212}" Name="ChildChoice" StaticName="ChildChoice" DisplayName="Choice" Type="Choice"><CHOICES><CHOICE>A</CHOICE><CHOICE>B</CHOICE><CHOICE>C</CHOICE></CHOICES></Field>',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017207F1212}" Name="ChildNote" StaticName="ChildNote" DisplayName="Note" Type="Note" />',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017207F2212}" Name="ChildText" StaticName="ChildText" DisplayName="Text" Type="Text" />',
                ];

                // Update the title
                list.asyncFl = false;
                list.update({ Title: "SPREST List Demo"})

                // Parse the fields to add
                for(var i=0; i<fields.length; i++) {
                    // Add the fields
                    list.addFieldAsXml(fields[i]);
                }

                // Refresh the page
                document.location.reload();
            });
        }, "core.js");
    };

    // Method to show the form
    var formData = function() {
        var itemData = {};
        var getDataFl = typeof(arguments[0]) === "boolean" ? arguments[0] : false;
        var item = typeof(arguments[0]) === "number" ? _items[arguments[0]] : null;

        // Set the modal title if we are not getting data
        if(!getDataFl) {
            document.querySelector("#itemForm .modal-title").innerHTML = item ? item.ID + " - " + item.Title : "New Item";
        }

        // Parse the form labels
        var labels = document.querySelectorAll("#itemForm .modal-body label");
        for(var i=0; i<labels.length; i++) {
            var objId = labels[i].getAttribute("for");
            var value = null;

            // Ensure the field name exists
            var fieldName = objId ? objId.replace("item_", "") : null;
            if(fieldName) {
                var objValue = document.querySelector("#" + objId);

                // See if we are getting the data
                if(getDataFl) {
                    // Set the field value
                    itemData[fieldName] = objValue ? objValue.value : null;
                }
                // Ensure the object exists
                else if(objValue) {
                    // Set or clear the field value
                    objValue.value = item ? item[fieldName] : "";
                }
            }
        }

        // Show the form
        $("#itemForm").modal("show");

        // Return the item data
        return itemData;
    };

    // Method to get the list data
    var getListData = function() {
        var promise = new $REST.Promise();

        // Get the list data
        new $REST.ListItems_Async("SPREST List Demo", null, function(items) {
            // Ensure data exists
            if(items.existsFl) {
                // Resolve the promise
                promise.resolve(items);
            }
            else {
                // Ensure the list exists
                if(items.results == null) {
                    // Hide the header information
                    document.querySelector("#tblMain > thead").style.display = "none";

                    // Show a button to create the list
                    document.querySelector("#tblMain > tbody").innerHTML =
                        "<tr class='info'><td colspan='99'><button type='button' class='btn btn-info' onclick='GD.createList();'>Create the List</button></td></tr>";
                }
                else {
                    // Show the empty list message
                    document.querySelector("#tblMain > tbody").innerHTML =
                        "<tr class='warning'><td colspan='99'>No data exists for this list...</td></tr>";
                }
            }
        });

        // Return the promise
        return promise;
    };

    // Method to render the list
    var renderList = function() {
        // Clear the table
        _rows = document.querySelector("#tblMain > tbody")
        _rows.innerHTML = "";

        // Get the list data
        getListData().done(function(items) {
            // Parse the items
            for(var i=0; i<items.results.length; i++) {
                // Render the row
                renderRow(items.results[i]);
            }
        });
    };

    // Method to render a row
    var renderRow = function(item, updateFl) {
        // Define the row template
        var row = updateFl ? _rows.querySelector("#item_" + item.ID) :
`
<tr id="item_{{ID}}">
    <td style="width:150px"><button type="button" class="btn btn-primary" onclick="GD.editItem({{ID}});">Edit</button></td>
    <td data-fieldname="Title">{{Title}}</td>
    <td data-fieldname="DemoChoice">{{DemoChoice}}</td>
    <td data-fieldname="DemoNote">{{DemoNote}}</td>
</tr>
`;

        // Define the item fields
        var fields = ["DemoChoice", "DemoNote", "DemoUser", "Title"];

        // Parse the fields
        for(var i=0; i<fields.length; i++) {
            // See if we are updating the row
            if(updateFl) {
                var col = row.querySelector("td[data-fieldname='" + fields[i] + "']");
                if(col) {
                    // Update the value
                    col.innerHTML = item[fields[i]];
                }
            }
            else {
                // Replace the value in the template
                row = row.replace("{{" + fields[i] + "}}", item[fields[i]]);
            }
        }

        // See if this is a new row
        if(!updateFl) {
            // Replace the ID
            row = row.replace(/{{ID}}/g, item.ID);

            // Clear the empty message if it exists
            _rows.innerHTML = _items.length == 0 ? "" : _rows.innerHTML;

            // Append the row
            _rows.innerHTML += row;
        }

        // Save a reference to this item
        _items[item.ID] = item;
    };

    // Method to save the form.
    var saveForm = function() {
        var item = _items[document.querySelector("#itemForm .modal-title").innerHTML.split(" - ")[0]];

        // See if we are updating an item
        if(item) {
            // Get the form data
            var itemData = formData(true);

            // Update the item
            item.update(itemData)
            // Execute after the update
            .done(function() {
                // Update the item
                for(var key in itemData) {
                    // Ensure this is a field
                    if(item[key]) {
                        // Update the value
                        item[key] = itemData[key];
                    }
                }

                // Render this item
                renderRow(item, true);
            });
        }
        else {
            // Get the list
            (new $REST.List_Async("SPREST List Demo", false))
            // Add the item to the list
            .addItem(formData(true))
            // Execute after the update
            .done(function(item) {
                // Render this item
                renderRow(item);
            });
        }

        // Close the form
        $("#itemForm").modal("hide");
    };

    // Public Interface
    return {
        createList: createList,
        editItem: formData,
        renderList: renderList,
        newItem: formData,
        saveItem: saveForm
    };
})();

// Initialize the demo
$(GD.renderList);
