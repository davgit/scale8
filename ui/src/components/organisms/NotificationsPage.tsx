import { ChangeEvent, FC, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import { Badge, BadgeProps, Box, Divider } from '@mui/material';
import Tab from '@mui/material/Tab';
import { DialogPageProps } from '../../types/DialogTypes';
import TabsTabPanel from '../molecules/TabsTabPanel';
import { useLoggedInState } from '../../context/AppContext';
import { NotificationsInvites } from '../../dialogPages/global/NotificationsInvites';
import { NotificationsNotifications } from '../../dialogPages/global/NotificationsNotifications';
import { NotificationsSettings } from '../../dialogPages/global/NotificationsSettings';
import { styled } from '@mui/material/styles';

const StyledBadge = styled(Badge)<BadgeProps>(() => ({
    '& .MuiBadge-badge': {
        right: -17,
        top: 10,
    },
}));

const NotificationsPage: FC<DialogPageProps> = (props: DialogPageProps) => {
    const { loggedInUserState } = useLoggedInState();
    const { invites, notifications } = loggedInUserState;

    const [value, setValue] = useState(0);

    const handleChange = (event: ChangeEvent<unknown>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <AppBar position="static" color="default" elevation={0}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab
                        label={
                            <StyledBadge badgeContent={invites} color="secondary">
                                Invites
                            </StyledBadge>
                        }
                        wrapped
                    />
                    <Tab
                        label={
                            <StyledBadge badgeContent={notifications} color="secondary">
                                Notifications
                            </StyledBadge>
                        }
                        wrapped
                    />
                    <Tab label="Settings" wrapped />
                </Tabs>
            </AppBar>
            <Divider />
            <Box p={3} pb={0} minWidth={560} minHeight={430}>
                <TabsTabPanel value={value} index={0}>
                    <NotificationsInvites {...props} />
                </TabsTabPanel>
                <TabsTabPanel value={value} index={1}>
                    <NotificationsNotifications {...props} />
                </TabsTabPanel>
                <TabsTabPanel value={value} index={2}>
                    <NotificationsSettings {...props} />
                </TabsTabPanel>
            </Box>
        </>
    );
};

export default NotificationsPage;
