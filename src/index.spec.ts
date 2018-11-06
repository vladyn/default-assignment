/// <reference types="sinon" />
declare module NodeJS {
  interface Global {
    sinon: sinon.SinonStatic;
    expect: Chai.ChaiStatic;
  }
}

const chaiLib = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chaiLib.use(sinonChai);
