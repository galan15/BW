class Armory_LoadAllItems extends Module {
    constructor() {
        super({ supportedUrl: '?a=equip' });
    }

    execute() {
        document.querySelectorAll('#loadArmoryItemsButton')
            .forEach(button => {
                if (typeof button.click === 'function') {
                    button.click();
                }
            });
    }
}