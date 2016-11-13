<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>
<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>
<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <SharePoint:ScriptLink name="sp.js" runat="server" OnDemand="true" LoadAfterUI="true" Localizable="false" />
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link rel="Stylesheet" type="text/css" href="../node_modules/office-ui-fabric-js/dist/css/fabric.min.css" />
    <link rel="Stylesheet" type="text/css" href="../node_modules/office-ui-fabric-js/dist/css/fabric.components.min.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../node_modules/gd-sprest/dist/sprest.min.js"></script>
    <script type="text/javascript" src="../node_modules/office-ui-fabric-js/dist/js/fabric.min.js"></script>
    <script type="text/javascript" src="../Scripts/list.js"></script>
    <script type="text/javascript" src="../Scripts/Dashboard.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Dashboard
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <!-- Navigation -->
    <div class="ms-Pivot">
        <!-- Command Bar -->
        <div class="ms-CommandBar">
            <!-- Side Commands -->
            <div class="ms-CommandBar-sideCommands">
                <div class="ms-CommandButton">
                    <!-- New Request Button -->
                    <button class="ms-CommandButton-button" onclick="return GD.Dashboard.showNewItemDialog();">
                        <span class="ms-CommandButton-icon">
                            <i class="ms-Icon ms-Icon--AddTo"></i>
                        </span>
                        <span class="ms-CommandButton-label">New Item</span>
                    </button>
                </div>
            </div>
            <!-- Main Commands -->
            <div class="ms-CommandBar-mainArea">
                <ul class="ms-Pivot-links">
                    <li class="ms-Pivot-link is-selected" data-content="myItems" title="My Items">My Items</li>
                    <li class="ms-Pivot-link" data-content="allItems" title="All Items">All Items</li>
                </ul>
            </div>
        </div>

        <!-- Navigation Panels -->
        <div id="myItemsPanel" class="ms-Pivot-content" data-content="myItems"></div>
        <div id="allItemsPanel" class="ms-Pivot-content" data-content="allItems"></div>
    </div>
</asp:Content>
