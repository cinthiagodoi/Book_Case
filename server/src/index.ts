import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import * as cors from 'cors';
import {User} from "./entity/User";

declare global {
	namespace Express {
			interface Request {
					user: {}
			}
	}
}

createConnection().then(async connection => {

    
    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (route.middleware !== undefined ? route.middleware : []), (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3333);

    console.log("Express server has started on port 3333. Open http://localhost:3333/users to see results");

}).catch(error => console.log(error));
