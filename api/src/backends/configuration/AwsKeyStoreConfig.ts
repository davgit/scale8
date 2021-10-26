import { inject, injectable } from 'inversify';
import BaseConfig from './abstractions/BaseConfig';
import TYPES from '../../container/IOC.types';
import EnvironmentConfig from './EnvironmentConfig';
import { SecretsManager } from 'aws-sdk';
import { Mode } from '../../enums/Mode';

@injectable()
export default class AwsKeyStoreConfig extends BaseConfig {
    @inject(TYPES.EnvironmentConfig) private readonly environmentConfig!: EnvironmentConfig;
    private config?: { [k: string]: any };

    public async dump() {
        console.log(await this.getConfig());
    }

    private async getSecretsManager(): Promise<SecretsManager | undefined> {
        const awsKeyStoreId = await this.environmentConfig.getAwsKeyStoreId();
        const awsKeyStoreSecret = await this.environmentConfig.getAwsKeyStoreSecret();
        const awsKeyStoreRegion = await this.environmentConfig.getAwsKeyStoreRegion();
        if (awsKeyStoreId !== undefined && awsKeyStoreSecret !== undefined) {
            //if provided, use secrets manager
            return new SecretsManager({
                credentials: {
                    accessKeyId: awsKeyStoreId,
                    secretAccessKey: awsKeyStoreSecret,
                },
                region: awsKeyStoreRegion,
            });
        } else if (this.environmentConfig.getMode() === Mode.COMMERCIAL) {
            //we must use secrets manager...
            return new SecretsManager({
                region: awsKeyStoreRegion, //todo, why is 'region = eu-central-1' in credential not forcing this?
            });
        } else {
            return undefined;
        }
    }

    private async getConfig(): Promise<{ [k: string]: any }> {
        if (this.config === undefined) {
            const secretsManager = await this.getSecretsManager();
            if (secretsManager === undefined) {
                this.config = {};
            } else {
                //need to fetch from AWS Secret Manager...
                this.config = await new Promise<{ [k: string]: any }>((resolve, reject) => {
                    const key = 'SCALE8_' + this.getEnvironment().toUpperCase();
                    secretsManager.getSecretValue(
                        {
                            SecretId: key,
                        },
                        (err, data) => {
                            if (err || data.SecretString === undefined) {
                                reject(`Failed to fetch secrets for ${key}`);
                            } else {
                                resolve(JSON.parse(data.SecretString));
                            }
                        },
                    );
                });
            }
        }
        return this.config;
    }

    async getConfigEntry(key: string): Promise<string | undefined> {
        const value = await this.environmentConfig.getConfigEntry(key);
        if (value === undefined) {
            const config = await this.getConfig();
            return config[key] === undefined ? undefined : config[key].toString();
        } else {
            return value;
        }
    }
}
