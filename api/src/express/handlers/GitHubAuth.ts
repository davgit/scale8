import got from 'got';
import { GraphQLClient } from 'graphql-request';
import express from 'express';
import { inject, injectable } from 'inversify';
import TYPES from '../../container/IOC.types';
import UserRepo from '../../mongo/repos/UserRepo';
import Handler from './abstractions/Handler';
import Session from '../../mongo/models/Session';
import GitHub from '../../mongo/models/GitHub';
import OperationOwner from '../../enums/OperationOwner';
import BaseLogger from '../../backends/logging/abstractions/BaseLogger';
import BaseConfig from '../../backends/configuration/abstractions/BaseConfig';
import GenericError from '../../errors/GenericError';
import userMessages from '../../errors/UserMessages';
import { LogPriority } from '../../enums/LogPriority';
import { generateSessionToken } from '../../utils/SessionUtils';
import { ObjectId } from 'mongodb';

@injectable()
export default class GitHubAuth extends Handler {
    @inject(TYPES.UserRepo) private userRepo!: UserRepo;
    @inject(TYPES.BackendLogger) private logger!: BaseLogger;
    @inject(TYPES.BackendConfig) private config!: BaseConfig;

    public getHandler() {
        return async (req: express.Request, res: express.Response) => {
            if (!(await this.config.gitHubSsoEnabled())) {
                throw new GenericError(userMessages.gitHubSsoDisabled, LogPriority.ERROR, true);
            }

            const uiUrl = await this.config.getUiUrl();
            const code = req.query.code;
            const state = req.query.state;
            const requestingUserId =
                typeof state === 'string' && state !== '' ? new ObjectId(state) : null;
            if (typeof code === 'string') {
                try {
                    const { body } = await got.post('https://github.com/login/oauth/access_token', {
                        json: {
                            client_id: await this.config.getGitHubClientId(),
                            client_secret: await this.config.getGitHubClientSecret(),
                            code: code,
                        },
                        responseType: 'json',
                    });
                    const accessToken = (body as any).access_token;
                    const scope = (body as any).scope;
                    const gqlClient = new GraphQLClient('https://api.github.com/graphql', {
                        headers: { Authorization: `bearer ${accessToken}` },
                    });
                    const getGitHubUserEmailQuery: any = await gqlClient.request(
                        `query {
                            viewer {
                                id
                                login
                                email
                                name
                            }
                        }`,
                    );
                    let email = getGitHubUserEmailQuery.viewer.email;
                    if (typeof email === 'string' && email.length === 0) {
                        const { body: emailsBody }: { body: { email: string }[] } = await got.get(
                            'https://api.github.com/user/emails',
                            {
                                responseType: 'json',
                                headers: {
                                    Authorization: `token ${accessToken}`,
                                },
                            },
                        );
                        if (emailsBody.length > 0) {
                            email = emailsBody[0].email;
                        }
                    }
                    const id = getGitHubUserEmailQuery.viewer.id;
                    const username = getGitHubUserEmailQuery.viewer.login;
                    //we have to assume user id in GitHub is immutable...
                    const user = await this.userRepo.findOne({
                        '_github._user_id': id,
                    });
                    const sessionToken = await generateSessionToken();

                    if (user === null) {
                        const requestingUser = requestingUserId
                            ? await this.userRepo.findById(new ObjectId(requestingUserId))
                            : null;
                        if (requestingUser !== null) {
                            // the user exists and he requested to link with github
                            requestingUser.github = new GitHub(
                                id,
                                username,
                                email,
                                [scope],
                                accessToken,
                            );
                            requestingUser.sessions = [
                                new Session(sessionToken),
                                ...requestingUser.sessions,
                            ];
                            res.redirect(
                                `${uiUrl}/sso/success?uid=${(
                                    await this.userRepo.save(requestingUser, 'SYSTEM')
                                ).id.toString()}&token=${encodeURIComponent(sessionToken)}`,
                            );
                        } else {
                            // The request was done with an invalid user id, consider it a new signup
                            res.redirect(
                                `${uiUrl}/sso/new?username=${username}&email=${encodeURI(email)}`,
                            );
                        }
                    } else {
                        //this is a new login...
                        user.sessions = [new Session(sessionToken), ...user.sessions];
                        res.redirect(
                            `${uiUrl}/sso/success?uid=${(
                                await this.userRepo.save(user, 'SYSTEM')
                            ).id.toString()}&token=${encodeURIComponent(sessionToken)}`,
                        );
                    }
                } catch (e: any) {
                    await this.logger.logError(e);
                    res.redirect(`${uiUrl}/sso/failure`);
                }
            } else {
                res.redirect(`${uiUrl}/sso/failure`);
            }
        };
    }
}
