import * as inquirer from '@inquirer/prompts'

export interface IPrompter {
    select<T>(config: {message: string; choices: {name: string; value: T}[]}): Promise<T>
    password(config: {message: string}): Promise<string>
}

export class InquirerPrompter implements IPrompter {
    async select<T>(config: {message: string; choices: {name: string; value: T}[]}): Promise<T> {
        return inquirer.select(config)
    }

    async password(config: {message: string}): Promise<string> {
        return inquirer.password(config)
    }
}
