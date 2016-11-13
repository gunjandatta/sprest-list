module GD {
    /****************************************************
     * Dashboard Code Behind
     ****************************************************/
    export class Dashboard {
        /**********************************************************************
         * Form
         *********************************************************************/

        // Form Elements
        private static allItemsTable: GD.Table;
        private static editItemPanel: GD.EditItemPanel;
        private static myItemsTable: GD.Table;
        private static newItemDialog: GD.NewItemDialog;
        private static notesPanel: GD.ViewNotesPanel;
        private static viewItemPanel: GD.ViewItemPanel;

        // Panel & Dialog Methods
        static showEditItemPanel(itemId) { this.editItemPanel.show(this._items[itemId]); return false; }
        static showNewItemDialog() { this.newItemDialog.open(); return false; }
        static showNotesPanel(itemId) { this.notesPanel.show(this._items[itemId]); return false; }
        static showViewItemPanel(itemId) { this.viewItemPanel.show(this._items[itemId]); return false; }

        /****************************************************
         * Public Interface
         ****************************************************/

        // Method to add an item to the table
        static addItem(itemId) {
            // Get the rows containing this item
            let rows: any = document.querySelectorAll("tr[data-item-id='" + itemId + "']");
            for (let row of rows) {
                // Remove this row
                row.parentElement.removeChild(row);
            }

            // Copy the query, and set the filter
            let query = Object.create(this._query);
            query.Filter = "Id eq " + itemId;

            // Get the list
            (new $REST.List("Demo"))
                // Get the item collection
                .Items()
                // Query for the item
                .query(query)
                // Execute the request
                .execute((item) => {
                    // Save a reference to this item
                    this._items[item.Id] = item;

                    // Add the item to the tables
                    this.addItemToTables(item);

                    // Close the dialog
                    window["SP"].UI.ModalDialog.commonModalDialogClose();
                });
        }

        // Method to create an item
        static createItem() {
            // Show the waiting panel
            window["SP"].UI.ModalDialog.showWaitScreenWithNoClose("Creating the Item");

            // Create the item
            this.newItemDialog.save();
        }

        // Method to initialize the dashboard
        static init() {
            // Initialize the office fabric components
            // Parse the class types
            let classTypes = ["CommandBar", "MessageBar", "Pivot"];
            for (let classType of classTypes) {
                // Query for all pivot elements
                let elements = <any>document.querySelectorAll(".ms-" + classType);

                // Parse the pivot elements
                for (let element of elements) {
                    // Initialize the element
                    element["fabric"] = new window["fabric"][classType](element);
                }
            }

            // Create the dashboard components
            this.allItemsTable = new GD.Table("allItemsPanel");
            this.editItemPanel = new GD.EditItemPanel();
            this.myItemsTable = new GD.Table("myItemsPanel");
            this.newItemDialog = new GD.NewItemDialog();
            this.notesPanel = new GD.ViewNotesPanel();
            this.viewItemPanel = new GD.ViewItemPanel();

            // Render the tables
            this.renderTables();
        }

        // Method to save the item
        static saveItem(itemId) {
            // Show the waiting panel
            window["SP"].UI.ModalDialog.showWaitScreenWithNoClose("Updating the Item");

            // Save the item
            this.editItemPanel.save(this._items[itemId]);
        }

        /****************************************************
         * Private Interface
         ****************************************************/

        // Items
        private static _items: Array<any> = [];

        // Item Query
        private static _query: $REST.Settings.ODataSettings = {
            Select: ["Id", "Title", "GDType", "GDOwner/Id", "GDOwner/Title", "GDNotes"],
            Expand: ["GDOwner"],
            OrderBy: ["GDType", "Title"]
        };

        // Method to add the item to the tables
        private static addItemToTables(item: $REST.Types.IListItem) {
            let owner = item["GDOwner"] ? item["GDOwner"].Id : null;

            // Add the item to the 'All Items' table
            this.allItemsTable.addRow(item);

            // See if this is current user's item
            if (owner == window["_spPageContextInfo"].userId) {
                // Add the item to their table
                this.myItemsTable.addRow(item);
            }
        }

        // Method to render the tables
        private static renderTables() {
            // Return the demo list
            return (new $REST.List("Demo"))
                // Item collection
                .Items()
                // Query for specified results
                .query(this._query)
                // Execute the query
                .execute((items: $REST.Types.IListItems) => {
                    // Parse the items
                    for (let item of items.results) {
                        // Save a reference to this item
                        this._items[item.Id] = item;

                        // Add the item to the tables
                        this.addItemToTables(item);
                    }
                });
        }
    }
}