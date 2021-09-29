import { Request, Response } from 'express';
import { database } from '../database/database'
import dotenv from 'dotenv';

//endpoint
export class CompanyController {

  isAdmin = false;

  constructor() {
    dotenv.config();
    this.isAdmin = (process.env.IS_ADMIN || 'false') == 'true';
  }

  public async list(req: any, res: Response) {
    try {

      const execution = database.session.run(`
        MATCH (c:Company)-[PART_OF]-(s)
        RETURN
          c.companyID as id,
          c.name as name,
          c.address as address,
          c.lat as lat,
          c.lon as lng,
          s as state
      `);

      const nodes = (await execution).records;

      const companies = nodes.map(record => {
        const state = record.get('state');

        console.log(state.properties);
        return {
          id: record.get('id').low,
          name: record.get('name'),
          address: record.get('address'),
          coordinate: {
            latitude: record.get('lat'),
            longitude: record.get('lng'),
          },
          state: {
            id: state.properties.stateID.low,
            name: state.properties.state,
          }
        };
      });
      
      res.json({ 
        ok: true,
        data: companies
      })

    } catch (error) {

      res.status(500).json({
        ok:false,
        msg:error
      });

    }
  }

  public async create(req: Request, res: Response) {
       const { body } = req;

        const query = `
          CALL {
            MATCH (s:State)
            WHERE s.stateID = ${body.stateid}
            RETURN s
          }
          CREATE (c:Company{
            companyID: apoc.create.uuid(),
            name: "${body.name}",
            address: "${body.address}",
            lat: "${body.lat}",
            lon: "${body.lon}"
          })-[r:PART_OF]->(s)
        `

    console.log(query);

        await database.session.run(query).then( _ => {

          res.status(200).json({
            ok: true,
            msg: "Empresa creada con exito."
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
    const { id } = req.params;

    const query = `MATCH (c:Company{companyID:"${id}"})-[r:PART_OF]->() DELETE c,r;`

    await database.session.run(query).then( _ => {

      console.log( _ );

      
      res.status(200).json({ 
        ok:true,
        msg:"Empresa elimianda con exito."
        })
    }).catch( err  => {
        res.status(500).json({
          ok:false,
          msg:err
        })
    })

  }

  public async update(req: Request, res: Response) {

    console.log("entre");


    const { id } = req.params;
    const { body } = req;

    const query = `MATCH (c:Company) WHERE c.companyID = "${id}" SET c.address = "${body.address}", c.name = "${body.name}", c.lat="${body.lat}", c.lon = "${body.lon}" return c`

    await database.session.run(query).then( _ => {

      console.log(_);

      res.status(200).json({ 
        ok:true,
        msg:"Empresa actualiza con exito."
        })
    }).catch( err  => {
        res.status(500).json({
          ok:false,
          msg:err
        })
    })


  }
}


export const companyController = new CompanyController();
