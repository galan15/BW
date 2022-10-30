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