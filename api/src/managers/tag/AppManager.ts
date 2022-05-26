import Manager from '../../abstractions/Manager';
import { inject, injectable } from 'inversify';
import { gql } from 'apollo-server-express';
import App from '../../mongo/models/tag/App';
import CTX from '../../gql/ctx/CTX';
import { ObjectId } from 'mongodb';
import Revision from '../../mongo/models/tag/Revision';
import Platform from '../../mongo/models/tag/Platform';
import Environment from '../../mongo/models/tag/Environment';
import AppPlatform from '../../mongo/models/tag/AppPlatform';
import GQLError from '../../errors/GQLError';
import TagManagerAccount from '../../mongo/models/tag/TagManagerAccount';
import TYPES from '../../container/IOC.types';
import DataError from '../../errors/DataError';
import userMessages from '../../errors/UserMessages';
import { createApp } from '../../utils/AppUtils';
import BaseDatabase from '../../backends/databases/abstractions/BaseDatabase';
import {
    getCommercialStorageProvider,
    getCommercialStorageProviderConfig,
    getProviderConfigThrows,
    getProviderConfig,
    updateIngestEndpointEnvironment,
} from '../../utils/IngestEndpointEnvironmentUtils';
import GenericError from '../../errors/GenericError';
import { LogPriority } from '../../enums/LogPriority';
import IngestEndpointEnvironment from '../../mongo/models/data/IngestEndpointEnvironment';
import { StorageProvider } from '../../enums/StorageProvider';
import { StorageProviderConfig } from '../../mongo/types/Types';
import Hash from '../../core/Hash';

@injectable()
export default class AppManager extends Manager<App> {
    @inject(TYPES.BackendDatabaseFactory) private backendDatabaseFactory!: (
        storage_provider: StorageProvider,
    ) => BaseDatabase;

    protected gqlSchema = gql`
        """
        The type of \`App\` being created. \`MOBILE\` support will be added soon!
        """
        enum AppType {
            """
            An app that is executed within a web browser context
            """
            WEB
        }

        """
        @model
        """
        type AppPlatform {
            """
            \`Platform\` that is currently linked to this \`AppPlatform\`
            """
            platform: Platform!
            """
            The date the \`AppPlatform\` was created at
            """
            created_at: DateTime!
            """
            The date the \`AppPlatform\` was last updated at
            """
            updated_at: DateTime!
        }

        """
        @type
        """
        type AppGroupingCount {
            key: String!
            user_count: Int!
            event_count: Int!
        }

        """
        @type
        """
        type AppGroupingKeys {
            field: String!
            value: String!
        }

        """
        @type
        """
        type AppGroupingCompKeysCount {
            key: [AppGroupingKeys!]!
            user_count: Int!
            event_count: Int!
        }

        """
        @type
        """
        type AppGroupingCountsResponse {
            from: DateTime!
            to: DateTime!
            result: [AppGroupingCount!]!
        }

        """
        @type
        """
        type AppGroupingCompKeysCountsResponse {
            from: DateTime!
            to: DateTime!
            result: [AppGroupingCompKeysCount!]!
        }

        """
        @type
        """
        type AppGroupingErrors {
            error_id: String!
            error_file: String!
            error_message: String!
            error_column: String!
            error_row: String!
            error_trace: String!
            user_count: Int!
            event_count: Int!
        }

        """
        @type
        """
        type AppGroupingErrorsResponse {
            from: DateTime!
            to: DateTime!
            result: [AppGroupingErrors!]!
        }

        input AppQueryFilterOptions {
            from: DateTime!
            to: DateTime!
            revision: ID
            environment: ID
            utm_source: String
            utm_medium: String
            utm_campaign: String
            utm_term: String
            utm_content: String
            country: String
            region: String
            city: String
            referrer: String
            referrer_tld: String
            page: String
            mobile: Boolean
            browser: String
            browser_version: String
            screen_size: String
            os: String
            event: String
            event_group: String
            custom_release_id: String
            error_id: ID
            error_file: String
            error_message: String
        }

        input AppQueryOptions {
            time_slice: TimeSlice = DAY
            filter_options: AppQueryFilterOptions!
            limit: Int = 10000
        }

        """
        @model
        App is the container for your Tag Revisions and connected Platforms. This model is not under revision control as it is layer above Revisions.
        """
        type App {
            """
            ID of the \`App\`
            """
            id: ID!
            """
            The \`TagManagerAccount\` that contains the \`App\`
            """
            tag_manager_account: TagManagerAccount!
            """
            Name of the Application
            """
            name: String!
            """
            The \`AppType\` associated with this App. Please note that currently on WEB is supported. MOBILE_APP will be introduced soon!
            """
            type: AppType!
            """
            The domain name of the \`App\`
            """
            domain: String!
            """
            Revisions linked to the \`App\`. All \`App\` entities such as \`Tag\`, \`RuleGroup\`, \`Rule\` etc. sit under a revisioning system.
            """
            revisions: [Revision!]!
            """
            All the platforms that a user has connected to (installed on) the \`App\`. The is the master connected list that will appear in revised models.
            """
            app_platforms: [AppPlatform!]!
            """
            Environments connected to the \`App\`. Environments are used to create a fixed deployment of a Revision
            """
            environments: [Environment!]!
            """
            Date the \`App\` was created
            """
            created_at: DateTime!
            """
            Date the \`App\` was last updated
            """
            updated_at: DateTime!
            """
            Average session duration
            """
            average_session_duration_stats(query_options: AppQueryOptions!): IntResponse!
            """
            Bounce ratio
            """
            bounce_ratio_stats(query_options: AppQueryOptions!): FloatResponse!
            """
            Event request stats
            """
            event_request_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Referrers
            """
            referrer_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Referrer TLDs
            """
            referrer_tld_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            UTM Mediums
            """
            utm_medium_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            UTM Sources
            """
            utm_source_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            UTM Campaigns
            """
            utm_campaign_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Pages
            """
            page_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Entry Pages
            """
            entry_page_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Exit Pages
            """
            exit_page_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Countries
            """
            country_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Regions
            """
            region_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Cities
            """
            city_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Devices
            """
            device_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Browsers
            """
            browser_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Browsers Versions
            """
            browser_version_stats(
                query_options: AppQueryOptions!
            ): AppGroupingCompKeysCountsResponse!
            """
            Screen Sizes
            """
            screen_size_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Operating Systems
            """
            operating_system_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Events
            """
            event_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Event Groups
            """
            event_group_stats(query_options: AppQueryOptions!): AppGroupingCountsResponse!
            """
            Errors
            """
            error_stats(query_options: AppQueryOptions!): AppGroupingErrorsResponse!
            """
            Whether the analytics on the \`App\` is enabled
            """
            analytics_enabled: Boolean!
            """
            Whether the error tracking on the \`App\` is enabled
            """
            error_tracking_enabled: Boolean!
            """
            The storage provider used by the \`App\` to track data
            """
            storage_provider: StorageProvider!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Query {
            """
            @bound=App
            Get an App model from the App ID
            """
            getApp(id: ID!): App!
        }

        input AppCreateInput {
            """
            The \`TagManagerAccount\` under which the \`App\` should be created
            """
            tag_manager_account_id: ID!
            """
            The name of the new \`App\` being created
            """
            name: String!
            """
            \`App\`'s domain name
            """
            domain: String!
            """
            The type of \`App\` to be created
            """
            type: AppType!
            """
            The storage provider to be used by the \`App\` to store analytics data
            """
            storage_provider: StorageProvider
            """
            The storage backend.
            """
            storage_backend: StorageBackend
            """
            If the analytics on the \`App\` should be enabled
            """
            analytics_enabled: Boolean!
            """
            If the error tracking on the \`App\` should be enabled
            """
            error_tracking_enabled: Boolean!
        }

        input AppDeleteInput {
            """
            \`APP\` ID to delete against
            """
            app_id: ID!
        }

        """
        Update an \`App\`'s properties. Please note that \`AppType\` can't be changed once a tag has been created.
        """
        input AppUpdateInput {
            """
            \`App\` ID to update data against
            """
            app_id: ID!
            """
            \`App\` name
            """
            name: String
            """
            \`App\`'s domain name
            """
            domain: String
            """
            The storage provider to be used by the \`App\` to store analytics data
            """
            storage_provider: StorageProvider
            """
            The storage backend.
            """
            storage_backend: StorageBackend
            """
            If the analytics on the \`App\` should be enabled
            """
            analytics_enabled: Boolean!
            """
            If the error tracking on the \`App\` should be enabled
            """
            error_tracking_enabled: Boolean!
        }

        input AppInstallPlatformInput {
            """
            \`App\` ID to install the \`Platform\` on
            """
            app_id: ID!
            """
            \`Platform\` ID to install
            """
            platform_id: ID!
        }

        # noinspection GraphQLMemberRedefinition
        extend type Mutation {
            """
            @bound=App
            Create a new \`App\`.
            """
            createApp(appCreateInput: AppCreateInput!): App!
            """
            @bound=App
            Update a \`App\`'s details.
            """
            updateApp(appUpdateInput: AppUpdateInput!): Boolean!
            """
            @bound=App
            Delete a \`App\` and its children.
            """
            deleteApp(appDeleteInput: AppDeleteInput!): Boolean!
            """
            @bound=App
            Install a new \`Platform\`.
            """
            installPlatform(appInstallPlatformInput: AppInstallPlatformInput!): App!
        }
    `;

    // noinspection JSUnusedGlobalSymbols
    /**
     * Mutation Resolvers
     * @protected
     */
    protected gqlExtendedMutationResolvers = {
        deleteApp: async (parent: any, args: any, ctx: CTX) => {
            const data = args.appDeleteInput;
            const app = await this.repoFactory(App).findByIdThrows(
                new ObjectId(data.app_id),
                userMessages.appFailed,
            );
            return this.orgAuth.asUserWithDeleteAccess(ctx, app.orgId, async (me) => {
                //TODO - clean up children. We can't easily automate this task as App is not revised
                await this.repoFactory(App).delete(app, me);
                return true;
            });
        },
        updateApp: async (parent: any, args: any, ctx: CTX) => {
            const data = args.appUpdateInput;
            const app = await this.repoFactory(App).findByIdThrows(
                new ObjectId(data.app_id),
                userMessages.appFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, app.orgId, async (me) => {
                if (app.usageIngestEndpointEnvironmentId === undefined) {
                    throw new GenericError(
                        `Failed to get usage Ingest Endpoint for App: ${app.id.toString()}`,
                        LogPriority.DEBUG,
                    );
                }

                const trackingIngestEndpointEnvironment = await this.repoFactory(
                    IngestEndpointEnvironment,
                ).findByIdThrows(app.usageIngestEndpointEnvironmentId, userMessages.usageFailed);

                const providerConfig = await getProviderConfig(
                    data,
                    trackingIngestEndpointEnvironment,
                );

                await updateIngestEndpointEnvironment(
                    me,
                    trackingIngestEndpointEnvironment,
                    providerConfig,
                );

                app.bulkGQLSet(data, [
                    'name',
                    'domain',
                    'analytics_enabled',
                    'error_tracking_enabled',
                ]); //only is a safety check against this function

                app.storageProviderConfigHash = Hash.hashString(JSON.stringify(providerConfig));

                await this.repoFactory(App).save(app, me);
                return true;
            });
        },
        installPlatform: async (parent: any, args: any, ctx: CTX) => {
            const data = args.appInstallPlatformInput;
            const app = await this.repoFactory(App).findByIdThrows(
                new ObjectId(data.app_id),
                userMessages.appFailed,
            );
            return this.orgAuth.asUserWithEditAccess(ctx, app.orgId, async (me) => {
                const platform = await this.repoFactory(Platform).findByIdThrows(
                    new ObjectId(data.platform_id),
                    userMessages.platformFailed,
                );
                const connectedPlatform = app.appPlatforms.find((_) =>
                    _.platformId.equals(platform.id),
                );
                if (connectedPlatform === undefined) {
                    app.appPlatforms = [...app.appPlatforms, new AppPlatform(platform)];
                }
                return (await this.repoFactory(App).save(app, me)).toGQLType();
            });
        },
        createApp: async (parent: any, args: any, ctx: CTX) => {
            const data = args.appCreateInput;

            const getStorageProviderDetails = async (): Promise<
                [StorageProvider, StorageProviderConfig]
            > => {
                if (this.config.isCommercial()) {
                    return [
                        getCommercialStorageProvider(),
                        await getCommercialStorageProviderConfig(),
                    ];
                }

                return [data.storage_provider, await getProviderConfigThrows(data)];
            };

            const [storageProvider, providerConfig] = await getStorageProviderDetails();

            const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                new ObjectId(data.tag_manager_account_id),
                userMessages.accountFailed,
            );
            return this.orgAuth.asUserWithCreateAccess(ctx, tagManagerAccount.orgId, async (me) => {
                if (
                    (await this.repoFactory(App).count({
                        _tag_manager_account_id: tagManagerAccount.id,
                    })) >= (await this.config.getMaxApps())
                ) {
                    throw new DataError(userMessages.maxApps, true);
                }
                return (
                    await createApp(
                        me,
                        tagManagerAccount,
                        data.name,
                        data.domain,
                        data.type,
                        storageProvider,
                        providerConfig,
                        data.analytics_enabled,
                        data.error_tracking_enabled,
                    )
                ).toGQLType();
            });
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Query Resolvers
     * @protected
     */
    protected gqlExtendedQueryResolvers = {
        getApp: async (parent: any, args: any, ctx: CTX) => {
            const app = await this.repoFactory(App).findByIdThrows(
                new ObjectId(args.id),
                userMessages.appFailed,
            );
            return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                app.toGQLType(),
            );
        },
    };

    // noinspection JSUnusedGlobalSymbols
    /**
     * Custom Resolvers
     * @protected
     */
    protected gqlCustomResolvers = {
        AppPlatform: {
            platform: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.app_id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () => {
                    const appPlatform = app.appPlatforms.find((_) =>
                        _.platformId.equals(parent.platform_id),
                    );
                    if (appPlatform === undefined) {
                        throw new GQLError(userMessages.cantFindPlatform, true);
                    } else {
                        return (
                            await this.repoFactory(Platform).findByIdThrows(
                                appPlatform.platformId,
                                userMessages.platformFailed,
                            )
                        ).toGQLType();
                    }
                });
            },
        },
        App: {
            event_group_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).eventGroups(
                        app,
                        args.query_options,
                    ),
                );
            },
            event_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).events(
                        app,
                        args.query_options,
                    ),
                );
            },
            device_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).devices(
                        app,
                        args.query_options,
                    ),
                );
            },
            browser_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).browsers(
                        app,
                        args.query_options,
                    ),
                );
            },
            browser_version_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).browserVersions(
                        app,
                        args.query_options,
                    ),
                );
            },
            screen_size_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).screenSizes(
                        app,
                        args.query_options,
                    ),
                );
            },
            operating_system_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).operatingSystems(
                        app,
                        args.query_options,
                    ),
                );
            },
            country_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).countries(
                        app,
                        args.query_options,
                    ),
                );
            },
            region_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).regions(
                        app,
                        args.query_options,
                    ),
                );
            },
            city_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).cities(
                        app,
                        args.query_options,
                    ),
                );
            },
            page_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).pages(app, args.query_options),
                );
            },
            entry_page_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).pages(
                        app,
                        args.query_options,
                        'ENTRY',
                    ),
                );
            },
            exit_page_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).pages(
                        app,
                        args.query_options,
                        'EXIT',
                    ),
                );
            },
            utm_medium_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).utms(
                        app,
                        args.query_options,
                        'MEDIUM',
                    ),
                );
            },
            utm_source_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).utms(
                        app,
                        args.query_options,
                        'SOURCE',
                    ),
                );
            },
            utm_campaign_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).utms(
                        app,
                        args.query_options,
                        'CAMPAIGN',
                    ),
                );
            },
            referrer_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).referrers(
                        app,
                        args.query_options,
                    ),
                );
            },
            referrer_tld_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).referrerTlds(
                        app,
                        args.query_options,
                    ),
                );
            },
            event_request_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                if (
                    app.storageProvider === StorageProvider.AWS_S3 ||
                    app.storageProvider === StorageProvider.AWS_KINESIS
                ) {
                    return {
                        result: [],
                        from: new Date(),
                        to: new Date(),
                    };
                }
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).eventRequests(
                        app,
                        args.query_options,
                    ),
                );
            },
            average_session_duration_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).averageSessionDuration(
                        app,
                        args.query_options,
                    ),
                );
            },
            bounce_ratio_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).bounceRatio(
                        app,
                        args.query_options,
                    ),
                );
            },
            error_stats: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    this.backendDatabaseFactory(app.storageProvider).errors(
                        app,
                        args.query_options,
                    ),
                );
            },
            tag_manager_account: async (parent: any, args: any, ctx: CTX) => {
                const tagManagerAccount = await this.repoFactory(TagManagerAccount).findByIdThrows(
                    new ObjectId(parent.tag_manager_account_id),
                    userMessages.accountFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(
                    ctx,
                    tagManagerAccount.orgId,
                    async () => tagManagerAccount.toGQLType(),
                );
            },
            revisions: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () => {
                    return (
                        await this.repoFactory(Revision).find({
                            _app_id: app.id,
                        })
                    ).map((_) => _.toGQLType());
                });
            },
            app_platforms: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () =>
                    app.appPlatforms.map((_) => _.toGQLType({ app_id: app.id.toString() })),
                );
            },
            environments: async (parent: any, args: any, ctx: CTX) => {
                const app = await this.repoFactory(App).findByIdThrows(
                    new ObjectId(parent.id),
                    userMessages.appFailed,
                );
                return await this.orgAuth.asUserWithViewAccess(ctx, app.orgId, async () => {
                    return (
                        await this.repoFactory(Environment).find({
                            _app_id: app.id,
                        })
                    ).map((_) => _.toGQLType());
                });
            },
        },
    };
}
