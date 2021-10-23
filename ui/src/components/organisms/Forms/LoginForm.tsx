import { FC } from 'react';
import { Box, Button } from '@mui/material';
import FormTitle from '../../molecules/FormTitle';
import FormError from '../../atoms/FormError';
import LoginLinks from '../../molecules/LoginLinks';
import ControlledTextInput from '../../atoms/ControlledInputs/ControlledTextInput';
import LoggedOutFormContainer from '../../molecules/LoggedOutFormContainer';
import LoginSso from '../../molecules/LoginSso';
import Link from '../../atoms/Next/Link';
import { LoginFormProps } from '../../../types/props/forms/LoginFormProps';
import { useConfigState } from '../../../context/AppContext';
import { toRequestPasswordReset } from '../../../utils/NavigationPaths';
import FormFull from '../../atoms/FormFull';

const LoginForm: FC<LoginFormProps> = (props: LoginFormProps) => {
    const { useGithubSSO } = useConfigState();

    return (
        <LoggedOutFormContainer>
            <Box mb={2}>
                <FormTitle title="Sign in" />
            </Box>
            {props.ssoError !== '' && (
                <Box mb={2} width="100%">
                    <FormError error={props.ssoError} />
                </Box>
            )}
            {props.gqlError && (
                <Box mb={2} width="100%">
                    <FormError error={props.gqlError.message} />
                </Box>
            )}
            {props.reason === 'duplicate' && (
                <Box mb={2} width="100%">
                    <Box fontSize={18} width="100%" textAlign="center">
                        You already have an account with us.
                    </Box>
                    <Box fontSize={18} width="100%" textAlign="center">
                        Please log in or{' '}
                        <Link href={toRequestPasswordReset()} sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                            reset you password
                        </Link>{' '}
                        if needed.
                    </Box>
                </Box>
            )}

            <FormFull handleSubmit={props.handleSubmit}>
                <ControlledTextInput
                    name="email"
                    label="Email Address"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    inputProps={{
                        autoComplete: 'email',
                    }}
                    required
                    fullWidth
                    autoFocus
                />
                <ControlledTextInput
                    name="password"
                    label="Password"
                    formProps={props}
                    variant="outlined"
                    margin="normal"
                    type="password"
                    inputProps={{
                        autoComplete: 'password',
                    }}
                    required
                    fullWidth
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className="formFullMainColorSubmit"
                    disabled={props.isSubmitting}
                >
                    {props.submitText}
                </Button>
            </FormFull>
            <LoginLinks />
            {useGithubSSO && <LoginSso handleGithubButtonClick={props.handleGithubButtonClick} />}
        </LoggedOutFormContainer>
    );
};

export default LoginForm;
