import { injectable } from 'inversify';
import dotenv from 'dotenv';
import GenericError from '../../../errors/GenericError';
import { LogPriority } from '../../../enums/LogPriority';
import { Mode } from '../../../enums/Mode';
import { AwsRegion } from '../../../enums/AwsRegion';

dotenv.config();

@injectable()
export default abstract class BaseConfig {
    public abstract dump(): Promise<void>;

    public abstract getConfigEntry(key: string): Promise<string | undefined>;

    private static getFromEnvVar(key: string): string | undefined {
        return process.env[key];
    }

    private static getFromEnvVarOrElse(key: string, orElse: string): string {
        const value = BaseConfig.getFromEnvVar(key);
        return value === undefined ? orElse : value;
    }

    private async getConfigEntryOrElse(key: string, orElse: string): Promise<string> {
        const value = await this.getConfigEntry(key);
        return value === undefined ? orElse : value;
    }

    private async getConfigEntryOrNull(key: string): Promise<string | null> {
        const value = await this.getConfigEntry(key);
        return value === undefined ? null : value;
    }

    private async getConfigEntryThrows(key: string): Promise<string> {
        const value = await this.getConfigEntry(key);
        if (value === undefined) {
            throw new GenericError(
                `Failed to get value for environment variable ${key}`,
                LogPriority.ERROR,
            );
        } else {
            return value;
        }
    }

    public getStorageBackend(): string {
        return BaseConfig.getFromEnvVarOrElse('STORAGE_BACKEND', 'mongodb');
    }

    public getMode(): Mode {
        const mode = BaseConfig.getFromEnvVarOrElse('SERVER_MODE', Mode.SELF_HOSTED);
        return mode === Mode.COMMERCIAL ? Mode.COMMERCIAL : Mode.SELF_HOSTED;
    }

    public isSetupMode(): boolean {
        return BaseConfig.getFromEnvVarOrElse('SETUP_MODE', 'false') === 'true';
    }

    public isCommercial(): boolean {
        return this.getMode() === Mode.COMMERCIAL;
    }

    public isNotCommercial(): boolean {
        return this.getMode() !== Mode.COMMERCIAL;
    }

    public getEnvironment(): string {
        return BaseConfig.getFromEnvVarOrElse('NODE_ENV', 'development');
    }

    public isProduction(): boolean {
        return this.getEnvironment() === 'production';
    }

    public isDevelopment(): boolean {
        return this.getEnvironment() === 'development';
    }

    public getEnvironmentIdPrefix(): string {
        return this.isProduction() ? 'p' : 'd';
    }

    public async useSignup(): Promise<boolean> {
        return this.isCommercial();
    }

    public async emailServerEnabled(): Promise<boolean> {
        return this.isCommercial();
    }

    public async twoFactorAuthEnabled(): Promise<boolean> {
        return this.isCommercial();
    }

    public async gitHubSsoEnabled(): Promise<boolean> {
        return this.isCommercial();
    }

    public async getDataSetName(): Promise<string> {
        return await this.getConfigEntryOrElse(
            'DATA_SET_NAME',
            this.getEnvironment().toLowerCase(),
        );
    }

    public async getAnalyticsDataSetName(): Promise<string> {
        return await this.getConfigEntryOrElse(
            'ANALYTICS_DATA_SET_NAME',
            this.getEnvironment().toLowerCase() + '_analytics',
        );
    }

    public async getApiHttpPort(): Promise<number> {
        return Number(await this.getConfigEntryOrElse('API_HTTP_PORT', '8082'));
    }

    public async getApiHttpsPort(): Promise<number> {
        return Number(
            await this.getConfigEntryOrElse('API_HTTPS_PORT', this.isProduction() ? '443' : '8443'),
        );
    }

    public async getCdnDomain(): Promise<string> {
        return await this.getConfigEntryOrElse(
            'S8_EDGE_SERVER',
            this.isProduction() ? 'cdn.scale8.com' : 'cdn-dev.scale8.com',
        );
    }

    public async getUiUrl(): Promise<string> {
        const getDefaultUiUrl = () => {
            if (this.isCommercial()) {
                if (this.isProduction()) {
                    return 'https://ui.scale8.com';
                } else {
                    return 'https://ui-dev.scale8.com:8443';
                }
            } else {
                return 'http://127.0.0.1:3000';
            }
        };
        return await this.getConfigEntryOrElse('S8_UI_SERVER', getDefaultUiUrl());
    }

    public async getDefaultAdminPassword(): Promise<string> {
        return await this.getConfigEntryOrElse('DEFAULT_ADMIN_PASS', 'testing');
    }

    public async getGCJson(): Promise<string> {
        return await this.getConfigEntryThrows('GC_JSON');
    }

    public async getAssetBucket(): Promise<string> {
        return await this.getConfigEntryOrElse(
            'ASSET_BUCKET',
            `scale8_com_${this.getEnvironment().toLowerCase()}_assets`,
        );
    }

    public async getConfigsBucket(): Promise<string> {
        return await this.getConfigEntryOrElse(
            'CONFIGS_BUCKET',
            `scale8_com_${this.getEnvironment().toLowerCase()}_configs`,
        );
    }

    public async getMaxOrgs(): Promise<number> {
        return Number(await this.getConfigEntryOrElse('MAX_ORGS', '5'));
    }

    public async getMaxApps(): Promise<number> {
        return Number(await this.getConfigEntryOrElse('MAX_APPS', '5'));
    }

    public async getMaxIngestEndpoints(): Promise<number> {
        return Number(await this.getConfigEntryOrElse('MAX_INGEST_ENDPOINTS', '5'));
    }

    public async getMaxRevisionElements(): Promise<number> {
        return Number(await this.getConfigEntryOrElse('MAX_REVISION_ELEMENTS', '750'));
    }

    public getAwsKeyStoreId(): string | undefined {
        return BaseConfig.getFromEnvVar('AWS_KEY_STORE_ID');
    }

    public getAwsKeyStoreSecret(): string | undefined {
        return BaseConfig.getFromEnvVar('AWS_KEY_STORE_SECRET');
    }

    public getAwsKeyStoreRegion(): string {
        return BaseConfig.getFromEnvVarOrElse('AWS_KEY_STORE_REGION', 'eu-central-1');
    }

    public async getDefaultDatabase(): Promise<string> {
        return await this.getConfigEntryOrElse('DEFAULT_DATABASE', 's8');
    }

    public async getGitHubLoginScope(): Promise<string> {
        return await this.getConfigEntryOrElse('GITHUB_LOGIN_SCOPE', 'user:email');
    }

    public async getGitHubClientId(): Promise<string> {
        return await this.getConfigEntryThrows('GITHUB_CLIENT_ID');
    }

    public async getGitHubClientSecret(): Promise<string> {
        return await this.getConfigEntryThrows('GITHUB_CLIENT_SECRET');
    }

    public async getAwsId(): Promise<string | null> {
        return await this.getConfigEntryOrNull('AWS_ID');
    }

    public async getAwsSecret(): Promise<string> {
        return await this.getConfigEntryThrows('AWS_SECRET');
    }

    public async getAwsRegion(): Promise<AwsRegion> {
        return (await this.getConfigEntryThrows('AWS_REGION')) as AwsRegion;
    }

    public async getDatabaseUrl(): Promise<string> {
        return await this.getConfigEntryOrElse('MONGO_CONNECT_STRING', 'mongodb://127.0.0.1:27017');
    }

    public async isTransactionSupport(): Promise<boolean> {
        return (await this.getConfigEntryOrElse('DATABASE_TRANSACTIONS', 'false')) === 'true';
    }

    //todo. test this enabled.
    public async isAuditEnabled(): Promise<boolean> {
        return (await this.getConfigEntryOrElse('AUDIT_ENABLED', 'false')) === 'true';
    }

    public async getRoute53HostedZoneId(): Promise<string> {
        return await this.getConfigEntryThrows('HOSTED_ZONE_ID');
    }

    public async getSMTPHost(): Promise<string> {
        return await this.getConfigEntryThrows('SMTP_HOST');
    }

    public async getSMTPUser(): Promise<string> {
        return await this.getConfigEntryThrows('SMTP_USERNAME');
    }

    public async getSMTPPassword(): Promise<string> {
        return await this.getConfigEntryThrows('SMTP_PASSWORD');
    }

    public async trackDependencies(): Promise<boolean> {
        return (await this.getConfigEntryOrElse('TRACK_DEPENDENCIES', 'false')) === 'true';
    }

    public async isCaptchaEnabled(): Promise<boolean> {
        return (await this.getConfigEntryOrElse('CAPTCHA_ENABLED', 'true')) === 'true';
    }

    public async getCaptchaSecret(): Promise<string> {
        return await this.getConfigEntryThrows('CAPTCHA_SECRET');
    }

    public async getAirbrakeId(): Promise<string> {
        return await this.getConfigEntryThrows('AIRBRAKE_ID');
    }

    public async getAirbrakeKey(): Promise<string> {
        return await this.getConfigEntryThrows('AIRBRAKE_KEY');
    }

    public async getStripeSecretKey(): Promise<string> {
        return await this.getConfigEntryThrows('STRIPE_SECRET_KEY');
    }

    public async getStripeWebhookSecret(): Promise<string> {
        return await this.getConfigEntryThrows('STRIPE_WEBHOOK_SECRET');
    }

    public async getEncryptionSalt(): Promise<string> {
        return await this.getConfigEntryOrElse('ENCRYPTION_SALT', 'replace_me');
    }
}
