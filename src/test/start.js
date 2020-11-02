/* eslint-disable no-undef */
const { expect } = require('chai');

describe('Unit Testing', () => {
  it('Should equal 2', () => {
    const result = 1 + 1;
    expect(result).to.eql(2);
  });
});
