import Repo from '../abstractions/Repo';
import User from '../models/User';
import { injectable } from 'inversify';
import { OperationActor, SaveOptions } from '../types/Types';
import { IndexDescription, ObjectId } from 'mongodb';
import OperationOwner from '../../enums/OperationOwner';
import Org from '../models/Org';
import OrgRole from '../models/OrgRole';
import PermissionGroup from '../models/PermissionGroup';
import { fetchOrg } from '../../utils/OrgUtils';

@injectable()
export default class UserRepo extends Repo<User> {
    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                _email: 1,
            },
            unique: true,
        },
        {
            key: {
                _github_user: 1,
            },
            unique: true,
            sparse: true,
        },
        {
            key: {
                _password: 1,
            },
        },
        {
            key: {
                '_github._user_id': 1,
            },
        },
        {
            key: {
                '_sessions._token': 1,
            },
        },
        {
            key: {
                '_temp_sessions._token': 1,
            },
        },
    ];

    public async save(
        model: User,
        actor: OperationActor,
        owner: OperationOwner,
        saveOptions: SaveOptions = {},
    ): Promise<User> {
        model.sessions.slice(0, 5); //only keep 5 sessions? maybe sort this by created at and then slice?
        return super.save(model, actor, owner, saveOptions);
    }

    public async getOrgs(user: User): Promise<Org[]> {
        const orgRoles = await this.repoFactory(OrgRole).find({
            _user_id: user.id,
        });
        return await this.repoFactory(Org).find({
            _id: {
                $in: orgRoles.map((orgRole) => orgRole.orgId),
            },
        });
    }

    public async linkToOrg(
        actor: User | 'SYSTEM',
        user: User,
        org: Org,
        permissionGroup?: PermissionGroup,
    ): Promise<OrgRole> {
        return this.repoFactory(OrgRole).save(
            new OrgRole(org, user, permissionGroup),
            actor,
            actor === 'SYSTEM' ? OperationOwner.SYSTEM : OperationOwner.USER,
        );
    }

    public async convertToOrgUser(
        user: User,
        orgId: ObjectId,
    ): Promise<{
        updated_at: Date;
        org_id: ObjectId;
        last_name: string;
        created_at: Date;
        id: ObjectId;
        first_name: string;
        two_factor_auth: boolean;
        email: string;
        owner: boolean;
    }> {
        const org = await fetchOrg(orgId);
        return {
            id: user.id,
            org_id: org.id,
            first_name: user.firstName,
            last_name: user.lastName,
            two_factor_auth: user.twoFactorAuth,
            email: user.email,
            created_at: user.created_at,
            updated_at: user.updated_at,
            owner: org.orgOwnerUser.equals(user.id),
        };
    }
}
