import * as nextRouter from 'next/router';
import LoggedInTemplate from '../../../../src/components/templates/containers/LoggedInTemplate';
import theme from '../../../../src/theme';
import { ThemeProvider } from '@mui/material';
import { render } from '@testing-library/react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
nextRouter.useRouter = jest.fn();
(nextRouter.useRouter as jest.Mock).mockImplementation(() => ({ route: '/' }));

describe('LoggedInTemplate', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('renders LoggedInTemplate unchanged', () => {
        const { asFragment } = render(
            <ThemeProvider theme={theme}>
                <LoggedInTemplate
                    breadcrumb={<div />}
                    cancelConfirmDialogProps={{
                        open: false,
                        handleCancel: jest.fn(),
                        handleConfirm: jest.fn(),
                        text: 'something',
                    }}
                    sideBarProps={{
                        handleNotificationClick: jest.fn(),
                        userSelectorProps: {
                            loading: false,
                            userName: 'name',
                            userEmail: 'email',
                            handleAccountClick: jest.fn(),
                            handleLogoutClick: jest.fn(),
                        },
                        isAdmin: true,
                        unreadNotifications: 5,
                    }}
                    sideMenu={<div />}
                >
                    <div>
                        <div />
                    </div>
                </LoggedInTemplate>{' '}
            </ThemeProvider>,
        );
        expect(asFragment()).toMatchSnapshot();
    });
});
