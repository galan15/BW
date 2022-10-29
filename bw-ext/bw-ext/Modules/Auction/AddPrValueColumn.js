class Auction_AddPrValueColumn extends Module {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=auction&' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    execute() {
        const endDateIndex = 4;
        const currentOfferIndex = 3;
        const header = document
            .querySelectorAll('.content-mid .tblheader')
            .last();

        HtmlElementFactory.createTableCell(td => {
            td.textContent = 'Wartość PR';
            header.insertBefore(td, header.children[endDateIndex]);
        });

        const onePlnPriceInPr = Scrap.prPrice / Scrap.plnPrice;

        Array.from(document.querySelectorAll('.item-link'))
            .map(node => this.itemFactory.create(node))
            .forEach(item => {
                HtmlElementFactory.createTableCell(td => {
                    const tr = item.node.parentElement;
                    const currentOfferNode = tr.children[currentOfferIndex];
                    const currentOffer = currentOfferNode.textContent.includes('brak') === true
                        ? 0
                        : Number(currentOfferNode.textContent.replaceAll(' ', ''));

                    const prPrice = Math.ceil(item.price * onePlnPriceInPr);
                    const percent = ((currentOffer / prPrice) * 100).toFixed(2);

                    HtmlElementFactory.createDiv(div => {
                        div.textContent = Tools.formatNumber(prPrice);
                        td.append(div);
                    });

                    HtmlElementFactory.createDiv(div => {
                        div.textContent = `${percent}%`;
                        div.style.color = 'gray';
                        td.append(div);
                    });

                    td.style.width = Tools.formatPx(80);

                    tr.insertBefore(td, tr.children[endDateIndex]);
                });
            });
    }
}