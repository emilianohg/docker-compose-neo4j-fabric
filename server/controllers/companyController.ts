import { Request,Response } from 'express';


//endpoint
class CompanyController {

  public async list (req:any,res:Response) {

      try {

        // const companies = 
        // const res  = await session.run(" MATCH (c:Company),(s:State) WHERE c.companyID = 1 AND s.id = 59 CREATE (c)-[:PART_OF]->(s) RETURN c, s ");
      } catch (error) {
        
      }

}

public async create (req: Request, res:Response) {


}

  public async getOne (req: Request, res:Response) {

  }





  public async delete (req:Request,res:Response){
  

 }

  public async update (req:Request,res:Response){

   

}
}
export const companyController = new CompanyController();