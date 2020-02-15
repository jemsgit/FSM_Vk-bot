
import VkBot from './vkBot';
import { config } from './config';

function app() {
    let vkbot = new VkBot(config.botApiKey, config.groupId);
    vkbot.startBot();
}

app()