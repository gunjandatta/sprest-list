module GD {
    /***************************************************************
     * Edit Item Panel
     ***************************************************************/
    export class EditItemPanel {
        /***************************************************************
         * Constructor
         ***************************************************************/
        constructor() { }

        /***************************************************************
         * Public Interface
         ***************************************************************/

        // Method to close the panel
        close() {
            // Query the close button and click it
            this._activePanel ? this._activePanel.querySelector(".ms-Panel-closeButton")["click"]() : null;
        }

        // Method to save the item
        save(item) { this.saveItem(item); }

        // Method to show the panel
        show(item) {
            // Clone the panel
            this._activePanel = this.createPanel(item);

            // Show the panel
            new window["fabric"].Panel(this._activePanel);
        }

        /***************************************************************
         * Private Interface
         ***************************************************************/

        // The active panel
        _activePanel: Element;

        // Method to create the panel
        private createPanel(item) {
            // Create the dialog
            let panel = document.createElement("div");

            // Set the class name
            panel.className = "ms-Panel";

            // Set the item
            panel["item"] = item;

            // Set the template
            panel.innerHTML = `
<button class="ms-Panel-closeButton ms-PanelAction-close">
    <i class="ms-Panel-closeIcon ms-Icon ms-Icon--Cancel"></i>
</button>
<div class="ms-Panel-contentInner">
    <p class="ms-Panel-headerText">Edit Item</p>
    <div class="ms-Dropdown">
        <label class="ms-Label">Type:</label>
        <i class="ms-Dropdown-caretDown ms-Icon ms-Icon--ChevronDown"></i>
        <select id="ddlType" class="ms-Dropdown-select">
            <option>Highest</option>
            <option>High</option>
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
    <button class="ms-Button ms-Dialog-action ms-Button--primary" onclick="GD.Dashboard.saveItem({{ID}}); return false;">
        <span class="ms-Button-label">Save</span>
    </button>
</div>
`
                // Replace the item values
                .replace(/{{ID}}/g, item.Id);

            // Set the item values
            panel.querySelector("#taNotes")["value"] = item["GDNotes"];
            panel.querySelector("#tbTitle")["value"] = item["Title"];

            // Initialize the drop down list, and set the value
            let ddl = panel.querySelector(".ms-Dropdown");
            ddl["fabric"] = new window["fabric"].Dropdown(ddl);
            ddl.querySelector(".ms-Dropdown-title").innerHTML = item["GDType"];

            // Return the panel
            return panel;
        }

        // Method to save the item
        private saveItem(item: $REST.Types.IListItem) {
            item
                // Update the item
                .update({
                    GDNotes: this._activePanel.querySelector("#taNotes")["value"],
                    GDType: this._activePanel.querySelector("#ddlType")["value"],
                    Title: this._activePanel.querySelector("#tbTitle")["value"]
                })
                // Execute the request
                .execute(() => {
                    // Add the item to the dashboard
                    GD.Dashboard.addItem(item.Id);

                    // Close this panel
                    this.close();
                });
        }
    }
}