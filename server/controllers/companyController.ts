import { Request, Response } from 'express';
import { database } from '../database/database'
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

//endpoint
export class CompanyController {

  isAdmin = false;

  constructor() {
    dotenv.config();
    this.isAdmin = (process.env.IS_ADMIN || 'false') == 'true';
  }

  public async list(req: any, res: Response) {

    const query = `
      MATCH (c:Company)-[PART_OF]-(s)
      RETURN
        c.companyID as id,
        c.name as name,
        c.address as address,
        c.lat as lat,
        c.lon as lng,
        s as state
    `;

    try {

      const companies = await database.execute((async session => {
        const execution = await session.run(query);
        return execution.records.map(record => {
          return CompanyParser.execute(record);
        });
      }));

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
      RETURN
        c.companyID as id,
        c.name as name,
        c.address as address,
        c.lat as lat,
        c.lon as lng,
        s as state
    `;

    try {

      const company = await database.execute(async session => {
        const execution = await session.run(query);
        const record = execution.records[0];
        return CompanyParser.execute(record);
      });

      res.status(200).json({
        ok: true,
        data: company,
        msg: 'Empresa creada con exito.',
      });

    } catch(error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: error
      });
    }
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    const query = `
      MATCH (c:Company)-[r:PART_OF]->(s)
      WHERE c.companyID = "${id}"
      DELETE c, r
    `;

    console.log(query);

    try {

      await database.execute(async session => {
        const execution = await session.run(query);
      });

      res.status(200).json({
        ok: true,
        data: true,
        msg: 'Empresa elimianda con exito.',
      });

    } catch(error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: error
      });
    }

  }

  public async update(req: Request, res: Response) {

    const { id } = req.params;
    const { body } = req;

    console.log(id);

    const query = `
      MATCH (c:Company)-[PART_OF]-(s)
      WHERE c.companyID = "${id}"
      SET 
        c.address = "${body.address}",
        c.name = "${body.name}",
        c.lat="${body.lat}",
        c.lon = "${body.lon}"
      RETURN
        c.companyID as id,
        c.name as name,
        c.address as address,
        c.lat as lat,
        c.lon as lng,
        s as state
      `;

    try {

      const company = await database.execute(async session => {
        const execution = await session.run(query);
        const record = execution.records;

        return CompanyParser.execute(record[0]);
      });

      res.status(200).json({
        ok: true,
        data: company,
        msg: 'Empresa actualizada con exito.',
      });

    } catch(error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        msg: error
      });
    }


  }

}

class CompanyParser {
  public static execute(record : typeof neo4j.Record): any {
    const state = record.get('state');
    return {
      id: record.get('id'),
      name: record.get('name'),
      address: record.get('address'),
      coordinate: {
        latitude: record.get('lat'),
        longitude: record.get('lng'),
      },
      state: {
        id: state.properties.stateID.low,
        name: state.properties.state,
        country: state.properties.country,
      }
    }
  }
}


export const companyController = new CompanyController();
