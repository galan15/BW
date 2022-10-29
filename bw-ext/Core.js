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
    static span = 'span';
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

    static createSpan(builder) {
        return this.create(Tags.span, builder);
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

    get linkNode() {
        return this.node.querySelector('.item-link');
    }

    get priceFormatted() {
        return Tools.formatNumber(this.price);
    }

    toggle(value) {
        this.node.style.display = value === true ? 'block' : 'none';
    }

    setName(name) {
        this.linkNode.innerHTML = name;
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