import { gql } from '@apollo/client';

const ConfigQuery = gql`
    query ConfigQueryData {
        config {
            is_configured
            is_dev
            mode
            use_signup
            use_email
            use_github_sso
            use_two_factor_auth
            is_audit_enabled
            stripe_publishable
            captcha_publishable
            consent_purposes {
                id
                name
            }
            consent_vendors {
                id
                name
            }
            tag_manager_products {
                id
                name
                amount
                page_views
            }
            data_manager_products {
                id
                name
                amount
                requests
                gbs
            }
        }
    }
`;

export default ConfigQuery;
