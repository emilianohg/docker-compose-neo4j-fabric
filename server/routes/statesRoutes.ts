import { Router } from 'express';
import { statesController } from '../controllers/statesController';

class StatesRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', statesController.list);
    }
}


const statesRoutes = new StatesRoutes();

export default statesRoutes.router;
