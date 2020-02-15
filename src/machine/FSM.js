import { Machine } from 'xstate';

export default class FSM {
    constructor(machine, actions, services, guards, context) {
        this.machine = Machine(machine).withConfig({actions, services, guards}).withContext(context);
    }
}