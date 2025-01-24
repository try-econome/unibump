import { ForgeExtension } from '@tryforge/forgescript';
import { version } from '../package.json';

export class UniBump extends ForgeExtension {
    name = 'UniBump Utils';
    description = 'A forgescript extension that allows you to view Minecraft Server Statistics';
    version = version;

    public init () {
        this.load(__dirname + '/functions');
    };
};