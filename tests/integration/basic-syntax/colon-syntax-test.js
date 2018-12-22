import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('basic syntax: colon-syntax', function(hooks) {
  test('basic', function (assert) {
    const emblem = 'each foo: p Hello, #{this}';

    assert.compilesTo(emblem, '{{#each foo}}<p>Hello, {{this}}</p>{{/each}}');
  });

  test('html stack', function (assert) {
    const emblem = '.container: .row: .span5: span Hello';

    assert.compilesTo(emblem, '<div class="container"><div class="row"><div class="span5"><span>Hello</span></div></div></div>');
  });

  test('epic', function (assert) {
    const emblem = '.container: .row: .span5\n  ul#list data-foo="yes": each foo: li\n    span: this';

    assert.compilesTo(emblem, '<div class="container"><div class="row"><div class="span5"><ul id="list" data-foo="yes">{{#each foo}}<li><span>{{this}}</span></li>{{/each}}</ul></div></div></div>');
  });

  test('html stack elements only', function (assert) {
    const emblem = 'p: span: div: p: foo';

    assert.compilesTo(emblem, '<p><span><div><p>{{foo}}</p></div></span></p>');
  });

  test('mixed separators', function (assert) {
    const emblem = '.fun = each foo: %nork = this';

    assert.compilesTo(emblem, '<div class="fun">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>');
  });

  test('mixed separators rewritten', function (assert) {
    const emblem = '.fun: each foo: %nork: this';

    assert.compilesTo(emblem, '<div class="fun">{{#each foo}}<nork>{{this}}</nork>{{/each}}</div>');
  });

  test('with text terminator', function (assert) {
    const emblem = '.fun: view SomeView | Hello';

    assert.compilesTo(emblem, '<div class="fun">{{#view SomeView}}Hello{{/view}}</div>');
  });

  test('test from heartsentwined', function (assert) {
    assert.compilesTo('li data-foo=bar: a', '<li data-foo={{bar}}><a></a></li>');
    assert.compilesTo("li data-foo='bar': a", '<li data-foo="bar"><a></a></li>');
  });

  test('mixture of colon and indentation', function (assert) {
    const emblem = "li data-foo=bar: a\n  baz";

    assert.compilesTo(emblem, '<li data-foo={{bar}}><a>{{baz}}</a></li>');
  });

  test('mixture of colon and indentation pt.2', function (assert) {
    const emblem = w('ul',
      '  li data-foo=bar: a quux',
      "  li data-foo='bar': a quux",
      "  li data-foo=bar href='#': a quux");

    assert.compilesTo(emblem, '<ul><li data-foo={{bar}}><a>quux</a></li><li data-foo="bar"><a>quux</a></li><li data-foo={{bar}} href="#"><a>quux</a></li></ul>');
  });

  test('condensed nesting', function (assert) {
    const emblem = `
    #content-frame: .container: .row
      .span4: render "sidebar"
      .span8: render "main"
    `;

    assert.compilesTo(emblem, '<div id="content-frame"><div class="container"><div class="row"><div class="span4">{{render "sidebar"}}</div><div class="span8">{{render "main"}}</div></div></div></div>');
  });
});
