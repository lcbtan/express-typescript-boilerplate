import * as request from 'request';
import { Container } from 'inversify';
import { my } from 'my-express';
import { Log } from '../../core/log';
import { UserService } from '../services/UsersService';

// const log = new Log('api:middleware.populateUser');

/**
 * populateUser middleware
 * -----------------------
 * This middleware gets the logged-in user form the database and store it in
 * the request object
 *
 * @param req
 * @param res
 * @param next
 */
export const populateUser = (lazyUserService: () => UserService, log: Log) =>
    (req: my.Request, res: my.Response, next: my.NextFunction) => {

        if (!req.tokeninfo || !req.tokeninfo.user_id) {
            return res.failed(400, 'Missing token information!');
        }

        const userService = lazyUserService();
        userService.findByUserId(req.tokeninfo.user_id)
            .then((user) => {
                req.user = user.toJSON();
                log.debug(`populated user with the id=${req.user.id} to the request object`);
                next();
            })
            .catch((error) => {
                log.warn(`could not populate user to the request object`);
                next(error);
            });
    };
