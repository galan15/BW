class Rank_ShowPlayersEligibleForGettingEvolutionPoints extends Module {
    constructor() {
        super({ supportedUrl: '?a=rank' });
    }

    pointsColumnIndex = 7;
    nameColumnIndex = 1;
    rankColumnIndex = 0;

    rankPositions = document.querySelectorAll('table.rank > tbody > tr');

    execute() {
        const myCurrentLevel = this.getMyCurrentLevel();
        const myName = this.getMyName();
        const myCurrentRankPosition = this.getMyCurrentRankPosition(myName);

        const enemyMinimumLevel = Math.ceil(myCurrentLevel * 0.845);
        const enemyMinimumExperience = 1000 * Math.pow(1.1, enemyMinimumLevel - 1);
        const enemyMimimumPoints = Math.ceil(enemyMinimumExperience / 1000);
        
        Array.from(this.rankPositions) 
            .forEach(item => {
                const enemyName = this.getName(item);
                if (enemyName === myName) {
                    return;
                }

                const enemyPoints = this.getPoints(item);
                if (enemyPoints < enemyMimimumPoints) {
                    return;
                }

                const enemyRankPosition = this.getRank(item);
                if (enemyRankPosition < myCurrentRankPosition ||
                    enemyRankPosition - myCurrentRankPosition <= 100) {
                        item.style.color = 'green';
                    } else {
                        item.style.color = 'yellow';
                    }
            });
    }

    getMyCurrentLevel() {
        const expbar = document
            .querySelector('.top > .top-relativeInner > .stats-player > .expbar');

        const currentLevelTextRegex = /POZIOM \d+/;
        const currentLevelRegex = /\d+/;

        return expbar.getAttribute('onmouseover')
            .match(currentLevelTextRegex)[0]
            .match(currentLevelRegex)[0];
    }

    getMyName() {
        return document
            .querySelector('.top > .top-relativeInner > .stats-player > .me')
            .innerHTML;
    }

    getMyCurrentRankPosition(myName) {
        const myRank = -101;

        const request = new XMLHttpRequest();
        request.open('GET', 'https://r7.bloodwars.interia.pl/?a=profile', false);
        request.send();

        const rankRowRegex = /(?<=<tr><td><b>Miejsce w rankingu<\/b><\/td><td>.*)(\d+)(?=.*<a href="\?a=rank)/g;
        return request.response
            .trim()
            .replace(/\r\n\s*/g, '')
            .match(rankRowRegex)[0];
    }

    getRank(item){
        const rankColumnValue = item
            .children[this.rankColumnIndex]            
            .textContent;

        return rankColumnValue.substring(0, rankColumnValue.length -1); 
    }

    getName(item) {
        return item
            .children[this.nameColumnIndex]
            .querySelector('a b')
            .textContent;
    }

    getPoints(item) {
        return item.children[this.pointsColumnIndex].textContent;
    }
}