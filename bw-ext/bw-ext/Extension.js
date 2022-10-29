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

class Extension {
    static instance = Extension.instance ?? new Extension();

    constructor() {
        this.modules = [];
    }

    register(module) {
        console.log(`Registering module ${module.constructor.name}`);
        this.modules.push(module);
        return this;
    }

    run() {
        this.modules
            .filter(module => module.canExecute === true)
            .forEach(module => module.execute());

        return this;
    }
}