class Armory_AddSearch extends Module {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=equip' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    execute() {
        const rootNode = document.querySelector('#stockItemList > div');
        const searchContainer = HtmlElementFactory.createDiv(div => {
            div.classList.add('bw-ext-armory-search-container');
        });

        const searchFunction = function (input) {
            const phrase = input.value.normalize();

            Array.from(document.querySelectorAll('#stockItemList .item'))
                .map(node => this.itemFactory.create(node))
                .forEach(item => {
                    const itemAttributeNames = item.attributes.map(attribute => attribute.key);
                    const searchTargets = [item.nameNormalized, ...itemAttributeNames];
                    const show = searchTargets.some(target => target.includes(phrase));

                    item.toggle(show);
                });
        };

        const searchInput = HtmlElementFactory.createInput(input => {
            input.classList.add('bw-ext-armory-search-input');
            input.classList.add('inputbox');
            input.style.width = Tools.formatPercent(100);
            input.setAttribute('type', 'search');
            input.setAttribute('placeholder', 'Szukaj...');
            input.addEventListener('input', searchFunction.bind(this, input));

            searchContainer.append(input);
        })

        rootNode.prepend(searchContainer);
        searchInput.focus();
    }
}