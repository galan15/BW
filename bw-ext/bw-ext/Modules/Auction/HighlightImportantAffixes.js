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
            'runiczna', 'runiczne', 'runiczny',
            'szamańska', 'szamańskie', 'szamański',
            'prekognicji',
            'krwawa', 'krwawe', 'krwawy',
            'nocy', 'siewcy', 'śmierci',
			'śmiercionośna', 'śmiercionośny', 'śmiercionośne',
			'prekognicji',
			'pasterza'
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
                            newWord = HtmlElementFactory.createSpan(span => {
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
}