import { Router } from 'express';
import { companyController } from '../controllers/companyController';



class CompanyRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',companyController.list);
        
        // this.router.get('/:id',productController.getOne);
        // this.router.post('/',productController.create);
        // this.router.delete('/:id',productController.delete);
        // this.router.put('/:id',productController.update);

    }
}


const companyRoutes = new CompanyRoutes();

export default companyRoutes.router;
