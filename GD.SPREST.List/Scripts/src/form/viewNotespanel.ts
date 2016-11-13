module GD {
    /***************************************************************
     * Panel
     ***************************************************************/
    export class ViewNotesPanel {
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

        // Method to show the panel
        show(item) {
            // Clone the panel
            this._activePanel = this.createPanel(item);

            // Append the history to the panel
            this._activePanel.querySelector(".ms-Panel-contentInner").innerHTML += item["GDNotes"];

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
    <p class="ms-Panel-headerText">Notes</p>
</div>
`;
            // Return the panel
            return panel;
        }
    }
}