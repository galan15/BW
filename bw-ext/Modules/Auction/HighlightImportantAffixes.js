class Auction_HighlightImportantAffixes extends Module {
    constructor(itemFactory) {
        super({ supportedUrl: '?a=auction' });

        this.itemFactory = itemFactory ?? new ItemFactory();
    }

    execute() {
        const importantPhrases = [
            'słoneczny', 'słoneczna',
            'jastrzębi', 'jastrzębia',
            'tygrysi', 'tygrysie', 'tygrysia',
            'szczęścia', 'podkowy', 'klanu', 'szaleńca',
            'orchidei',
            'szybkości',
            'zwierzęca', 'zwierzęcy',
            'reakcji',
            'refleksyjny',
            'runiczna', 'runiczne', 'runiczny',
            'szamańska', 'szamańskie', 'szamański',
            'prekognicji',
            'krwawa', 'krwawe', 'krwawy',
            'nocy', 'siewcy', 'śmierci',
			'śmiercionośna', 'śmiercionośny', 'śmiercionośne',
			'prekognicji',
			'pasterza'
        ];

        Array.from(document.querySelectorAll('.item-link'))
            .map(node => this.itemFactory.create(node))
            .forEach(item => {
                const itemNewNameWords = [];

                const itemWords = item.name.split(' ');
                itemWords.forEach(word => {
                    if (importantPhrases.some(phrase => word.localeCompare(phrase, undefined, { sensitivity: 'accent' }) === 0)) {
                        const higlightedWord = HtmlElementFactory.createSpan(span => {
                                span.textContent = word;
                                span.style.color = 'limegreen';
                            }).outerHTML;
                        itemNewNameWords.push(higlightedWord);
                        return;
                    }
                    itemNewNameWords.push(word);
                });

                const newName = itemNewNameWords.join(' ');
                item.setName(newName);
            });
    }
}