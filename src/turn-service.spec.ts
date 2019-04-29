import turnService from './turn-service';
const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

require('jsdom-global')();

chai.use(sinonChai);
const {
  expect, use, should, assert,
} = require('chai');

describe('Turn service', () => {
  it('should return a correct player turn', function () {
    const plyerMove = 'player-tow';
    console.log(turnService());
  });
});
