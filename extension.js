
const St = imports.gi.St;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Shell = imports.gi.Shell;

const ICON_SIZE = 28;

function AppMenuItem() {
    this._init.apply(this, arguments);
}

AppMenuItem.prototype = {
    __proto__: PopupMenu.PopupBaseMenuItem.prototype,

    _init: function (app) {
        PopupMenu.PopupBaseMenuItem.prototype._init.call(this, {reactive: false});

        this._app = app;
        this.label = new St.Label({ text: app.get_name() });
        this.addActor(this.label);
    },

    activate: function (event) {
        this._app.activate_full(-1, event.get_time());

        PopupMenu.PopupBaseMenuItem.prototype.activate.call(this, event);
    }
};

function ApplicationsButton() {
    this._init();
}

ApplicationsButton.prototype = {
    __proto__: PanelMenu.SystemStatusButton.prototype,

    _init: function() {
        PanelMenu.SystemStatusButton.prototype._init.call(this, 'media-optical');
        this._display();
    },

    refresh : function() {
        this._clearAll();
        this._display();
    },

    _clearAll: function() {
        this.menu.removeAll();
    },

    _display: function() {
        let ap = Shell.AppUsage.get_default();
        let apps = ap.get_most_used("", 0);

        for each(app in apps) {
            let item = new AppMenuItem(app);
            this.menu.addMenuItem(item);
        }
    }
};

let appsMenuButton;

function enable() {
    appsMenuButton = new ApplicationsButton();
    Main.panel._rightBox.insert_actor(appsMenuButton.actor, 0);
    Main.panel._rightBox.child_set(appsMenuButton.actor, { y_fill: true } );
    Main.panel._menus.addMenu(appsMenuButton.menu);
}

function disable() {
    appsMenuButton.destroy();
}

function init() {
    // Do nothing
}
