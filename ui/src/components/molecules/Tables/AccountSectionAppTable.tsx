import { FC, useMemo } from 'react';
import {
    Box,
    Button,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    Tooltip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useRouter } from 'next/router';
import { toApp, toTagManager } from '../../../utils/NavigationPaths';
import { SxProps } from '@mui/system';

export type AccountSectionAppTableProps = {
    applications: { name: string; pageViews: number[]; id: string }[];
    tmId: string;
};

const AccountSectionAppTable: FC<AccountSectionAppTableProps> = (
    props: AccountSectionAppTableProps,
) => {
    const router = useRouter();

    const { applications, tmId } = props;

    if (applications.length === 0) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    router.push(toTagManager({ id: tmId }, 'apps')).then();
                }}
                sx={{
                    color: '#ffffff',
                    backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    width: '100%',
                    '&:hover': {
                        color: '#ffffff',
                        backgroundColor: (theme) => theme.palette.tagManagerColor.main,
                    },
                }}
                color="inherit"
                disableElevation
            >
                Manage Applications
            </Button>
        );
    }

    const headerCell: SxProps<Theme> = {
        paddingLeft: 0,
    };

    const contentCell: SxProps<Theme> = {
        paddingLeft: 0,
        borderBottom: 0,
        '&:last-of-type': {
            paddingLeft: 0,
            paddingRight: 0,
        },
    };

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={headerCell}>Applications</TableCell>
                        <TableCell sx={headerCell}>Page views</TableCell>
                        <TableCell sx={headerCell} align="right" />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {applications.map((app) => (
                        <TableRow key={app.id}>
                            <TableCell sx={contentCell}>{app.name}</TableCell>
                            <TableCell sx={contentCell}>
                                <Box width={150}>
                                    <Sparklines data={app.pageViews} width={150} height={20}>
                                        <SparklinesLine
                                            style={useMemo(() => ({ fill: 'none' }), [])}
                                        />
                                    </Sparklines>
                                </Box>
                            </TableCell>
                            <TableCell sx={contentCell} align="right">
                                <Tooltip title="Select Application">
                                    <IconButton
                                        onClick={() => {
                                            router.push(toApp({ id: app.id })).then();
                                        }}
                                        aria-label="Select Application"
                                        size="large"
                                    >
                                        <ArrowForwardIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export { AccountSectionAppTable };
