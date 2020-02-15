import FSM from './FSM';

export default class MachineBuilder {
    constructor() {
        this.config = null;
        this.actions = null;
        this.context = null;
    }

    setConfig(config) {
        this.config = createMachineConfig(config);
        return this;
    }

    setActions(actions) {
        this.actions = actions;
        return this;
    }

    setServices(services) {
        this.services = services;
        return this;
    }

    setContext(context){
        this.context = context;
        return this;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    setGuards(guards) {
        this.guards = guards;
        return this;
    }

    build() {
        let config = { ...this.config };
        config.id = this.id || config.id;
        let fsm = new FSM(config, this.actions, this.services, this.guards, this.context);
        return fsm.machine;
    }
}

function createMachineConfig(config) {
    let states = {};
    let transitions = {};
    for(var state in config.machine) {
        let newState = addState(states, transitions, state, config.machine[state]);
        states = newState.state;
        transitions = newState.transitions;
    }
    let machine = {
        id: config.id,
        initial: config.initial,
        states: states,
        context: {
            
        },
        on: transitions
    }
    return machine;
}


function addState(initialState, machineTransitions, state, params){
    let machineStates = {
        ...initialState
    };

    machineStates[state] = {
        exit: params.exit,
        entry: params.entry,
        invoke: params.invoke,
        meta: {
            text: params.text,
            buttons: params.buttons,
            mapping: params.mapping
        }
    }

    machineTransitions = {
        ...machineTransitions,
        ...params.on
    }

    if(params.children) {
        for(let key in params.children) {
            let newState = addState(machineStates, machineTransitions, key, params.children[key]);
            machineStates = newState.state;
            machineTransitions = newState.transitions;
        }
    }
    return {
        state: machineStates,
        transitions: machineTransitions
    }
}