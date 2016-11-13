module GD {
    /***************************************************************
     * Panel
     ***************************************************************/
    export class NewItemDialog {
        /***************************************************************
         * Constructor
         ***************************************************************/
        constructor() {
            // Create the dialog
            this.createDialog();
        }

        /***************************************************************
         * Public Interface
         ***************************************************************/

        // Close the dialog
        close() { this._dialog["fabric"].close(); }

        // Method to save the item
        save() { this.saveItem(); }

        // Open the dialog
        open() { this._dialog["fabric"].open(); }

        /***************************************************************
         * Private Interface
         ***************************************************************/

        // The dialog
        _dialog: Element;

        // Method to create the dialog
        private createDialog() {
            // Create the dialog
            this._dialog = document.createElement("div");

            // Set the class name
            this._dialog.className = "ms-Dialog";

            // Set the template
            this._dialog.innerHTML = `
<div class="ms-Dialog-title">New Item</div>
<div class="ms-Dialog-content">
    <div>
        <div class="ms-Dropdown">
            <label class="ms-Label">Type:</label>
            <i class="ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown"></i>
            <select id="ddlType" class="ms-Dropdown-select">
                <option>Highest</option>
                <option>Hight</option>
                <option>Medium</option>
                <option>Low</option>
                <option>Lowest</option>
            </select>
        </div>
        <div class="ms-TextField">
            <label class="ms-Label">Title:</label>
            <input id="tbTitle" class="ms-TextField-field" type="text" placeholder="Title" />
        </div>
        <div class="ms-TextField">
            <label class="ms-Label">Owner:</label>
            <div id="phUser" />
        </div>
        <div class="ms-TextField ms-TextField--multiline">
            <label class="ms-Label">Notes:</label>
            <textarea id="taNotes" class="ms-TextField-field" rows="3"></textarea>
        </div>
    </div>
</div>
<div class="ms-Dialog-actions">
    <button class="ms-Button ms-Dialog-action ms-Button--primary" onclick="GD.Dashboard.createItem(); return false;">
        <span class="ms-Button-label">Create</span>
    </button>
    <button class="ms-Button ms-Dialog-action" onclick="JSP.Dashboard.NewRequestDialog.close(); return false;">
        <span class="ms-Button-label">Cancel</span>
    </button>
</div>
`;

            // Append the dialog to the body
            document.body.appendChild(this._dialog);

            // Initialize the drop down list
            let ddl = this._dialog.querySelector(".ms-Dropdown");
            ddl["fabric"] = new window["fabric"].Dropdown(ddl);

            // Initialize the dialog
            this._dialog["fabric"] = new window["fabric"].Dialog(this._dialog);
        }

        // Method to save the item
        private saveItem() {
            // Get the list
            (new $REST.List("Demo"))
                // Get the item collection
                .Items()
                // Add a new item
                .add({
                    GDNotes: this._dialog.querySelector("#taNotes")["value"],
                    GDOwnerId: window["_spPageContextInfo"].userId,
                    GDType: this._dialog.querySelector("#ddlType")["value"],
                    Title: this._dialog.querySelector("#tbTitle")["value"]
                })
                // Execute the request
                .execute((item: $REST.Types.IListItem) => {
                    // Add the row
                    GD.Dashboard.addItem(item.Id);
                });
        }
    }
}