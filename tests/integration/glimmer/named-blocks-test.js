import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('glimmer: named blocks', function (hooks) {
  test('named block support', function (assert) {
    const emblem = w(
      '% x-modal',
      '  % @header as |@title|',
      '    |Header #{title}',
      '  % @body',
      '    |Body ${title}',
      '  % @footer',
      '    |Footer'
    );

    assert.compilesTo(emblem, '<x-modal><@header as |@title|>Header {{title}}</@header><@body>Body {{title}}</@body><@footer>Footer</@footer></x-modal>');
  });

  test('named yielded block support', function (assert) {
    const emblem = w(
      '%Article',
      '  %:title',
      '    h1 = this.title',
      '  %:body',
      '    .byline = byline this.author',
      '    .body = this.body',
    );

    assert.compilesTo(emblem, '<Article><:title><h1>{{this.title}}</h1></:title><:body><div class="byline">{{byline this.author}}</div><div class="body">{{this.body}}</div></:body></Article>');
  });
});
