import { Request, Response } from 'express';
import { database } from '../database/database'

//endpoint
class CompanyController {

  public async list(req: any, res: Response) {

    try {
      const companies = database.session.run(`MATCH (c:Company)return c`);
      const nodes = (await companies).records[0];
      
      res.json({ 
      ok:true,
      data: nodes 
      })
    } catch (error) {
      res.status(500).json({
        ok:false,
        msg:error
      })

    }
  }

  public async create(req: Request, res: Response) {


  }

  public async getOne(req: Request, res: Response) {

  }





  public async delete(req: Request, res: Response) {


  }

  public async update(req: Request, res: Response) {



  }
}
export const companyController = new CompanyController();