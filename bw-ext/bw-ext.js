NodeList.prototype.last = function () {
    return this[this.length - 1];
};

String.prototype.normalize = function () {
    return this?.toLowerCase() ?? '';
};

String.prototype.capitalizeEachWord = function () {
    return this.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

class KeyValue {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}

class Opacity {
    static none = '0.0';
    static half = '0.5';
    static full = '1.0';
}

class Tags {
    static table = 'table';
    static thead = 'thead';
    static tbody = 'tbody';
    static tr = 'tr';
    static td = 'td';
    static div = 'div';
    static input = 'input';
}

class HtmlElementFactory {
    static create(tagName, builder) {
        const element = document.createElement(tagName);

        if (typeof builder === 'function') {
            builder(element);
        }

        return element;
    }

    static createTable(builder) {
        return this.create(Tags.table, builder);
    }

    static createTableHead(builder) {
        return this.create(Tags.thead, builder);
    }

    static createTableBody(builder) {
        return this.create(Tags.tbody, builder);
    }

    static createTableRow(builder) {
        return this.create(Tags.tr, builder);
    }

    static createTableCell(builder) {
        return this.create(Tags.td, builder);
    }

    static createDiv(builder) {
        return this.create(Tags.div, builder);
    }

    static createInput(builder) {
        return this.create(Tags.input, builder);
    }
}

class HtmlDocumentFactory {
    static create(rawHtml) {
        const htmlDocument = document.implementation.createHTMLDocument();
        htmlDocument.documentElement.innerHTML = rawHtml;

        return htmlDocument;
    }
}

class Tools {
    static formatPx(value) {
        return `${value}px`;
    }

    static formatPercent(value) {
        return `${value}%`;
    }

    static formatNumber(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }

    static mapToArray(map) {
        const array = [];

        map.forEach((value, key) => {
            array.push({ key: key, value: value });
        });

        return array;
    }
}

class Item {
    constructor(node, name, price, attributes) {
        this.node = node;
        this.name = name;
        this.nameNormalized = name.normalize();
        this.price = price ?? 0;
        this.attributes = attributes ?? [];
    }

    toggle(value) {
        this.node.style.display = value === true ? 'block' : 'none';
    }

    setName(name) {
        const linkNode = this.node.querySelector('.item-link');
        linkNode.innerHTML = name;
    }
}

class Scrap extends Item {
    static plnPrice = 20000;
    static prPrice = 1500;

    constructor(node, name, price) {
        super(node, name, price, []);
    }
}

class ItemFactory {
    constructor() {
        this.attributeNames = [
            'SIŁA',
            'ZWINNOŚĆ',
            'ODPORNOŚĆ',
            'WYGLĄD',
            'CHARYZMA',
            'WPŁYWY',
            'SPOSTRZEGAWCZOŚĆ',
            'INTELIGENCJA',
            'WIEDZA',
            'łatwość',
            'twardość',
            'szczęście'
        ].map(attributeName => attributeName.normalize());
    }

    create(node) {
        if (node instanceof HTMLElement === false) {
            throw new Error('Invalid input argument \'node\'');
        }

        return node.classList.contains('item-link') === true
            ? this.createFromLinkNode(node)
            : this.createFromNode(node);
    }

    createFromLinkNode(node) {
        return this.createFromNode(node.parentElement);
    }

    createFromNode(node) {
        const linkNode = node.querySelector('.item-link');
        const itemName = linkNode.textContent.trim();

        if (this.isScrap(itemName)) {
            return this.createScrap(node, itemName);
        }

        const rawDetails = linkNode.getAttribute('onclick').toString();
        const openingTagIndex = rawDetails.indexOf('<table');
        const closingTagIndex = rawDetails.lastIndexOf('</table>');
        const rawHtml = rawDetails.substring(openingTagIndex, closingTagIndex + '</table>'.length);
        const itemDetailsDocument = HtmlDocumentFactory.create(rawHtml);

        const itemAttributes = itemDetailsDocument
            .querySelector('.itemEffectsList')
            .innerHTML
            .split('<br>')
            .map(text => text.replaceAll('<b>', '').replaceAll('</b>', '').normalize())
            .filter(text => this.attributeNames.some(attributeName => text.startsWith(attributeName)))
            .map(text => {
                const parts = text.split(' ');
                const attributeName = parts[0];
                const attributeValue = Number(parts[1])

                return new KeyValue(attributeName, attributeValue);
            });

        const priceString = itemDetailsDocument
            .querySelectorAll('.itemdesc-s')
            .last()
            .textContent
            .replace('Cena sprzedaży:', '')
            .replace('PLN', '')
            .replaceAll(' ', '')
            .trim();

        const price = Number(priceString);

        return new Item(node, itemName, price, itemAttributes);
    }

    createScrap(node, name) {
        const countRaw = name
            .normalize()
            .replace('Złom sztuk:'.normalize(), '')
            .trim();

        const price = Number(countRaw) * Scrap.plnPrice;

        return new Scrap(node, name, price);
    }

    isScrap(itemName) {
        return itemName.normalize().includes('Złom'.normalize()) === true;
    }
}

class PageHandler {
    constructor(model) {
        this.supportedUrl = model.supportedUrl;
    }

    get canExecute() {
        return window.location.search.startsWith(this.supportedUrl);
    }

    execute() {
    }
}

class TownShopHandler extends PageHandler {
    constructor() {
        super({ supportedUrl: '?a=townshop' });
    }

    execute() {
        this.openBargains();
        this.highlightPerfectItems();
    }

    highlightPerfectItems() {
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

    openBargains() {
        document.querySelector('#img_occ').parentElement.parentElement.click();
    };
}

class AuctionHandler extends PageHandler {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=auction' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    execute() {
        this.insertPrValueColumn();
        this.highlightImportantItems();
    }

    highlightImportantItems() {
        const importantPhrases = [
            'słoneczny', 'słoneczna',
            'jastrzębi', 'jastrzębia',
            'tygrysi', 'tygrysie', 'tygrysia',
            'szczęścia',
            'orchidei'
        ].map(phrase => phrase.normalize().capitalizeEachWord());

        Array.from(document.querySelectorAll('.item-link'))
            .map(node => this.itemFactory.create(node))
            .filter(item => importantPhrases.some(phrase => item.name.includes(phrase)))
            .forEach(item => {
                const oldName = item.name.capitalizeEachWord();
                const oldNameWords = oldName.split(' ');
                let newNameWords = [];

                oldNameWords.forEach(word => {
                    let newWord = word;

                    importantPhrases.forEach(phrase => {
                        if (word === phrase) {
                            newWord = HtmlElementFactory.create('span', span => {
                                span.textContent = word;
                                span.style.color = 'limegreen';
                            }).outerHTML;
                        }
                    });

                    newNameWords.push(newWord);
                });

                const newName = newNameWords.join(' ');
                if (newName === oldName) {
                    return;
                }

                item.setName(newName);
            });
    }

    insertPrValueColumn() {
        const endDateIndex = 4;
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
                    const prPrice = Math.ceil(item.price * onePlnPriceInPr);

                    td.textContent = Tools.formatNumber(prPrice);
                    td.style.width = Tools.formatPx(80);

                    item.node.parentElement.insertBefore(td, item.node.parentElement.children[endDateIndex]);
                });
            });
    }
}

class BuildingsHandler extends PageHandler {
    constructor() {
        super({ supportedUrl: '?a=build' });
    }

    execute() {
        this.replaceWithTable();
    }

    replaceWithTable() {
        const buildings = Array.from(document.querySelectorAll('.building')).map(buildingNode => {
            const nameNode = buildingNode.querySelector('.bldheader');
            const headerNode = nameNode.parentElement;

            const name = nameNode.textContent.trim();
            const level = headerNode.textContent.trim('\n', ' ').replace(/^\D+/g, '');

            return {
                name: name,
                level: Number(level)
            };
        });

        const contentMidNode = document.querySelector('.content-mid');

        HtmlElementFactory.createTable(table => {
            table.classList.add('hoverTable');
            table.style.width = Tools.formatPercent(40);
            table.style.margin = '10px auto';

            HtmlElementFactory.createTableHead(thead => {
                HtmlElementFactory.createTableRow(tr => {
                    tr.classList.add('tblheader');

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Budynek';
                        td.style.textAlign = 'start';
                        tr.append(td);
                    });

                    HtmlElementFactory.createTableCell(td => {
                        td.textContent = 'Poziom';
                        td.style.textAlign = 'start';
                        tr.append(td);
                    });

                    thead.append(tr);
                });

                table.append(thead);
            });

            HtmlElementFactory.createTableBody(tbody => {
                buildings.forEach(building => {
                    HtmlElementFactory.createTableRow(tr => {
                        HtmlElementFactory.createTableCell(td => {
                            td.textContent = building.name;
                            tr.append(td);
                        });

                        HtmlElementFactory.createTableCell(td => {
                            td.textContent = building.level;
                            tr.append(td);
                        });

                        tbody.append(tr);
                    });
                });

                table.append(tbody);
            })

            contentMidNode.prepend(table);
        });
    }
}

class ArmoryHandler extends PageHandler {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=equip' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    execute() {
        this.addArmorySearch();
        this.loadAllArmoryItems();
    }

    loadAllArmoryItems() {
        const button = document.querySelector('#loadArmoryItemsButton');

        if (typeof button?.click === 'function') {
            button.click();
        }
    }

    addArmorySearch() {
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
    };
}

class BloodWarsExtension {
    static instance = BloodWarsExtension.instance ?? new BloodWarsExtension();

    constructor() {
        this.handlers = [
            new TownShopHandler(),
            new ArmoryHandler(),
            new AuctionHandler(),
            new BuildingsHandler()
        ]
    }

    setup() {
        this.handlers
            .filter(handler => handler.canExecute === true)
            .forEach(handler => handler.execute());
    }
}

BloodWarsExtension.instance.setup();