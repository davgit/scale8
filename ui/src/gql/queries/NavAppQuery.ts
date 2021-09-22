import { gql } from '@apollo/client';
import { UserOrgList } from '../fragments/UserOrgList';
import { OrgUserDetails } from '../fragments/OrgUserDetails';

const NavAppQuery = gql`
    query NavApp($id: ID!) {
        getApp(id: $id) {
            id
            name
            analytics_enabled
            storage_provider
            tag_manager_account {
                id
                apps {
                    id
                    name
                }
                org {
                    ...orgUserDetails
                }
            }
        }
        me {
            ...userOrgList
        }
    }
    ${OrgUserDetails}
    ${UserOrgList}
`;

export default NavAppQuery;
