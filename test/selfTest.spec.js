import { assert } from 'chai'

describe('Simple Test', function() {
  it('should return 2 when adding 1 + 1', function() {
    assert.equal(1 + 1, 2)
  })
  it('should return false on unequal objects', function() {
    assert.notDeepEqual({ banana: 'yes' }, { banana: 'no' })
  })
})
