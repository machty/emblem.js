StringScanner = require 'StringScanner'

inspect = (o) -> (require 'util').inspect o, no, 9e9, yes

@Preprocessor = class Preprocessor

  ws = '\\t\\x0B\\f \\xA0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205F\\u3000\\uFEFF'
  INDENT = '\uEFEF'
  DEDENT = '\uEFFE'
  TERM   = '\uEFFF'
  #INDENT = ' INDENT 
  #DEDENT = ' DEDENT '
  #TERM   = ' TERM '

  # Convenience names for regex's
  anyWhitespaceAndNewlinesTouchingEOF = /// [#{ws}\n]* $ ///
  any_whitespaceFollowedByNewlines_ = /// (?:[#{ws}]* \n)+ ///

  constructor: ->
    # `base` is either `null` or a regexp that matches the base indentation
    # `indent` is either `null` or the characters that make up one indentation
    @base = @indent = null
    @context = []
    @context.peek = -> if @length then this[@length - 1] else null
    @context.err = (c) -> throw new Error "Unexpected " + inspect c
    @output = ''

    # This function pushes context, validating that the present
    # context supports the newly pushed context.
    @context.observe = (c) ->
      top = @peek()
      switch c
        when INDENT
          @push c
        when DEDENT
          (@err c) unless top is INDENT
          do @pop
        when '\n'
          (@err c) unless top is '/'
          do @pop
        when '/'
          @push c

        when 'end-\\'
          (@err c) unless top is '\\'
          do @pop
        else throw new Error "undefined token observed: " + c
      this
    @ss = new StringScanner ''

  p: (s) ->
    @output += s if s
    s

  scan: (r) -> @p @ss.scan r
  discard: (r) -> @ss.scan r


  processInput = (isEnd) -> (data) ->

    # Load the scanner with data.
    @ss.concat data unless isEnd

    # Loop til we're at the end of the string.
    until @ss.eos()

      # Take a look at which state we're in, null if none.
      switch @context.peek()

        # We're either in initial state, or inside one of these braces.
        when null, INDENT #, '#{', '[', '(', '{'

          # Check if we're at the beginning of a line, try gobbling
          # any whitespace before beginning of line.
          if @ss.bol() or @discard any_whitespaceFollowedByNewlines_

            # We're at bol, take this opportunity to establish base
            # indentation and present indentation

            # oneOrMore(anyWhitespaceFollowedByIHaveNoIdea)
            # TODO ALEX rewrite. this is screwing up id # shorthand
            #@scan /// (?: [#{ws}]* (\/[^\n]*)? \n )+ ///

            # we might require more input to determine indentation
            return if not isEnd and (@ss.check /// [#{ws}\n]* $ ///)?

            # Check if we've established starting indentation yet. This is
            # a nice feature to have particularly for people using emblem
            # in <script type="x-emblem"> tags.
            if @base?
              # Gobble up baseline whitespace.
              unless (@discard @base)?
                throw new Error "inconsistent base indentation"
            else
              # No base, so set it scan for what our base is, and generate regex for it.
              # This allows support for people mixing their preceding whitespace to
              # at least follow the same pattern.
              b = @discard /// [#{ws}]* ///
              @base = /// #{b} ///

            # Have we stored current indentation yet?
            if @indent?
              level = (0 for c in @context when c is INDENT).length
              # a single indent
              if @ss.check /// (?:#{@indent}){#{level + 1}} [^#{ws}#] ///
                @discard /// (?:#{@indent}){#{level + 1}} ///
                @context.observe INDENT
                @p INDENT
              # one or more dedents
              else if level > 0 and @ss.check /// (?:#{@indent}){0,#{level - 1}} [^#{ws}] ///
                newLevel = 0
                ++newLevel while @discard /// #{@indent} ///
                delta = level - newLevel
                while delta--
                  @context.observe DEDENT
                  @p "#{DEDENT}"
              # unchanged indentation level
              else if @ss.check /// (?:#{@indent}){#{level}} [^#{ws}] ///
                @discard /// (?:#{@indent}){#{level}} ///
              else
                lines = @ss.str.substr(0, @ss.pos).split(/\n/) || ['']
                message = "Syntax error on line #{lines.length}: invalid indentation"
                throw new Error "#{message}"
                #context = pointToErrorLocation @ss.str, lines.length, 1 + (level + 1) * @indent.length
                #throw new Error "#{message}\n#{context}"
            else 
              # Haven't established indentation yet. Check if
              # there's whitespace immediately followed by non-(whitespace/comment)
              if @indent = @discard /// [#{ws}]+ ///
                @context.observe INDENT
                @p INDENT

          # scan safe characters (anything that doesn't *introduce* context)
          @scan /[^\n\\]+/

          @context.observe tok if tok = @discard /\//
          @p "#{TERM}" if @discard /\n/
          @discard any_whitespaceFollowedByNewlines_

        when '/'
          # Handle EOL \ 
          if (@discard /.*\n/) then @context.observe '\n'

        when '\\'
          # Handle EOL \ 
          if (@scan /[\s\S]/) then @context.observe 'end-\\'

    # Done scanning. Check if we're at the end of the file.
    if isEnd
      @scan anyWhitespaceAndNewlinesTouchingEOF

      # Unravel indents.
      while @context.length and INDENT is @context.peek()
        @context.observe DEDENT
        @p "#{DEDENT}"
        
      # Check if there's still something unclosed.
      throw new Error 'Unclosed ' + (inspect @context.peek()) + ' at EOF' if @context.length

  processData: processInput no
  processEnd: processInput yes
  @processSync = (input) ->
    pre = new Preprocessor
    pre.processData input
    do pre.processEnd
    pre.output
