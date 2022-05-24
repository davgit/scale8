import { gql } from '@apollo/client';

const SignUpQuery = gql`
    mutation SignUp($signUpInput: SignUpInput!) {
        signUp(signUpInput: $signUpInput) {
            email
            request_token
        }
    }
`;

export default SignUpQuery;
