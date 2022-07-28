const path = require('path');
const fs = require('fs');
const { showNoTerrainRefsDialog } = require('./messages');

const mergeSchemaArrs = (schema) => (schema.oneOf && schema.anyOf && [...schema.oneOf, ...schema.anyOf]) || schema.anyOf || schema.oneOf;

const getContractSchemas = (projectDir, contractName) => {
  try { // if projectDir is null, it will look for pre-baked contracts in pub/contracts dir
    const parsedSchemas = [];
    const schemaDir = projectDir ? path.join(projectDir, 'contracts', contractName, 'schema') : path.join(__dirname, 'contracts', contractName);
    const schemas = fs.readdirSync(schemaDir, 'utf8').filter((file) => file.endsWith('query_msg.json') || file.endsWith('execute_msg.json'));
    schemas.forEach((file) => {
      const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), 'utf8'));
      schema.msgType = schema.title.toLowerCase().includes('execute') ? 'execute' : 'query';
      mergeSchemaArrs(schema).forEach((props) => {
        const { anyOf, oneOf, title, ...restSchema } = schema;// eslint-disable-line
        parsedSchemas.push({ ...restSchema, ...props });
      });
    });
    return parsedSchemas;
  } catch (e) {
    return null;
  }
};

const validateRefsPath = (refsPath) => {
  try {
    return fs.existsSync(refsPath);
  } catch (e) {
    showNoTerrainRefsDialog();
    return false;
  }
};

function getContractDataFromRefs(projectDir, refsPath) {
  try {
    const refsData = fs.readFileSync(refsPath, 'utf8');
    const { localterra } = JSON.parse(refsData);
    const contracts = Object.keys(localterra).map((name) => {
      const schemas = getContractSchemas(projectDir, name);
      return {
        name,
        path: projectDir,
        address: localterra[name].contractAddresses.default,
        codeId: localterra[name].codeId,
        schemas,
      };
    });
    return contracts;
  } catch {
    showNoTerrainRefsDialog();
  }
}
const getSmartContractData = (projectDir = null) => {
  const p = path.join(projectDir || path.join(__dirname, 'contracts'), 'refs.terrain.json');
  if (validateRefsPath(p)) {
    return getContractDataFromRefs(projectDir, p);
  }
  showNoTerrainRefsDialog();
};

module.exports = { getSmartContractData };
