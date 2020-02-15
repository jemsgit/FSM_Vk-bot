import { assign, interpret, State } from 'xstate'
import { debug as Debug } from 'debug';
import menuConfig from './menu-config';
import MachineBuilder from './machine/MachineBuilder';
import crmApi from './crmApi';

let debug = Debug('state');

function getActions() {
    return {
        setUserInfo: assign((context, event) => {
            debug('we are setting')
            return {
                userId: event.value
            }
        }),
        setBookTime: assign((context, event) => {
            debug('we are setting')
            return {
                bookTime: event.value
            }
        }),
        setRoom: assign((context, event) => {
            debug('we are setting')
            return {
                bookTime: event.value
            }
        }),
        setBookPlace: assign((context, event) => {
            return {
                place: event.value
            }
        }),
        setPersonCount: assign((context, event) => {
            return {
                place: event.value
            }
        }),
        setPersonInfo: assign((context, event) => {
            return {
                place: event.value
            }
        }),
        updateRoomsInfo: assign((context, event) => {
            let rooms = event.data.rows.map(item => item.name)
            console.log(rooms)
            return {
                rooms
            }
        }),
        updatePlaceInfo: assign((context, event) => {
            console.log('updatePlaceInfo\r\n\r\n\r\n\r\n\r\n')
            return {
                freePlaces: [23, 25]
            }
        }),
        updateUserInfo: assign((context, event) => {
            return {
                freePlaces: [23, 25]
            }
        })
    }
}

function getServices() {
    return {
        loadPlaces: (context, event) => {
            return crmApi.loadPlaces()
        },
        loadRooms: (context, event) => {
            console.log('loading rooms\r\n\r\n\r\n\r\n\r\n\r\n')
            return crmApi.loadRooms();
        },
        loadUserInfo: (context, event) => {
            return new Promise((resolve, reject) => {
            setTimeout(()=> {
                resolve('12321')
            }, 100)
          })
        },
        book: (context, event) => {
            return new Promise((resolve, reject) => {
            setTimeout(()=> {
                resolve('12321')
            }, 100)
          })
        }
    }
}

function getGuards() {
    return {
        checkRoomSelection: (context, event) => {
            console.log('guard')
            console.log(event)
            return false;
        },
        checkBookTime: (context, event) => {
            console.log('guard2')
            console.log(event)
            return true;
        },
        checkPlaceSelection: (context, event) => {
            console.log('guard3')
            console.log(event)
            return true;
        },
        checkPersonCount: (context, event) => {
            console.log('guard3')
            console.log(event)
            return true;
        }
    }
}

function mergeMeta(meta) {
    return Object.keys(meta).reduce((acc, key) => {
      const value = meta[key];
      // Assuming each meta value is an object
      Object.assign(acc, value);
      return acc;
    }, {});
  }



class StateService {
    constructor() {
        this.machineList = {};
    }

    createMachine(id, state){
        let machine = new MachineBuilder()
            .setId(id)
            .setConfig(menuConfig)
            .setContext({ user: id })
            .setServices(getServices())
            .setActions(getActions())
            .setGuards(getGuards())
            .build();
        console.log(machine);
        this.stopMachine(id);
        this.machineList[id] = {
            ms: this.startMachine(machine, state, id)
        };
        this.machineList[id].state = this.machineList[id].ms.machine.initialState;
        console.log('create')
        console.log(this.machineList)
    }

    stopMachine(id){
        if (this.machineList[id] && this.machineList[id].ms.stop) {
            this.machineList[id].ms.stop();
        }
    }

    startMachine(machine, state, id){
        let initialState;
        if (state){
            initialState = machine.resolveState(State.create(state))
        }
        let machineService = interpret(machine).start(initialState);
        if(this.subscription) {
            machineService.onTransition(this.subscription(id));
        }
        return machineService;
    }

    setSubscription(callback) {
        this.subscription = (id) => (state, context) => {
            console.log(this.machineList);
            if(this.machineList[id]){
                this.machineList[id].state = state;
            }
            callback(state, context);
        }
        console.log('se callacl')
        for(let key in this.machineList) {
            this.machineList[key].ms.onTransition(this.subscription(key))
        }
    }

    transitState(id, action){
        if(!this.machineList[id]) {
            throw Error;
        }
        let nextState = this.machineList[id].ms.send(action);
        console.log('transited to')
        console.log(nextState.value)
        this.machineList[id].state = nextState;
    }

    getStateData(id) {
        if(!this.machineList[id]) {
            throw Error;
        }
        let { state } = this.machineList[id];
        console.log('ask');
        console.log(state.value)
        return mergeMeta(state.meta);
    }

    mapMessageToAction(id, message){
        let stateData = this.getStateData(id);
        if(typeof stateData.mapping === 'function') {
            let actionData = stateData.mapping(message);
            return {
                type: actionData.action
            };
        }
        return {
            type: stateData.mapping[message]
        };
    }

    processUserAction(user, message) {
        if(!this.machineList[user]) {
            this.createMachine(user)
        }
        let action = this.mapMessageToAction(user, message);
        this.transitState(user, action);
    }
}

const stateService = new StateService();

export default stateService;