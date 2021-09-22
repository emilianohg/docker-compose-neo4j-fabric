import { Router } from 'express';
import { productController } from '../controllers/productController';



class ProductRoutes {

    router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/',productController.list);
        //pendientes
        this.router.get('/:id',productController.getOne);
        this.router.post('/',productController.create);
        this.router.delete('/:id',productController.delete);
        this.router.put('/:id',productController.update);

    }
}


const productRoutes = new ProductRoutes();

export default productRoutes.router;
