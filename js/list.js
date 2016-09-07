"use strict";

// Demo
var GD = (function() {
    // Global Variables
    var _items = [];
    var _rows = null;

    // Saves the item form
    var btnSaveForm_Click = function() {
        var itemData = {};

        // Parse the form labels
        var labels = document.querySelectorAll("#itemForm .modal-body label");
        for(var i=0; i<labels.length; i++) {
            var objId = labels[i].getAttribute("for");
            var value = null;

            // Ensure the field name exists
            var fieldName = objId ? objId.replace("item_", "") : null;
            if(fieldName) {
                var objValue = document.querySelector("#" + objId);

                // Set the field value
                itemData[fieldName] = objValue ? objValue.value : null;
            }
        }

        // Add the item to the list
        (new $REST.List_Async("SPREST List Demo", false))
        .addItem(itemData)
        .done(function(item) {
            // Render this item
            renderRow(item);
        });

        // Close the form
        $("#itemForm").modal("hide");
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
                    // Wait for the the SP script to be loaded
                    ExecuteOrDelayUntilScriptLoaded(function() {
                        // Display the notification
                        SP.UI.Notify.addNotification("List not found, creating the list...", true);

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

                            // Display the notification
                            SP.UI.Notify.addNotification("List created successfully. Refresh the page.");
                        });
                    }, "core.js");
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

    // Initialize the demo
    var init = function() {
        // Render the list
        renderList();

        // Attach the button to their click events
        document.querySelector("#btnSaveForm").addEventListener("click", btnSaveForm_Click);
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
    var renderRow = function(item) {
        // Define the row template
        var row =
`
<tr>
    <td style="width:150px">{{ID}}</td>
    <td>{{Title}}</td>
    <td>{{DemoChoice}}</td>
    <td>{{DemoNote}}</td>
</tr>
`;

        // Define the item fields
        var fields = ["ID", "DemoChoice", "DemoNote", "DemoUser", "Title"];

        // Parse the fields
        for(var i=0; i<fields.length; i++) {
            row = row.replace("{{" + fields[i] + "}}", item[fields[i]]);
        }

        // Append the row
        _rows.innerHTML += row;

        // Save a reference to this item
        _items.push(item);
    };

    // Public Interface
    return {
        init: init
    };
})();

// Initialize the demo
$(GD.init);
