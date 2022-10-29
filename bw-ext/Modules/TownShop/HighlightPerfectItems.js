class TownShop_HighlightPerfectItems extends Module {
    constructor() {
        super({ supportedUrl: '?a=townshop' });
    }

    execute() {
        document.querySelectorAll('.item').forEach(itemNode => {
            const itemLinkNode = itemNode.querySelector('.item-link');
            const itemName = itemLinkNode.textContent.toLowerCase();
            const itemDescriptionNode = itemNode.querySelector('.itemdesc');

            itemNode.style.paddingTop = Tools.formatPx(2);
            itemNode.style.paddingBottom = Tools.formatPx(2);

            if (itemName.includes('doskonał') === true) {
                itemDescriptionNode.style.background = 'darkblue';
            } else {
                itemDescriptionNode.style.opacity = Opacity.half;
            }
        });
    };
}