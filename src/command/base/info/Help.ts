import { Message, Markdown } from 'gamejolt.js';
import { Command } from '../../Command';
import { CommandTypes } from '../../../types/CommandTypes';
import { Collection } from '../../../util/Collection';
import { Permissions } from '../../../types/Permissions';

export default class extends Command {
    public constructor() {
        super({
            name: 'help',
            description: 'Get command help.',
            usage: '<prefix> help',
            extraHelp: '',
            type: 'info'
        });
    }

    public async invoke(message: Message, [commandName]: [string]): Promise<void> {
        let command: Command;
        let output: string;

        const pm: boolean = message.room.type === 'pm';

        if (!pm && !this.client.isOwner(message.user)) return;

        if (!commandName) {

            let commands: Collection<string, Command> = this.client.commands;
            let commandsList: string = commands.map(c =>
                `\n\`${c.name}\` : ${c.description}`)
                .sort()
                .join('\n');

            output = commandsList;

        } else {
            command = this.client.commands
                .find(c => c.name === commandName || c.aliases.includes(commandName));

            // Find by type if cannot be found by name 
            if (!command) {
                let commands: Collection<string, Command> = this.client.commands.findByType(commandName)
                                      .filter(c => !(!this.client.isOwner(message.user) && c.ownerOnly))
                                      .filter(c => message.user.permissionLevel >= c.permissionLevels );
 
                if (commands.size > 0) {
                    let commandsList: string = commands.map(c =>
                        `\n\`${c.name}\` : ${c.description}`)
                        .sort()
                        .join('\n');

                    output = commandsList;
                } else
                    return message.reply(`'${commandName}' is not a valid command name or type.`);
            } else {
                output = `\n \`Command:\` ${command.name} \n
                          \r \`Description:\` ${command.description} \n
                          \r \`Usage:\` ${command.usage} \n
                          \r \`Type:\` ${command.type} \n
                          \r \`Aliases:\` ${command.aliases.join(', ')}`
            }
        }
        return message.reply(output);
    }
}