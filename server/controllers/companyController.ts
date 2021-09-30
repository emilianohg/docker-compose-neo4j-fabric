import { Request, Response } from 'express';
import { database } from '../database/database'
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

//endpoint
export class CompanyController {


  constructor() {
    dotenv.config();
  }

  public static isAdmin(){
    return  (process.env.IS_ADMIN || 'false') == 'true';
  }

  public async list(req: any, res: Response) {
    let query = "";

    if(!CompanyController.isAdmin()) {
      query = `
        MATCH (c:Company)-[PART_OF]-(s)
        RETURN
          c.companyID as id,
          c.name as name,
          c.address as address,
          c.lat as lat,
          c.lon as lng,
          s as state
      `;
    }else{
      query = `
      USE administrator.canada
      MATCH (c:Company)-[PART_OF]-(s)
      RETURN
        c.companyID as id,
        c.name as name,
        c.address as address,
        c.lat as lat,
        c.lon as lng,
        s as state
UNION 
  USE administrator.mexico
      MATCH (c:Company)-[PART_OF]-(s)
      RETURN
        c.companyID as id,
        c.name as name,
        c.address as address,
        c.lat as lat,
        c.lon as lng,
        s as state
        UNION
          USE administrator.usa
      MATCH (c:Company)-[PART_OF]-(s)
      RETURN
        c.companyID as id,
        c.name as name,
        c.address as address,
        c.lat as lat,
        c.lon as lng,
        s as state
      `
    }


    try {

      const companies = await database.execute((async session => {
        const execution = await session.run(query);
        return execution.records.map(record => {
      console.log('eye1');

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

    let query = "";

    console.log(CompanyController.isAdmin());

    if(!CompanyController.isAdmin()){
    query = `
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

    }else{

      query = `
      USE administrator.${body.countryid}
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
      `

    }
    

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
    const { id }        = req.params;
    const { countryid } = req.query;

    let query = "";

    if(!CompanyController.isAdmin()){
    query = `
      MATCH (c:Company)-[r:PART_OF]->(s)
      WHERE c.companyID = "${id}"
      DELETE c, r
    `;
    }else{
      query = `
      USE administrator.${countryid}
      MATCH (c:Company)-[r:PART_OF]->(s)
      WHERE c.companyID = "${id}"
      DELETE c, r
      `
    }


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

    let query = "";

    
    if(!CompanyController.isAdmin()){
    query = `
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
    }else{

      query = `
      USE administrator.${body.countryid}
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
      `

    }


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
    
    console.log(record);

    
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
