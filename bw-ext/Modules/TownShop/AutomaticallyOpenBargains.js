class TownShop_AutomaticallyOpenBargains extends Module {
    constructor() {
        super({ supportedUrl: '?a=townshop' });
    }

    execute() {
        document.querySelector('#img_occ').parentElement.parentElement.click();
    }
}