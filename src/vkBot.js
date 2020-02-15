import VkBotAPI from 'node-vk-bot-api';
import Markup from 'node-vk-bot-api/lib/markup';
import userCache from './userCache';
import stateService from './stateService';
import { debug as Debug } from 'debug';

let debug = Debug('vk');

function VkBot(apiKey, groupId) {
    this.apiKey = apiKey;
    this.bot = new VkBotAPI({
        token:this.apiKey,
        group_id: groupId
    });
    this.initHandlers();

}

VkBot.prototype.startBot = function() {
    debug('start bot', this.bot)
    
    this.bot.startPolling(function() {
        debug('polling started')
    }, function(er){
        debug(er)
    })
}

VkBot.prototype.initHandlers = function() {
    this.bot.on((ctx) => {
        var user = ctx.message.user_id;
        console.log(ctx.message);
        var message = ctx.message.body;
        this.processMessage(message, user);
    })
    logUsage();
    stateService.setSubscription((state, context) => {
        process.nextTick(() => {
            this.sendMessage(state)
        })
    })
}

VkBot.prototype.processMessage = function(incomeMessage, user) {
    let nextState;
    try {
        nextState = stateService.processUserAction(user, incomeMessage)
        userCache.setUserState(user, nextState);
    } catch(e) {
        console.error(e);
    }
}

VkBot.prototype.sendMessage = function(state) {
    console.log(state.changed);
    console.log(state.value);
    if (state.changed) {
        let stateData = stateService.getStateData(state.context.user);
        console.log(state.context)
        let { text, buttons } = stateData;
        if(typeof(text) === 'function'){
            text = text(state.context)
        }
        buttons = buttons && buttons.length ? Markup.keyboard(buttons, { columns: 2 }).oneTime() : undefined
        this.bot.sendMessage(state.context.user, text, null, buttons);
    }
}

function logUsage(){
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
}

module.exports = VkBot;