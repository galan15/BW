class Auction_AddPrValueColumn extends Module {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=auction&' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    getScrapPrPrice() {
        const prPriceFromInput = Number(document.querySelector('#bw-ext-scrap-pr-price')?.value);

        return isNaN(prPriceFromInput) === true
            ? Scrap.prPrice
            : prPriceFromInput;
    }

    recalculatePrices(input) {
        input = input ?? document.querySelector('#bw-ext-scrap-pr-price');
        if (Number(input.value) === 0) {
            input.value = Scrap.prPrice.toString();
        }

        const currentOfferIndex = 3;

        Array.from(document.querySelectorAll('.item-link'))
            .map(node => this.itemFactory.create(node))
            .forEach(item => {
                const tr = item.node.parentElement;
                const currentOfferNode = tr.children[currentOfferIndex];
                const currentOffer = currentOfferNode.textContent.includes('brak') === true
                    ? 0
                    : Number(currentOfferNode.textContent.replaceAll(' ', ''));

                const onePlnPriceInPr = this.getScrapPrPrice() / Scrap.plnPrice;
                const prPrice = Math.ceil(item.price * onePlnPriceInPr);
                const percent = ((currentOffer / prPrice) * 100).toFixed(2);
                const prPriceNode = tr.querySelector('.bw-ext-pr-price-cell');
                const valueNode = prPriceNode.querySelector('.bw-ext-pr-price-cell-value');
                const percentNode = prPriceNode.querySelector('.bw-ext-pr-price-cell-percent');

                valueNode.textContent = Tools.formatNumber(prPrice);
                percentNode.textContent = Tools.formatPercent(percent);
            });
    }

    execute() {
        const endDateIndex = 4;
        const header = document
            .querySelectorAll('.content-mid .tblheader')
            .last();

        HtmlElementFactory.createTableCell(td => {
            HtmlElementFactory.createDiv(wrapper => {
                HtmlElementFactory.createDiv(title => {
                    title.style.setProperty('margin-right', Tools.formatPx(5));
                    title.textContent = 'Wartość PR';
                    wrapper.append(title);
                });

                HtmlElementFactory.createInput(input => {
                    input.style.setProperty('width', Tools.formatPx(50));
                    input.classList.add('inputbox');
                    input.setAttribute('id', 'bw-ext-scrap-pr-price');
                    input.setAttribute('type', 'number');
                    input.setAttribute('placeholder', 'Cena jednej sztuki złomu w PR');
                    input.setAttribute('title', 'Cena jednej sztuki złomu w PR');
                    input.setAttribute('step', 100);
                    input.setAttribute('min', 1000);
                    input.setAttribute('max', 10000);
                    input.addEventListener('input', this.recalculatePrices.bind(this, input));
                    input.value = Scrap.prPrice.toString();
                    wrapper.append(input);
                });

                td.style.setProperty('width', Tools.formatPx(80));
                td.append(wrapper);
            });

            header.insertBefore(td, header.children[endDateIndex]);
        });

        Array.from(document.querySelectorAll('.item-link'))
            .map(node => this.itemFactory.create(node))
            .forEach(item => {
                const tr = item.node.parentElement;

                HtmlElementFactory.createTableCell(td => {
                    td.classList.add('bw-ext-pr-price-cell');

                    HtmlElementFactory.createDiv(div => {
                        div.classList.add('bw-ext-pr-price-cell-value');
                        td.append(div);
                    });

                    HtmlElementFactory.createDiv(div => {
                        div.classList.add('bw-ext-pr-price-cell-percent');
                        div.style.color = 'gray';
                        td.append(div);
                    });

                    td.style.setProperty('width', Tools.formatPx(80));
                    tr.insertBefore(td, tr.children[endDateIndex]);
                });
            });

        this.recalculatePrices();
    }
}