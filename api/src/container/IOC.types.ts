// prettier-ignore
const TYPES = {
    //pluggable
    BackendStorage: Symbol.for("<BackendStorage>"),
    BackendDatabase: Symbol.for("<BackendDatabase>"),
    BackendLogger: Symbol.for("<BackendLogger>"),
    BackendEmail: Symbol.for("<BackendEmail>"),
    BackendConfig: Symbol.for("<BackendConfig>"),

    // specific storage classes
    AmazonS3Storage: Symbol.for("<AmazonS3Storage>"),
    GoogleCloudStorage: Symbol.for("<GoogleCloudStorage>"),
    MongoDBStorage: Symbol.for("<MongoDBStorage>"),

    //services / providers etc.
    Shell: Symbol.for("<Shell>"),
    Render: Symbol.for("<Render>"),
    StripeService: Symbol.for("<StripeService>"),
    S3Service: Symbol.for("<S3Service>"),
    Route53Service: Symbol.for("<Route53Service>"),
    Routing: Symbol.for("<Routing>"),
    StripeWebhook: Symbol.for("<StripeWebhook>"),
    GitHubAuth: Symbol.for("<GitHubAuth>"),
    RevisionPreview: Symbol.for("<RevisionPreview>"),
    Contact: Symbol.for("<Contact>"),
    SignUp: Symbol.for("<SignUp>"),
    Ping: Symbol.for("<Ping>"),
    //auth
    UserAuth: Symbol.for("<UserAuth>"),
    OrgAuth: Symbol.for("<OrgAuth>"),
    //repos
    UsageRepo: Symbol.for("<UsageRepo>"),
    UserRepo: Symbol.for("<UserRepo>"),
    DataManagerAccountRepo: Symbol.for("<DataManagerAccountRepo>"),
    TagManagerAccountRepo: Symbol.for("<TagManagerAccountRepo>"),
    OrgRepo: Symbol.for("<OrgRepo>"),
    AuditRepo: Symbol.for("<AuditRepo>"),
    AppRepo: Symbol.for("<AppRepo>"),
    EnvironmentRepo: Symbol.for("<EnvironmentRepo>"),
    EventRepo: Symbol.for("<EventRepo>"),
    RevisionRepo: Symbol.for("<RevisionRepo>"),
    TagRepo: Symbol.for("<TagRepo>"),
    PlatformRepo: Symbol.for("<PlatformRepo>"),
    PlatformEventRepo: Symbol.for("<PlatformEventRepo>"),
    PlatformDataContainerRepo: Symbol.for("<PlatformDataContainerRepo>"),
    PlatformDataElementRepo: Symbol.for("<PlatformDataElementRepo>"),
    RuleGroupRepo: Symbol.for("<RuleGroupRepo>"),
    TriggerRepo: Symbol.for("<TriggerRepo>"),
    RuleRepo: Symbol.for("<RuleRepo>"),
    PlatformActionRepo: Symbol.for("<PlatformActionRepo>"),
    PlatformDataMapRepo: Symbol.for("<PlatformDataMapRepo>"),
    ActionRepo: Symbol.for("<ActionRepo>"),
    ConditionRuleRepo: Symbol.for("<ConditionRuleRepo>"),
    DataMapRepo: Symbol.for("<DataMapRepo>"),
    PlatformRevisionRepo: Symbol.for("<PlatformRevisionRepo>"),
    AppPlatformRevisionRepo: Symbol.for("<AppPlatformRevisionRepo>"),
    ActionGroupDistributionRepo: Symbol.for("<ActionGroupDistributionRepo>"),
    ActionGroupRepo: Symbol.for("<ActionGroupRepo>"),
    PlatformAssetRepo: Symbol.for("<PlatformAssetRepo>"),
    OrgRoleRepo: Symbol.for("<OrgRoleRepo>"),
    NotificationRepo: Symbol.for("<NotificationRepo>"),
    InviteRepo: Symbol.for("<InviteRepo>"),
    PasswordResetRepo: Symbol.for("<PasswordResetRepo>"),
    IngestEndpointRepo: Symbol.for("<IngestEndpointRepo>"),
    IngestEndpointRevisionRepo: Symbol.for("<IngestEndpointRevisionRepo>"),
    IngestEndpointDataMapRepo: Symbol.for("<IngestEndpointDataMapRepo>"),
    IngestEndpointEnvironmentRepo: Symbol.for("<IngestEndpointEnvironmentRepo>"),
    RepeatedDataMapRepo: Symbol.for("<RepeatedDataMapRepo>"),
    SessionRepo: Symbol.for("<SessionRepo>"),
    EnvironmentVariableRepo: Symbol.for("<EnvironmentVariableRepo>"),
    PermissionGroupRepo: Symbol.for("<PermissionGroupRepo>"),
    AppPlatformRepo: Symbol.for("<AppPlatformRepo>"),
    GitHubRepo: Symbol.for("<GitHubRepo>"),
    SignUpRequestRepo: Symbol.for("<SignUpRequestRepo>"),
    DependencyRepo: Symbol.for("<DependencyRepo>"),
    PlatformActionPermissionRepo: Symbol.for("<PlatformActionPermissionRepo>"),
    //managers
    UsageManager: Symbol.for("<UsageManager>"),
    UserManager: Symbol.for("<UserManager>"),
    DataManagerAccountManager: Symbol.for("<DataManagerAccountManager>"),
    TagManagerAccountManager: Symbol.for("<TagManagerAccountManager>"),
    OrgManager: Symbol.for("<OrgManager>"),
    AuditManager: Symbol.for("<AuditManager>"),
    RevisionManager: Symbol.for("<RevisionManager>"),
    AppManager: Symbol.for("<AppManager>"),
    TagManager: Symbol.for("<TagManager>"),
    PlatformManager: Symbol.for("<PlatformManager>"),
    EnvironmentManager: Symbol.for("<EnvironmentManager>"),
    PlatformRevisionManager: Symbol.for("<PlatformRevisionManager>"),
    PlatformEventManager: Symbol.for("<PlatformEventManager>"),
    PlatformDataMapManager: Symbol.for("<PlatformDataMapManager>"),
    PlatformDataContainerManager: Symbol.for("<PlatformDataContainerManager>"),
    PlatformActionManager: Symbol.for("<PlatformActionManager>"),
    ActionGroupDistributionManager: Symbol.for("<ActionGroupDistributionManager>"),
    ActionGroupManager: Symbol.for("<ActionGroupManager>"),
    ActionManager: Symbol.for("<ActionManager>"),
    ConditionRuleManager: Symbol.for("<ConditionRuleManager>"),
    DataMapManager: Symbol.for("<DataMapManager>"),
    EventManager: Symbol.for("<EventManager>"),
    RuleGroupManager: Symbol.for("<RuleGroupManager>"),
    TriggerManager: Symbol.for("<TriggerManager>"),
    RuleManager: Symbol.for("<RuleManager>"),
    PlatformAssetManager: Symbol.for("<PlatformAssetManager>"),
    UserNotificationManager: Symbol.for("<UserNotificationManager>"),
    InviteManager: Symbol.for("<InviteManager>"),
    IngestEndpointManager: Symbol.for("<IngestEndpointManager>"),
    IngestEndpointRevisionManager: Symbol.for("<IngestEndpointRevisionManager>"),
    IngestEndpointDataMapManager: Symbol.for("<IngestEndpointDataMapManager>"),
    IngestEndpointEnvironmentManager: Symbol.for("<IngestEndpointEnvironmentManager>"),
    AppPlatformRevisionManager: Symbol.for("<AppPlatformRevisionManager>"),
    PlatformActionPermissionManager: Symbol.for("<PlatformActionPermissionManager>"),
    //auth
    ResolverRegister: Symbol.for("<ResolverRegister>"),
    TypeDefRegister: Symbol.for("<TypeDefRegister>"),
    // logger
    ConsoleLogger: Symbol.for("<ConsoleLogger>"),
    // configuration
    EnvironmentConfig: Symbol.for("<EnvironmentConfig>"),
    // factories
    RepoFromRepoNameFactory: Symbol.for("<RepoFromRepoNameFactory>"),
    ModelFromRepoFactory: Symbol.for("<ModelFromRepoFactory>"),
    RepoFromModelFactory: Symbol.for("<RepoFromModelFactory>"),
    RepoFromManagerFactory: Symbol.for("<RepoFromManagerFactory>"),
    GQLManagersFactory: Symbol.for("<GQLManagersFactory>"),
    AllReposFactory: Symbol.for("<AllReposFactory>"),
    // chained dependency settings
    ChainedDependencies: Symbol.for("<ChainedDependencies>"),
};

export default TYPES;
