"use strict";
// Demo
var Demo;
(function (Demo) {
    // GD Class
    var GD = (function () {
        function GD() {
            /**
             * Global Variables
             */
            /** The list items */
            this._items = [];
        }
        /**
         * Public Methods
         */
        /**
         * Method to create the list
         */
        GD.prototype.createList = function () {
            // Create the list, but don't execute a request to the server
            (new $REST.Web_Async(false))
                .addList({
                BaseTemplate: 100,
                Title: "SPRESTListDemo"
            }).done(function (list) {
                var fields = [
                    // TO DO - Implement the parent/child relation, similar to the previous version using the old library
                    /* Core Fields */
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F0112}" Name="ParentID" StaticName="ParentID" DisplayName="Parent ID" Type="Integer" JSLink="~site/Scripts/jslink.fields.js" />',
                    /* Main Fields */
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F0212}" Name="DemoChoice" StaticName="DemoChoice" DisplayName="Choice" Type="Choice"><CHOICES><CHOICE>1</CHOICE><CHOICE>2</CHOICE><CHOICE>3</CHOICE></CHOICES></Field>',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F1212}" Name="DemoNote" StaticName="DemoNote" DisplayName="Note" Type="Note" />',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017205F3212}" Name="DemoUser" StaticName="DemoUser" DisplayName="User" Type="User" />',
                    /* Child Fields */
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017207F0212}" Name="ChildChoice" StaticName="ChildChoice" DisplayName="Choice" Type="Choice"><CHOICES><CHOICE>A</CHOICE><CHOICE>B</CHOICE><CHOICE>C</CHOICE></CHOICES></Field>',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017207F1212}" Name="ChildNote" StaticName="ChildNote" DisplayName="Note" Type="Note" />',
                    '<Field ID="{AA3AF8EA-2D8D-4345-8BD9-6017207F2212}" Name="ChildText" StaticName="ChildText" DisplayName="Text" Type="Text" />',
                ];
                // Disable asynchronous requests
                list.asyncFl = false;
                // Update the title
                list.update({ Title: "SPREST List Demo" });
                // Parse the fields to add
                for (var i = 0; i < fields.length; i++) {
                    // Add the fields
                    list.addFieldAsXml(fields[i]);
                }
                // Refresh the page
                document.location.reload();
            });
        };
        /**
         * Method to edit an item.
         */
        GD.prototype.editItem = function () { this.formData(); };
        /**
         * Method to create a new item.
         */
        GD.prototype.newItem = function () { this.formData(); };
        /**
         * Method to render the list.
         */
        GD.prototype.renderList = function () {
            var _this = this;
            // Clear the table
            this._rows = document.querySelector("#tblMain > tbody");
            this._rows.innerHTML = "";
            // Get the list data
            this.getListData().done(function (items) {
                // Parse the items
                for (var i = 0; i < items.results.length; i++) {
                    // Render the row
                    _this.renderRow(items.results[i]);
                }
            });
        };
        ;
        /**
         * Method to save an item.
         */
        GD.prototype.saveItem = function () { this.saveForm(); };
        /**
         * Private Methods
         */
        /**
         * Method to show the form
         */
        GD.prototype.formData = function (getDataFl) {
            if (getDataFl === void 0) { getDataFl = false; }
            var itemData = {};
            var item = null;
            // Set the modal title if we are not getting data
            if (!getDataFl) {
                document.querySelector("#itemForm .modal-title").innerHTML = item ? item["Id"] + " - " + item["Title"] : "New Item";
            }
            // Parse the form labels
            var labels = document.querySelectorAll("#itemForm .modal-body label");
            for (var i = 0; i < labels.length; i++) {
                var objId = labels[i].getAttribute("for");
                var value = null;
                // Ensure the field name exists
                var fieldName = objId ? objId.replace("item_", "") : null;
                if (fieldName) {
                    var objValue = document.querySelector("#" + objId);
                    // See if we are getting the data
                    if (getDataFl) {
                        // Set the field value
                        itemData[fieldName] = objValue ? objValue["value"] : null;
                    }
                    else if (objValue) {
                        // Set or clear the field value
                        objValue["value"] = item ? item[fieldName] : "";
                    }
                }
            }
            // Show the form
            $("#itemForm")["modal"]("show");
            // Return the item data
            return itemData;
        };
        ;
        /**
         * Method to get the list data
         */
        GD.prototype.getListData = function () {
            var promise = $.Deferred();
            // Get the list data
            new $REST.ListItems_Async("SPREST List Demo", null, function (items) {
                // Ensure data exists
                if (items.existsFl) {
                    // Resolve the promise
                    promise.resolve(items);
                }
                else {
                    // Ensure the list exists
                    if (items.results == null) {
                        // Hide the header information
                        document.querySelector("#tblMain > thead")["style"].display = "none";
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
        ;
        /**
         * Method to render a row.
         */
        GD.prototype.renderRow = function (item, updateFl) {
            // Define the row template
            var row = updateFl ? this._rows.querySelector("#item_" + item.Id) :
                "\n<tr id=\"item_{{ID}}\">\n    <td style=\"width:150px\"><button type=\"button\" class=\"btn btn-primary\" onclick=\"GD.editItem({{ID}});\">Edit</button></td>\n    <td data-fieldname=\"Title\">{{Title}}</td>\n    <td data-fieldname=\"DemoChoice\">{{DemoChoice}}</td>\n    <td data-fieldname=\"DemoNote\">{{DemoNote}}</td>\n</tr>\n";
            // Define the item fields
            var fields = ["DemoChoice", "DemoNote", "DemoUser", "Title"];
            // Parse the fields
            for (var i = 0; i < fields.length; i++) {
                // See if we are updating the row
                if (updateFl) {
                    var col = row.querySelector("td[data-fieldname='" + fields[i] + "']");
                    if (col) {
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
            if (!updateFl) {
                // Replace the ID
                row = row.replace(/{{ID}}/g, item.Id);
                // Clear the empty message if it exists
                this._rows.innerHTML = this._items.length == 0 ? "" : this._rows.innerHTML;
                // Append the row
                this._rows.innerHTML += row;
            }
            // Save a reference to this item
            this._items[item.Id] = item;
        };
        ;
        // Method to save the form.
        GD.prototype.saveForm = function () {
            var _this = this;
            var itemId = document.querySelector("#itemForm .modal-title").innerHTML.split(" - ")[0];
            var item = itemId == "New Item" ? null : this._items[itemId];
            // See if we are updating an item
            if (item) {
                // Get the form data
                var itemData_1 = this.formData(true);
                // Update the item
                item.update(itemData_1)
                    .done(function () {
                    // Update the item
                    for (var key in itemData_1) {
                        // Ensure this is a field
                        if (item[key]) {
                            // Update the value
                            item[key] = itemData_1[key];
                        }
                    }
                    // Render this item
                    _this.renderRow(item, true);
                });
            }
            else {
                // Get the list
                (new $REST.List_Async("SPREST List Demo", false))
                    .addItem(this.formData(true))
                    .done(function (item) { _this.renderRow(item); });
            }
            // Close the form
            $("#itemForm")["modal"]("hide");
        };
        ;
        return GD;
    }());
    Demo.GD = GD;
})(Demo || (Demo = {}));
// Initialize the demo
var GD = new Demo.GD();
GD.renderList();
