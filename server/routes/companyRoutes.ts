import { Router } from 'express';
import { companyController } from '../controllers/companyController';



class CompanyRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',companyController.list);
        this.router.post('/create',companyController.create);
        this.router.put('/:id',companyController.update);
        this.router.delete('/:id',companyController.delete);


        
        // this.router.get('/:id',productController.getOne);
        // this.router.post('/',productController.create);
        // this.router.delete('/:id',productController.delete);
        // this.router.put('/:id',productController.update);

    }
}


const companyRoutes = new CompanyRoutes();

export default companyRoutes.router;
