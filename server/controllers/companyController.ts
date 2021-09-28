import { Request, Response } from 'express';
import { database } from '../database/database'

//endpoint
class CompanyController {

  public async list(req: any, res: Response) {

    try {
      const companies = database.session.run(`MATCH (c:Company)return c`);
      const nodes = (await companies).records;
      
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
       const { body } = req;



        const query = `CREATE (empresa: Company{companyID:apoc.create.uuid(), name: "${body.name}", address: "${body.address}", lat: "${body.lat}", lon:${body.lon}});`

        await database.session.run(query).then( _ => {

          console.log(_);

          res.status(200).json({ 
            ok:true,
            msg:"Empresa creada con exito."
            })
        }).catch( err  => {
            res.status(500).json({
              ok:false,
              msg:err
            })
        })



  }

  public async getOne(req: Request, res: Response) {

  }





  public async delete(req: Request, res: Response) {


  }

  public async update(req: Request, res: Response) {



  }
}
export const companyController = new CompanyController();