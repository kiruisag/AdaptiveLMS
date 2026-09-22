import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNavigationTree } from './navigation.api';

test('normalizeNavigationTree keeps valid nodes and sorts by sort_order', () => {
  const tree = normalizeNavigationTree([
    { key: 'zeta', name: 'Z', sort_order: 20, children: [{ key: 'leaf-z', name: 'Leaf Z', sort_order: 5 }], url: null, type: 'group' },
    { key: 'alpha', name: 'A', sort_order: 10, children: [{ key: 'leaf-a', name: 'Leaf A', sort_order: 2 }] },
    null as any,
  ]);

  assert.deepEqual(tree.map((node) => node.key), ['alpha', 'zeta']);
  assert.equal(tree[0].children?.[0].key, 'leaf-a');
  assert.equal(tree[1].children?.[0].key, 'leaf-z');
});

test('normalizeNavigationTree defaults missing values safely', () => {
  const tree = normalizeNavigationTree([
    { key: 'broken', name: 'Broken' },
  ]);

  assert.equal(tree[0].type, 'group');
  assert.equal(tree[0].url, '#');
  assert.equal(tree[0].scope, 'shared');
  assert.deepEqual(tree[0].children, []);
});

test('normalizeNavigationTree handles nested menu trees recursively', () => {
  const tree = normalizeNavigationTree([
    {
      key: 'platform',
      name: 'Platform',
      type: 'group',
      children: [
        {
          key: 'platform.users',
          name: 'Users',
          url: '/users',
          type: 'link',
          children: [{ key: 'platform.users.details', name: 'Details', url: '/users/:id', type: 'link' }],
        },
      ],
    },
  ]);

  assert.equal(tree[0].children?.[0].key, 'platform.users');
  assert.equal(tree[0].children?.[0].children?.[0].key, 'platform.users.details');
});
