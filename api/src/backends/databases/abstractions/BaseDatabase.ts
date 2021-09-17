import { injectable } from 'inversify';
import App from '../../../mongo/models/tag/App';
import IngestEndpoint from '../../../mongo/models/data/IngestEndpoint';

export interface BaseQueryOptions {
    time_slice: string;
    filter_options: {
        from: number;
        to: number;
        revision?: string;
        environment?: string;
    };
    limit: number;
}

export interface AppQueryOptions extends BaseQueryOptions {
    filter_options: {
        from: number;
        to: number;
        revision?: string;
        environment?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
        utm_term?: string;
        utm_content?: string;
        country?: string;
        referrer?: string;
        referrer_tld?: string;
        page?: string;
        mobile?: boolean;
        browser?: string;
        os?: string;
        event?: string;
        event_group?: string;
    };
}

export interface IngestQueryOptions extends BaseQueryOptions {
    filter_options: {
        from: number;
        to: number;
        revision?: string;
        environment?: string;
    };
}

@injectable()
export default abstract class BaseDatabase {
    protected getRangeFromAsDate(options: BaseQueryOptions): Date {
        return new Date(options.filter_options.from);
    }

    protected getRangeToAsDate(options: BaseQueryOptions): Date {
        return new Date(options.filter_options.to);
    }

    protected getResultWithRange(
        queryOptions: AppQueryOptions,
        result: any,
    ): {
        result: any;
        from: Date;
        to: Date;
    } {
        return {
            from: this.getRangeFromAsDate(queryOptions),
            to: this.getRangeToAsDate(queryOptions),
            result,
        };
    }

    public abstract averageSessionDuration(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }>;

    public abstract bounceRatio(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{ result: number; from: Date; to: Date }>;

    public abstract eventRequests(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract referrers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract referrerTlds(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract utms(
        app: App,
        queryOptions: AppQueryOptions,
        utmFilter: 'MEDIUM' | 'SOURCE' | 'CAMPAIGN',
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract pages(
        app: App,
        queryOptions: AppQueryOptions,
        pageFilter?: 'ENTRY' | 'EXIT',
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract countries(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract devices(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract eventGroups(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract events(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract browsers(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract operatingSystems(
        app: App,
        queryOptions: AppQueryOptions,
    ): Promise<{
        result: { key: string; user_count: number; event_count: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract usage(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{
        result: { key: string; requests: number; bytes: number }[];
        from: Date;
        to: Date;
    }>;

    public abstract requests(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }>;

    public abstract bytes(
        ingestEndpoint: IngestEndpoint,
        queryOptions: IngestQueryOptions,
    ): Promise<{ result: { key: string; count: number }[]; from: Date; to: Date }>;
}
