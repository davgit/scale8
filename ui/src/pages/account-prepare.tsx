import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import Head from 'next/head';
import SignUpContainer from '../components/molecules/SignUpContainer';
import Loader from '../components/organisms/Loader';
import { Box } from '@mui/material';
import { TagManagerInstallInstructions } from '../lazyComponents/TagManagerInstallInstructions';
import { useMutation } from '@apollo/client';
import { CompleteSignUp, CompleteSignUp_completeSignUp } from '../gql/generated/CompleteSignUp';
import CompleteSignUpQuery from '../gql/mutations/CompleteSignUpQuery';
import Link from '../components/atoms/Next/Link';
import { useRouter } from 'next/router';
import LoggedOutSection from '../containers/global/LoggedOutSection';
import { toSignUp } from '../utils/NavigationPaths';
import { CompleteSignUpInput } from '../gql/generated/globalTypes';
import { buildSignUpType } from '../utils/SignUpUtils';
import { logError } from '../utils/logUtils';
import { ApolloError } from '@apollo/client/errors';
import { ComponentWithParams, ParamsLoader } from '../components/atoms/ParamsLoader';

type AccountPrepareContentProps = {
    type: string;
    token: string;
    setSignupStatus: Dispatch<SetStateAction<SignupStatus>>;
};

type SignupStatus = {
    completed: boolean;
    completeSignUp?: CompleteSignUp_completeSignUp;
    error?: ApolloError;
    type: string;
    token: string;
};

const AccountPrepareInProgress: FC<AccountPrepareContentProps> = (
    props: AccountPrepareContentProps,
) => {
    const { type, token, setSignupStatus } = props;

    const [complete, { data, error: gqlError }] = useMutation<CompleteSignUp>(CompleteSignUpQuery);

    useEffect(() => {
        localStorage.removeItem('uid');
        localStorage.removeItem('token');

        const completeSignUpInput: CompleteSignUpInput = {
            sign_up_type: buildSignUpType(type),
            token,
        };

        (async () => {
            try {
                await complete({
                    variables: { completeSignUpInput },
                });
            } catch (error) {
                logError(error);
            }
        })();
    });

    useEffect(() => {
        if (gqlError) {
            setSignupStatus({
                completed: true,
                error: gqlError,
                type,
                token,
            });
        }
    }, [gqlError]);

    useEffect(() => {
        const completeSignUp = data?.completeSignUp;
        if (completeSignUp !== undefined) {
            setSignupStatus({
                completed: true,
                completeSignUp,
                type,
                token,
            });
        }
    }, [data]);

    return (
        <>
            <Box fontSize={18} width="100%" textAlign="center">
                We are just setting up your new account
                {type === 'tag-manager' && (
                    <>
                        <br />
                        and configuring your first application
                    </>
                )}
                .<br />
                This should just take a few seconds.
            </Box>
            <Loader />
        </>
    );
};

const AccountPrepareCompleted: FC<{ signupStatus: SignupStatus }> = ({ signupStatus }) => {
    const router = useRouter();

    const completeSignUp = signupStatus.completeSignUp;
    const type = signupStatus.type;

    console.log(signupStatus);

    if (
        completeSignUp === undefined ||
        signupStatus.error ||
        (type === 'tag-manager' && !completeSignUp.environment_id)
    ) {
        return (
            <Box mb={2} width="100%">
                <Box py={10}>
                    <Box fontSize={18} width="100%" textAlign="center">
                        Your sign up request was unsuccessful, please{' '}
                        <Link
                            href={toSignUp({ type: type === 'invite' ? 'tag-manager' : type })}
                            sx={{ color: '#1b1b1b' }}
                        >
                            sign up again
                        </Link>
                        .
                    </Box>
                </Box>
            </Box>
        );
    }

    localStorage.setItem('uid', completeSignUp.uid);
    localStorage.setItem('token', completeSignUp.token);

    if (type !== 'tag-manager') {
        router.push(completeSignUp.url).then();
        return null;
    }

    return (
        <TagManagerInstallInstructions
            environmentId={completeSignUp.environment_id ?? ''}
            link={completeSignUp.url}
            text="I have installed my Tags"
        />
    );
};

const AccountPrepare: ComponentWithParams = ({ params }) => {
    const { type: initialType, target, token: initialToken } = params;
    const type = initialType ?? 'tag-manager';
    const token = initialToken ?? '';

    const [signupStatus, setSignupStatus] = useState<SignupStatus>({
        completed: false,
        type,
        token,
    });

    return (
        <>
            <Head>
                <title>Scale8 - Sign Up</title>
                <meta name="description" content="Scale8 - Sign Up page." />
            </Head>
            <LoggedOutSection>
                <SignUpContainer type={type} target={target} isCompleted={false} isPrepare={true}>
                    {!signupStatus.completed ? (
                        <AccountPrepareInProgress
                            type={type}
                            token={token}
                            setSignupStatus={setSignupStatus}
                        />
                    ) : (
                        <AccountPrepareCompleted signupStatus={signupStatus} />
                    )}
                </SignUpContainer>
            </LoggedOutSection>
        </>
    );
};

const AccountPrepareLoader = () => <ParamsLoader Child={AccountPrepare} />;
export default AccountPrepareLoader;
