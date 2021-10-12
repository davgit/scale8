import { SummaryDetailProps } from '../components/atoms/SummaryDetail';
import { abbreviateNumber, displayTime, kebabToTitleCase } from './TextUtils';
import { calculateDeltaPercentage, roundNumber } from './MathUtils';
import { AppQueryOptions, StorageProvider } from '../gql/generated/globalTypes';

export type GroupingCount = {
    key: string;
    count: number;
};

export type AppGroupingCount = {
    key: string;
    user_count: number;
    event_count: number;
};

export type AppGroupingNameVersionCount = {
    name: string;
    version: string;
    user_count: number;
    event_count: number;
};

export const buildSummaryDetailPropsFromValue = (
    title: string,
    value: number,
    prevValue?: number,
    valueType: 'number' | 'percentage' | 'time' = 'number',
    negativeIsGood = false,
): SummaryDetailProps => {
    if (prevValue === undefined) {
        return {
            title,
            value: abbreviateNumber(value),
        };
    }

    const deltaPercentage = calculateDeltaPercentage(value, prevValue);

    const percentagePositive = deltaPercentage > 0;

    const calculateOutcome = () => {
        if (deltaPercentage === 0) return undefined;
        const outcomeBool = negativeIsGood ? !percentagePositive : percentagePositive;
        return outcomeBool ? 'p' : 'n';
    };

    const calculateValue = (): string => {
        switch (valueType) {
            case 'time':
                return displayTime(value);
            case 'percentage':
                return `${value}%`;
            default:
                return abbreviateNumber(value);
        }
    };

    return {
        title,
        value: calculateValue(),
        percentage: roundNumber(Math.abs(deltaPercentage), 0),
        trend: deltaPercentage === 0 ? undefined : percentagePositive ? 'u' : 'd',
        outcome: calculateOutcome(),
    };
};

export const getEventLabel = (appQueryOptions: AppQueryOptions): string =>
    kebabToTitleCase(
        appQueryOptions.filter_options.event ??
            appQueryOptions.filter_options.event_group ??
            'page-views',
    );

export const calculateEventsPerUser = (eventCount: number, userCount: number): number => {
    if (userCount === 0) {
        return 0;
    }

    return eventCount / userCount;
};

export const analyticsEnabled = (entity: {
    analytics_enabled: boolean;
    storage_provider: StorageProvider;
}) => {
    return entity.analytics_enabled && entity.storage_provider !== StorageProvider.AWS_S3;
};
