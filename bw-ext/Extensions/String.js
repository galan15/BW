String.prototype.normalize = function () {
    return this?.toLowerCase() ?? '';
};

String.prototype.capitalizeEachWord = function () {
    return this.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};