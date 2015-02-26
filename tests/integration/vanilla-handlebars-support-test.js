// FIXME handle ">" partial invocation
//
// from http://emblemjs.com/syntax/
//
// "> partialName" -> "{{>partialName}}"
// "p check out #{> partialName}" -> "<p>check out {{>partialName}}</p>"
// "> partialName foo" -> "{{>partialName foo}}"
//  | Hello, {{> emblemPartialC foo}}{{>emblemPartialB}}{{>emblemPartialB }}

/*
QUnit.module "old school handlebars"

test "array", ->
  emblem =
  '''
  goodbyes
    | #{text}!
  | cruel #{world}!
  '''
  hash = {goodbyes: [{text: "goodbye"}, {text: "Goodbye"}, {text: "GOODBYE"}], world: "world"}
  shouldCompileToString emblem, hash, "goodbye! Goodbye! GOODBYE! cruel world!"

  hash = {goodbyes: [], world: "world"}
  shouldCompileToString emblem, hash, "cruel world!"

test "handlebars dot-separated paths with segment-literal notation", ->
  emblem =
  '''
  p = articles.[3]
  '''
  shouldCompileTo emblem, { articles: ['zero', 'one', 'two', 'three']}, '<p>three</p>'

test "handlebars dot-separated paths with segment-literal notation, more nesting", ->
  emblem =
  '''
  p = articles.[3].[#comments].[0]
  '''
  shouldCompileTo emblem, { articles: [{}, {}, {}, {'#comments': ['bazinga']}]}, '<p>bazinga</p>'

test "../path as inMustacheParam recognized correctly as pathIdNode instead of classShorthand", ->
  Handlebars.registerHelper 'jumpToParent', (link) ->
    new Handlebars.SafeString "<a href='#{link}'>Jump to parent top</a>"
  emblem =
  '''
  each children
    jumpToParent ../parentLink
  '''
  shouldCompileTo emblem, {parentLink: '#anchor', children: [{}]}, '<a href=\'#anchor\'>Jump to parent top</a>'

if supportsEachHelperDataKeywords

  QUnit.module "each block helper keywords prefixed by @"

  test "#each with @index", ->
    emblem =
    '''
    thangs
      p #{@index} Woot #{yeah}
    '''
    shouldCompileToString emblem, { thangs: [{yeah: 123}, {yeah:456}] }, '<p>0 Woot 123</p><p>1 Woot 456</p>'

  test "#each with @key", ->
    emblem =
    '''
    each thangs
      p #{@key}: #{this}
    '''
    shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>@key: 123</p><p>works!: 456</p>'

  test "#each with @key, @index", ->
    emblem =
    '''
    each thangs
      p #{@index} #{@key}: #{this}
    '''
    shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>0 @key: 123</p><p>1 works!: 456</p>'

  test "#each with @key, @first", ->
    emblem =
    '''
    each thangs
      if @first
        p First item
      else
        p #{@key}: #{this}
    '''
    shouldCompileTo emblem, { thangs: {'@key': 123, 'works!':456} }, '<p>First item</p><p>works!: 456</p>'

*/

// this sees a comment instead of a "../path"
// This sort of path is not valid in ember but allowed by vanilla handlebars
/*
test("../path as inMustacheParam recognized correctly as pathIdNode instead of classShorthand", function() {
  var emblem = w('each children',
             '  jumpToParent ../parentLink');
  compilesTo(emblem, '{{#each children}}{{jumpToParent ../parentLink}}{{/each}}');
});
*/

/*
test("exclamation modifier (vanilla)", function() {
  var emblem = 'p class=foo!';
  return shouldCompileTo(emblem, {
    foo: "YEAH"
  }, '<p class="YEAH"></p>');
});
*/
