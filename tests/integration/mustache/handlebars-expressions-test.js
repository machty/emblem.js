import { module, test } from 'qunit';
import { w } from 'tests/support/utils';

module('mustache: handlebars expressions', function (hooks) {
  test("recognizes double-quoted attrs", function (assert) {
    const emblem = 'frank text="yes"';

    assert.compilesTo(emblem, '{{frank text="yes"}}');
  });

  test("recognizes single-quoted attrs", function (assert) {
    const emblem = "frank text='yes'";

    assert.compilesTo(emblem, "{{frank text='yes'}}");
  });

  test("recognizes unquoted attrs", function (assert) {
    const emblem = "frank foo=bar";

    assert.compilesTo(emblem, "{{frank foo=bar}}");
  });

  test("sub-expressions are ok", function (assert) {
    const emblem = `
      = link-to 'content-manage.social' (query-params groupId=defaultGroup.id) tagName="li"
    `;

    assert.compilesTo(emblem,
      '{{link-to \'content-manage.social\' (query-params groupId=defaultGroup.id) tagName="li"}}');
  });

  test('percent sign in quoted attr value', function (assert) {
    const emblem = `
      = input placeholder="100%"
    `;

    assert.compilesTo(emblem, '{{input placeholder="100%"}}');
  });

  test('colon and semicolon in quoted attr value', function (assert) {
    const emblem = `
      = input style="outline:blue; color:red"
    `;

    assert.compilesTo(emblem, '{{input style="outline:blue; color:red"}}');
  });

  test('mustache attribute value has comma', function (assert) {
    const emblem = "a name='my, cool, name'";

    assert.compilesTo(emblem, '<a name="my, cool, name"></a>');
  });

  test("path with dot 1", function (assert) {
    const emblem = 'iframe src=post.pdfAttachment';

    assert.compilesTo(emblem, '<iframe src={{post.pdfAttachment}}></iframe>');
  });

  test("path with dot 2", function (assert) {
    const emblem = 'iframe src=post.pdfAttachmentUrl width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"';

    assert.compilesTo(emblem,
      '<iframe src={{post.pdfAttachmentUrl}} width="96%" height="400" view="FitV" frameborder="0" style="z-index: 0 !important;"></iframe>');
  });

  test("booleans with and without quoting", function (assert) {
    assert.compilesTo('foo what=false', '{{foo what=false}}');
    assert.compilesTo('foo what="false"', '{{foo what="false"}}');
    assert.compilesTo("foo what='false'", '{{foo what=\'false\'}}');
  });

  test("bound attributes from within strings", function (assert) {
    const emblem = 'div style="width: {{userProvidedWidth}}px;"';

    assert.compilesTo(emblem, '<div style="width: {{userProvidedWidth}}px;"></div>');
  });

  test('use of "this"', function (assert) {
    const emblem = w(
      '',
      'each foo',
      '  p = this',
      '  this'
    );

    assert.compilesTo(emblem, '{{#each foo}}<p>{{this}}</p>{{this}}{{/each}}');
  });

  test('mustache attr with underscore', function (assert) {
    const emblem = 'input placeholder=cat_name';

    assert.compilesTo(emblem, '<input placeholder={{cat_name}}/>');
  });

  test('mustache with empty attr value (single-quoted string)', function (assert) {
    const emblem = "= input placeholder=''";

    assert.compilesTo(emblem, "{{input placeholder=''}}");
  });

  test('mustache with empty attr value (double-quoted string)', function (assert) {
    const emblem = '= input placeholder=""';

    assert.compilesTo(emblem, '{{input placeholder=""}}');
  });

  test('explicit mustache with "/" in name', function (assert) {
    const emblem = '= navigation/button-list';

    assert.compilesTo(emblem, '{{navigation/button-list}}');
  });

  test('explicit mustache with spacing issues', function(assert) {
    assert.compilesTo('=  link-to  foo=bar', '{{link-to foo=bar}}');
  });

  test("should not kick in if preceded by equal sign", function (assert) {
    const emblem = w(
      "= SomeView"
    );

    assert.compilesTo(emblem, '{{SomeView}}');
  });

  test("should not kick in if preceded by equal sign (example with partial)", function (assert) {
    const emblem = w(
      '= partial "cats"'
    );

    assert.compilesTo(emblem, '{{partial "cats"}}');
  });

  test("should not kick in explicit {{mustache}}", function (assert) {
    const emblem = w(
      "p Yeah {{SomeView}}"
    );

    assert.compilesTo(emblem, '<p>Yeah {{SomeView}}</p>');
  });

  test("various one-liners", function (assert) {
    const emblem = w(
      "= foo",
      "arf",
      "p = foo",
      "span.foo",
      'p data-foo="yes" = goo'
    );

    assert.compilesTo(emblem,
      '{{foo}}{{arf}}<p>{{foo}}</p><span class="foo"></span><p data-foo="yes">{{goo}}</p>');
  });

  test("more complicated", function (assert) {
    const emblem = "view SomeView borf=\"yes\" | Hello, How are you? Sup?";

    assert.compilesTo(emblem, '{{#view SomeView borf="yes"}}Hello, How are you? Sup?{{/view}}');
  });

  test("GH-26: no need for space before equal sign", function (assert) {
    let emblem;
    emblem = "span= foo";
    assert.compilesTo(emblem, '<span>{{foo}}</span>');
    emblem = "span.foo= foo";
    assert.compilesTo(emblem, '<span class="foo">{{foo}}</span>');
    emblem = "span#hooray.foo= foo";
    assert.compilesTo(emblem, '<span id="hooray" class="foo">{{foo}}</span>');
    emblem = "#hooray= foo";
    assert.compilesTo(emblem, '<div id="hooray">{{foo}}</div>');
    emblem = ".hooray= foo";
    assert.compilesTo(emblem, '<div class="hooray">{{foo}}</div>');
  });

  module('binding behavior', function () {
    test("basic", function (assert) {
      const emblem = 'p class=foo';

      assert.compilesTo(emblem, '<p class={{foo}}></p>');
    });

    test("basic w/ underscore", function (assert) {
      const emblem = 'p class=foo_urns';

      assert.compilesTo(emblem, '<p class={{foo_urns}}></p>');
    });

    test("subproperties", function (assert) {
      const emblem = 'p class=foo._death.woot';

      assert.compilesTo(emblem, '<p class={{foo._death.woot}}></p>');
    });

    test("multiple", function (assert) {
      const emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';

      assert.compilesTo(emblem, '<p id="yup" data-thinger={{yeah}} class={{foo}}>Hooray</p>');
    });

    test("multiple with legacy quoting", function (assert) {
      const emblem = 'p class=foo id="yup" data-thinger=yeah Hooray';

      assert.compilesTo(emblem, '<p id="yup" data-thinger=\"{{yeah}}\" class={{foo}}>Hooray</p>', null, {
        legacyAttributeQuoting: true
      });
    });

    test("in brackets", function (assert) {
      const emblem = "p [\n  id=id some-data=data.ok\n]\n";

      assert.compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
    });

    test('brackets with empty lines', function (assert) {
      const emblem = w(
        'p [',
        '  id=id',
        '  ',
        '',
        '  some-data=data.ok',
        ']'
      );

      assert.compilesTo(emblem, '<p id={{id}} some-data={{data.ok}}></p>');
    });
  });
});
