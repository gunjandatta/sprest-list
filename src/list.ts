"use strict";

// Demo
module Demo {
    // GD Class
    export class GD {
        /**
         * Global Variables
         */

        /** The list items */
        private _items: Array<$REST.ListItem> = [];

        /** The table rows */
        private _rows: any;

        /**
         * Public Methods
         */

        /**
         * Method to create the list
         */
        public createList() {
            // Create the list, but don't execute a request to the server
            (new $REST.Web_Async(false))
            // Create a new list
            .addList({
                BaseTemplate: 100,
                Title: "SPRESTListDemo"
            }).done(function(list) {
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
                list.update({ Title: "SPREST List Demo"})

                // Parse the fields to add
                for(let i=0; i<fields.length; i++) {
                    // Add the fields
                    list.addFieldAsXml(fields[i]);
                }

                // Refresh the page
                document.location.reload();
            });
        }

        /**
         * Method to edit an item.
         */
        public editItem(itemId) { this.formData(itemId); }

        /**
         * Method to create a new item.
         */
        public newItem() { this.formData(); }

        /**
         * Method to render the list.
         */
        public renderList() {
            // Clear the table
            this._rows = document.querySelector("#tblMain > tbody");
            this._rows.innerHTML = "";

            // Get the list data
            this.getListData().done((items:$REST.ListItems) => {
                // Parse the items
                for(var i=0; i<items.results.length; i++) {
                    // Render the row
                    this.renderRow(items.results[i]);
                }
            });
        };

        /**
         * Method to save an item.
         */
        public saveItem() { this.saveForm(); }

        /**
         * Private Methods
         */

        /**
         * Method to show the form
         */
        private formData(option?:any) {
            let itemData = {};
            let item = typeof(option) === "number" ? this._items[option] : null;
            let getDataFl = typeof(option) === "boolean" ? option : false;

            // Set the modal title if we are not getting data
            if(!getDataFl) {
                document.querySelector("#itemForm .modal-title").innerHTML = item ? item["Id"] + " - " + item["Title"] : "New Item";
            }

            // Parse the form labels
            let labels = document.querySelectorAll("#itemForm .modal-body label");
            for(let i=0; i<labels.length; i++) {
                let objId = labels[i].getAttribute("for");
                let value = null;

                // Ensure the field name exists
                let fieldName = objId ? objId.replace("item_", "") : null;
                if(fieldName) {
                    let objValue = document.querySelector("#" + objId);

                    // See if we are getting the data
                    if(getDataFl) {
                        // Set the field value
                        itemData[fieldName] = objValue ? objValue["value"] : null;
                    }
                    // Ensure the object exists
                    else if(objValue) {
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

        /**
         * Method to get the list data
         */
        private getListData() {
            let promise = $.Deferred();

            // Get the list data
            new $REST.ListItems_Async("SPREST List Demo", null, function(items:$REST.ListItems) {
                // Ensure data exists
                if(items.existsFl) {
                    // Resolve the promise
                    promise.resolve(items);
                }
                else {
                    // Ensure the list exists
                    if(items.results == null) {
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

        /**
         * Method to render a row.
         */
        private renderRow(item:$REST.ListItem, updateFl?:boolean) {
            // Define the row template
            let row = updateFl ? this._rows.querySelector("#item_" + item.Id) :
`
<tr id="item_{{ID}}">
    <td style="width:150px"><button type="button" class="btn btn-primary" onclick="GD.editItem({{ID}});">Edit</button></td>
    <td data-fieldname="Title">{{Title}}</td>
    <td data-fieldname="DemoChoice">{{DemoChoice}}</td>
    <td data-fieldname="DemoNote">{{DemoNote}}</td>
</tr>
`;

            // Define the item fields
            let fields = ["DemoChoice", "DemoNote", "DemoUser", "Title"];

            // Parse the fields
            for(let i=0; i<fields.length; i++) {
                // See if we are updating the row
                if(updateFl) {
                    let col = row.querySelector("td[data-fieldname='" + fields[i] + "']");
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
                row = row.replace(/{{ID}}/g, item.Id);

                // Clear the empty message if it exists
                this._rows.innerHTML = this._items.length == 0 ? "" : this._rows.innerHTML;

                // Append the row
                this._rows.innerHTML += row;
            }

            // Save a reference to this item
            this._items[item.Id] = item;
        };

        // Method to save the form.
        private saveForm() {
            let itemId = document.querySelector("#itemForm .modal-title").innerHTML.split(" - ")[0];
            let item:$REST.ListItem = itemId == "New Item" ? null : this._items[itemId];

            // See if we are updating an item
            if(item) {
                // Get the form data
                let itemData = this.formData(true);

                // Update the item
                item.update(itemData)
                // Execute after the update
                .done(() => {
                    // Update the item
                    for(let key in itemData) {
                        // Ensure this is a field
                        if(item.hasOwnProperty(key)) {
                            // Update the value
                            item[key] = itemData[key];
                        }
                    }

                    // Render this item
                    this.renderRow(item, true);
                });
            }
            else {
                // Get the list
                (new $REST.List_Async("SPREST List Demo", false))
                // Add the item to the list
                .addItem(this.formData(true))
                // Execute after the update
                .done((item:$REST.ListItem) => { this.renderRow(item); });
            }

            // Close the form
            $("#itemForm")["modal"]("hide");
        };
    }
}

// Initialize the demo
var GD = new Demo.GD();
GD.renderList();