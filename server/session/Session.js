import scriptLoader from './ScriptLoader'
import DataManagers from './managers/DataManagers.js'

class Session {
	_managers = new DataManagers()

	constructor() {
        this.init()
    }

	log(val) {
		console.log(`${this.name} ${val}`);
	}

	get name() {
		return 'Session:: ';
	}

	get managers() {
		return this._managers;
	}

    scriptLoader() {
        return scriptLoader
    }

	test(val) {
		scriptLoader.evalScript('test', val);
	}

    init() {
        this._managers.init()
        this.log('session is initing...')
        this.log('loading the main jsx file')
        scriptLoader.loadJSX('main.jsx')
        this.test()
        this.log('session is inited')
    }
}

let session = new Session();

export default session;
