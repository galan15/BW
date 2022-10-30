class Module {
    constructor(model) {
        this.supportedUrl = model.supportedUrl;
    }

    get canExecute() {
        return window.location.search.startsWith(this.supportedUrl);
    }

    execute() {
    }
}