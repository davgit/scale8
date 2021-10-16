import { FC, useEffect, useRef, useState } from 'react';
import {
    Divider,
    IconButton,
    lighten,
    ListItem,
    ListItemIcon,
    ListItemText,
    useTheme,
} from '@mui/material';
import AppliedIcon from '../atoms/Icons/AppliedIcon';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import { TagElementListItem } from '../../utils/ElementListUtils';
import { PreviewElementDetails, PreviewElementType } from '../../types/PreviewFrameTypes';

type TagElementListItemProps = {
    item: TagElementListItem;
    itemType: PreviewElementType;
    appliedVerb?: string;
    ruleGroupCompleted?: boolean;
    gotoElement: PreviewElementDetails | undefined;
};

const TagElementReadOnlyListItem: FC<TagElementListItemProps> = (
    props: TagElementListItemProps,
) => {
    const theme = useTheme();
    const { item, itemType, appliedVerb, gotoElement } = props;
    const [showInfoId, setShowInfoId] = useState('');
    const itemRef = useRef<HTMLInputElement>(null);

    const scrollToThis = () => {
        if (itemRef !== null && itemRef.current !== null) {
            itemRef.current.scrollIntoView();
        }
    };

    useEffect(() => {
        if (gotoElement?.type === itemType && gotoElement?.id === item.id) {
            scrollToThis();
        }
    }, [gotoElement, item, itemType]);

    const itemHasErrors = item.log !== undefined && item.log.filter((_) => _.isError).length > 0;

    return (
        <div ref={itemRef}>
            <ListItem disableGutters>
                {item.applied !== undefined && (
                    <ListItemIcon
                        style={{
                            minWidth: '10px',
                            paddingRight: '10px',
                        }}
                    >
                        <AppliedIcon
                            applied={item.applied}
                            verb={appliedVerb === undefined ? 'Applied' : appliedVerb}
                            ruleGroupCompleted={!!props.ruleGroupCompleted}
                        />
                    </ListItemIcon>
                )}
                <ListItemText primary={item.text} />
                {item.log !== undefined && item.log.filter((_) => !_.isError).length > 0 && (
                    <IconButton
                        size="small"
                        disableRipple
                        onClick={() => {
                            setShowInfoId(showInfoId === item.id ? '' : item.id);
                        }}
                        style={{
                            backgroundColor: 'transparent',
                            color: lighten(
                                theme.palette.info.main,
                                showInfoId === item.id ? 0 : 0.8,
                            ),
                            marginLeft: '3px',
                        }}
                    >
                        <InfoIcon />
                    </IconButton>
                )}
                {itemHasErrors && (
                    <WarningIcon
                        style={{
                            backgroundColor: 'transparent',
                            color: theme.palette.error.main,
                            margin: '3px',
                        }}
                    />
                )}
            </ListItem>
            <Divider />
            {(itemHasErrors || showInfoId === item.id) && (
                <div>
                    <div
                        style={{
                            background: '#202225',
                            padding: '8px',
                        }}
                    >
                        {item.log &&
                            item.log
                                .filter((_) => _.isError || showInfoId === item.id)
                                .map((_, index) => (
                                    <div
                                        style={{
                                            color: _.isError ? '#e8847b' : '#dddddd',
                                            fontSize: '14px',
                                            fontFamily: 'monospace',
                                            wordWrap: 'break-word',
                                        }}
                                        key={index}
                                    >
                                        {_.msg}
                                    </div>
                                ))}
                    </div>
                    <Divider />
                </div>
            )}
        </div>
    );
};

export default TagElementReadOnlyListItem;
