var GD;
(function (GD) {
    /****************************************************
     * Dashboard Code Behind
     ****************************************************/
    var Dashboard = (function () {
        function Dashboard() {
        }
        // Panel & Dialog Methods
        Dashboard.showEditItemPanel = function (itemId) { this.editItemPanel.show(this._items[itemId]); return false; };
        Dashboard.showNewItemDialog = function () { this.newItemDialog.open(); return false; };
        Dashboard.showNotesPanel = function (itemId) { this.notesPanel.show(this._items[itemId]); return false; };
        Dashboard.showViewItemPanel = function (itemId) { this.viewItemPanel.show(this._items[itemId]); return false; };
        /****************************************************
         * Public Interface
         ****************************************************/
        // Method to add an item to the table
        Dashboard.addItem = function (itemId) {
            var _this = this;
            // Get the rows containing this item
            var rows = document.querySelectorAll("tr[data-item-id='" + itemId + "']");
            for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
                var row = rows_1[_i];
                // Remove this row
                row.parentElement.removeChild(row);
            }
            // Copy the query, and set the filter
            var query = Object.create(this._query);
            query.Filter = "Id eq " + itemId;
            // Get the list
            (new $REST.List("Demo"))
                .Items()
                .query(query)
                .execute(function (item) {
                // Save a reference to this item
                _this._items[item.Id] = item;
                // Add the item to the tables
                _this.addItemToTables(item);
                // Close the dialog
                window["SP"].UI.ModalDialog.commonModalDialogClose();
            });
        };
        // Method to create an item
        Dashboard.createItem = function () {
            // Show the waiting panel
            window["SP"].UI.ModalDialog.showWaitScreenWithNoClose("Creating the Item");
            // Create the item
            this.newItemDialog.save();
        };
        // Method to initialize the dashboard
        Dashboard.init = function () {
            // Initialize the office fabric components
            // Parse the class types
            var classTypes = ["CommandBar", "MessageBar", "Pivot"];
            for (var _i = 0, classTypes_1 = classTypes; _i < classTypes_1.length; _i++) {
                var classType = classTypes_1[_i];
                // Query for all pivot elements
                var elements = document.querySelectorAll(".ms-" + classType);
                // Parse the pivot elements
                for (var _a = 0, elements_1 = elements; _a < elements_1.length; _a++) {
                    var element = elements_1[_a];
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
        };
        // Method to save the item
        Dashboard.saveItem = function (itemId) {
            // Show the waiting panel
            window["SP"].UI.ModalDialog.showWaitScreenWithNoClose("Updating the Item");
            // Save the item
            this.editItemPanel.save(this._items[itemId]);
        };
        // Method to add the item to the tables
        Dashboard.addItemToTables = function (item) {
            var owner = item["GDOwner"] ? item["GDOwner"].Id : null;
            // Add the item to the 'All Items' table
            this.allItemsTable.addRow(item);
            // See if this is current user's item
            if (owner == window["_spPageContextInfo"].userId) {
                // Add the item to their table
                this.myItemsTable.addRow(item);
            }
        };
        // Method to render the tables
        Dashboard.renderTables = function () {
            var _this = this;
            // Return the demo list
            return (new $REST.List("Demo"))
                .Items()
                .query(this._query)
                .execute(function (items) {
                // Parse the items
                for (var _i = 0, _a = items.results; _i < _a.length; _i++) {
                    var item = _a[_i];
                    // Save a reference to this item
                    _this._items[item.Id] = item;
                    // Add the item to the tables
                    _this.addItemToTables(item);
                }
            });
        };
        /****************************************************
         * Private Interface
         ****************************************************/
        // Items
        Dashboard._items = [];
        // Item Query
        Dashboard._query = {
            Select: ["Id", "Title", "GDType", "GDOwner/Id", "GDOwner/Title", "GDNotes"],
            Expand: ["GDOwner"],
            OrderBy: ["GDType", "Title"]
        };
        return Dashboard;
    }());
    GD.Dashboard = Dashboard;
})(GD || (GD = {}));
var GD;
(function (GD) {
    /***************************************************************
     * Panel
     ***************************************************************/
    var NewItemDialog = (function () {
        /***************************************************************
         * Constructor
         ***************************************************************/
        function NewItemDialog() {
            // Create the dialog
            this.createDialog();
        }
        /***************************************************************
         * Public Interface
         ***************************************************************/
        // Close the dialog
        NewItemDialog.prototype.close = function () { this._dialog["fabric"].close(); };
        // Method to save the item
        NewItemDialog.prototype.save = function () { this.saveItem(); };
        // Open the dialog
        NewItemDialog.prototype.open = function () { this._dialog["fabric"].open(); };
        // Method to create the dialog
        NewItemDialog.prototype.createDialog = function () {
            // Create the dialog
            this._dialog = document.createElement("div");
            // Set the class name
            this._dialog.className = "ms-Dialog";
            // Set the template
            this._dialog.innerHTML = "\n<div class=\"ms-Dialog-title\">New Item</div>\n<div class=\"ms-Dialog-content\">\n    <div>\n        <div class=\"ms-Dropdown\">\n            <label class=\"ms-Label\">Type:</label>\n            <i class=\"ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown\"></i>\n            <select id=\"ddlType\" class=\"ms-Dropdown-select\">\n                <option>Highest</option>\n                <option>High</option>\n                <option>Medium</option>\n                <option>Low</option>\n                <option>Lowest</option>\n            </select>\n        </div>\n        <div class=\"ms-TextField\">\n            <label class=\"ms-Label\">Title:</label>\n            <input id=\"tbTitle\" class=\"ms-TextField-field\" type=\"text\" placeholder=\"Title\" />\n        </div>\n        <div class=\"ms-TextField\">\n            <label class=\"ms-Label\">Owner:</label>\n            <div id=\"phUser\" />\n        </div>\n        <div class=\"ms-TextField ms-TextField--multiline\">\n            <label class=\"ms-Label\">Notes:</label>\n            <textarea id=\"taNotes\" class=\"ms-TextField-field\" rows=\"3\"></textarea>\n        </div>\n    </div>\n</div>\n<div class=\"ms-Dialog-actions\">\n    <button class=\"ms-Button ms-Dialog-action ms-Button--primary\" onclick=\"GD.Dashboard.createItem(); return false;\">\n        <span class=\"ms-Button-label\">Create</span>\n    </button>\n    <button class=\"ms-Button ms-Dialog-action\" onclick=\"JSP.Dashboard.NewRequestDialog.close(); return false;\">\n        <span class=\"ms-Button-label\">Cancel</span>\n    </button>\n</div>\n";
            // Append the dialog to the body
            document.body.appendChild(this._dialog);
            // Initialize the drop down list
            var ddl = this._dialog.querySelector(".ms-Dropdown");
            ddl["fabric"] = new window["fabric"].Dropdown(ddl);
            // Initialize the dialog
            this._dialog["fabric"] = new window["fabric"].Dialog(this._dialog);
        };
        // Method to save the item
        NewItemDialog.prototype.saveItem = function () {
            // Get the list
            (new $REST.List("Demo"))
                .Items()
                .add({
                GDNotes: this._dialog.querySelector("#taNotes")["value"],
                GDOwnerId: window["_spPageContextInfo"].userId,
                GDType: this._dialog.querySelector("#ddlType")["value"],
                Title: this._dialog.querySelector("#tbTitle")["value"]
            })
                .execute(function (item) {
                // Add the row
                GD.Dashboard.addItem(item.Id);
            });
        };
        return NewItemDialog;
    }());
    GD.NewItemDialog = NewItemDialog;
})(GD || (GD = {}));
var GD;
(function (GD) {
    /***************************************************************
     * Edit Item Panel
     ***************************************************************/
    var ViewItemPanel = (function () {
        /***************************************************************
         * Constructor
         ***************************************************************/
        function ViewItemPanel() {
        }
        /***************************************************************
         * Public Interface
         ***************************************************************/
        // Method to close the panel
        ViewItemPanel.prototype.close = function () {
            // Query the close button and click it
            this._activePanel ? this._activePanel.querySelector(".ms-Panel-closeButton")["click"]() : null;
        };
        // Method to show the panel
        ViewItemPanel.prototype.show = function (item) {
            // Clone the panel
            this._activePanel = this.createPanel(item);
            // Show the panel
            new window["fabric"].Panel(this._activePanel);
        };
        // Method to create the panel
        ViewItemPanel.prototype.createPanel = function (item) {
            // Create the dialog
            var panel = document.createElement("div");
            // Set the class name
            panel.className = "ms-Panel";
            // Set the item
            panel["item"] = item;
            // Set the template
            panel.innerHTML = "\n<button class=\"ms-Panel-closeButton ms-PanelAction-close\">\n    <i class=\"ms-Panel-closeIcon ms-Icon ms-Icon--Cancel\"></i>\n</button>\n<div class=\"ms-Panel-contentInner\">\n    <p class=\"ms-Panel-headerText\">View Item</p>\n    <div id=\"lblType\" class=\"ms-Label\">\n        <label class=\"ms-Label\">Type:</label>\n    </div>\n    <div id=\"lblTitle\" class=\"ms-Label\">\n        <label class=\"ms-Label\">Title:</label>\n    <div id=\"lblOwner\" class=\"ms-Label\">\n        <label class=\"ms-Label\">Owner:</label>\n    </div>\n    <div id=\"lblNotes\" class=\"ms-Label\">\n        <label class=\"ms-Label\">Notes:</label>\n    </div>\n</div>\n";
            // Set the item values
            panel.querySelector("#lblNotes").innerHTML += item["GDNotes"];
            panel.querySelector("#lblOwner").innerHTML += item["GDOwner"].Title;
            panel.querySelector("#lblTitle").innerHTML += item["Title"];
            panel.querySelector("#lblType").innerHTML += item["GDType"];
            // Return the panel
            return panel;
        };
        // Method to save the item
        ViewItemPanel.prototype.saveItem = function (item) {
            var _this = this;
            item
                .update({
                GDNotes: this._activePanel.querySelector("#taNotes")["value"],
                GDType: this._activePanel.querySelector("#ddlType")["value"],
                Title: this._activePanel.querySelector("#tbTitle")["value"]
            })
                .execute(function () {
                // Add the item to the dashboard
                GD.Dashboard.addItem(item.Id);
                // Close this panel
                _this.close();
            });
        };
        return ViewItemPanel;
    }());
    GD.ViewItemPanel = ViewItemPanel;
})(GD || (GD = {}));
var GD;
(function (GD) {
    /***************************************************************
     * Edit Item Panel
     ***************************************************************/
    var EditItemPanel = (function () {
        /***************************************************************
         * Constructor
         ***************************************************************/
        function EditItemPanel() {
        }
        /***************************************************************
         * Public Interface
         ***************************************************************/
        // Method to close the panel
        EditItemPanel.prototype.close = function () {
            // Query the close button and click it
            this._activePanel ? this._activePanel.querySelector(".ms-Panel-closeButton")["click"]() : null;
        };
        // Method to save the item
        EditItemPanel.prototype.save = function (item) { this.saveItem(item); };
        // Method to show the panel
        EditItemPanel.prototype.show = function (item) {
            // Clone the panel
            this._activePanel = this.createPanel(item);
            // Show the panel
            new window["fabric"].Panel(this._activePanel);
        };
        // Method to create the panel
        EditItemPanel.prototype.createPanel = function (item) {
            // Create the dialog
            var panel = document.createElement("div");
            // Set the class name
            panel.className = "ms-Panel";
            // Set the item
            panel["item"] = item;
            // Set the template
            panel.innerHTML = "\n<button class=\"ms-Panel-closeButton ms-PanelAction-close\">\n    <i class=\"ms-Panel-closeIcon ms-Icon ms-Icon--Cancel\"></i>\n</button>\n<div class=\"ms-Panel-contentInner\">\n    <p class=\"ms-Panel-headerText\">Edit Item</p>\n    <div class=\"ms-Dropdown\">\n        <label class=\"ms-Label\">Type:</label>\n        <i class=\"ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown\"></i>\n        <select id=\"ddlType\" class=\"ms-Dropdown-select\">\n            <option>Highest</option>\n            <option>High</option>\n            <option>Medium</option>\n            <option>Low</option>\n            <option>Lowest</option>\n        </select>\n    </div>\n    <div class=\"ms-TextField\">\n        <label class=\"ms-Label\">Title:</label>\n        <input id=\"tbTitle\" class=\"ms-TextField-field\" type=\"text\" placeholder=\"Title\" />\n    </div>\n    <div class=\"ms-TextField\">\n        <label class=\"ms-Label\">Owner:</label>\n        <div id=\"phUser\" />\n    </div>\n    <div class=\"ms-TextField ms-TextField--multiline\">\n        <label class=\"ms-Label\">Notes:</label>\n        <textarea id=\"taNotes\" class=\"ms-TextField-field\" rows=\"3\"></textarea>\n    </div>\n    <button class=\"ms-Button ms-Dialog-action ms-Button--primary\" onclick=\"GD.Dashboard.saveItem({{ID}}); return false;\">\n        <span class=\"ms-Button-label\">Save</span>\n    </button>\n</div>\n"
                .replace(/{{ID}}/g, item.Id);
            // Set the item values
            panel.querySelector("#taNotes")["value"] = item["GDNotes"];
            panel.querySelector("#tbTitle")["value"] = item["Title"];
            // Initialize the drop down list, and set the value
            var ddl = panel.querySelector(".ms-Dropdown");
            ddl["fabric"] = new window["fabric"].Dropdown(ddl);
            ddl.querySelector(".ms-Dropdown-title").innerHTML = item["GDType"];
            // Return the panel
            return panel;
        };
        // Method to save the item
        EditItemPanel.prototype.saveItem = function (item) {
            var _this = this;
            item
                .update({
                GDNotes: this._activePanel.querySelector("#taNotes")["value"],
                GDType: this._activePanel.querySelector("#ddlType")["value"],
                Title: this._activePanel.querySelector("#tbTitle")["value"]
            })
                .execute(function () {
                // Add the item to the dashboard
                GD.Dashboard.addItem(item.Id);
                // Close this panel
                _this.close();
            });
        };
        return EditItemPanel;
    }());
    GD.EditItemPanel = EditItemPanel;
})(GD || (GD = {}));
var GD;
(function (GD) {
    /***************************************************************
     * View Notes Panel
     ***************************************************************/
    var ViewNotesPanel = (function () {
        /***************************************************************
         * Constructor
         ***************************************************************/
        function ViewNotesPanel() {
        }
        /***************************************************************
         * Public Interface
         ***************************************************************/
        // Method to close the panel
        ViewNotesPanel.prototype.close = function () {
            // Query the close button and click it
            this._activePanel ? this._activePanel.querySelector(".ms-Panel-closeButton")["click"]() : null;
        };
        // Method to show the panel
        ViewNotesPanel.prototype.show = function (item) {
            // Clone the panel
            this._activePanel = this.createPanel(item);
            // Append the history to the panel
            this._activePanel.querySelector(".ms-Panel-contentInner").innerHTML += item["GDNotes"];
            // Show the panel
            new window["fabric"].Panel(this._activePanel);
        };
        // Method to create the panel
        ViewNotesPanel.prototype.createPanel = function (item) {
            // Create the dialog
            var panel = document.createElement("div");
            // Set the class name
            panel.className = "ms-Panel";
            // Set the item
            panel["item"] = item;
            // Set the template
            panel.innerHTML = "\n<button class=\"ms-Panel-closeButton ms-PanelAction-close\">\n    <i class=\"ms-Panel-closeIcon ms-Icon ms-Icon--Cancel\"></i>\n</button>\n<div class=\"ms-Panel-contentInner\">\n    <p class=\"ms-Panel-headerText\">Notes</p>\n</div>\n";
            // Return the panel
            return panel;
        };
        return ViewNotesPanel;
    }());
    GD.ViewNotesPanel = ViewNotesPanel;
})(GD || (GD = {}));
var GD;
(function (GD) {
    /***************************************************************
     * Table
     ***************************************************************/
    var Table = (function () {
        /***************************************************************
         * Constructor
         ***************************************************************/
        function Table(panelId) {
            // Get the panel
            var panel = document.querySelector("#" + panelId);
            if (panel) {
                // Create the table
                this.createTable();
                // Add the table to it
                panel.appendChild(this._table);
            }
        }
        /***************************************************************
         * Public Interface
         ***************************************************************/
        // Method to add a row
        Table.prototype.addRow = function (item) {
            // Append a row to the body of the table
            this._table.querySelector("tbody").innerHTML += this.generateRow(item);
        };
        // Method to create the panel
        Table.prototype.createTable = function () {
            // Create the dialog
            this._table = document.createElement("table");
            // Set the class name
            this._table.className = "ms-Table";
            // Set the template
            this._table.innerHTML = "\n<thead>\n    <tr>\n        <th>Title</th>\n        <th>Type</th>\n        <th>Owner</th>\n        <th>Actions</th>\n    </tr>\n</thead>\n<tbody></tbody>\n";
        };
        // Method to generate a table row
        Table.prototype.generateRow = function (item) {
            // Return the row template
            return "\n<tr data-item-id=\"{{ID}}\">\n    <td>{{Title}}</td>\n    <td>{{Type}}</td>\n    <td>{{Owner}}</td>\n    <td>\n        <button class=\"ms-Button\" onclick=\"return GD.Dashboard.showViewItemPanel({{ID}});\">\n            <span class=\"ms-Button-label\">View</span>\n        </button>\n        &nbsp;/&nbsp;\n        <button class=\"ms-Button\" onclick=\"return GD.Dashboard.showEditItemPanel({{ID}});\">\n            <span class=\"ms-Button-label\">Edit</span>\n        </button>\n        &nbsp;/&nbsp;\n        <button class=\"ms-Button\" onclick=\"return GD.Dashboard.showNotesPanel({{ID}});\">\n            <span class=\"ms-Button-label\">View Notes</span>\n        </button>\n    </td>\n</tr>\n"
                .replace(/{{ID}}/g, item.Id)
                .replace(/{{Owner}}/g, item["GDOwner"] ? item["GDOwner"].Title : null)
                .replace(/{{Title}}/g, item["Title"])
                .replace(/{{Type}}/g, item["GDType"]);
        };
        return Table;
    }());
    GD.Table = Table;
})(GD || (GD = {}));
//# sourceMappingURL=list.js.map