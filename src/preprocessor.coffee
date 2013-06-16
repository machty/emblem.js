StringScanner = require 'StringScanner'
Emblem = require './emblem'

Emblem.Preprocessor = class Preprocessor

  ws = '\\t\\x0B\\f \\xA0\\u1680\\u180E\\u2000-\\u200A\\u202F\\u205F\\u3000\\uFEFF'
  INDENT = '\uEFEF'
  DEDENT = '\uEFFE'
  UNMATCHED_DEDENT = '\uEFEE'
  TERM   = '\uEFFF'

  # Convenience names for regex's
  anyWhitespaceAndNewlinesTouchingEOF = /// [#{ws}\r?\n]* $ ///
  any_whitespaceFollowedByNewlines_ = /// (?:[#{ws}]* \r?\n)+ ///

  constructor: ->
    # `base` is either `null` or a regexp that matches the base indentation
    # `indent` is either `null` or the characters that make up one indentation
    @base = null
    @indents = []
    @context = []
    @context.peek = -> if @length then this[@length - 1] else null
    @context.err = (c) -> throw new Error "Unexpected " + c
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
        when '\r'
          # TODO
          oiasoijdoiaj.asdasd.asdasd
          (@err c) unless top is '/'
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
    if this.StringScanner
      @ss = new this.StringScanner ''
    else if Emblem.StringScanner
      @ss = new Emblem.StringScanner ''
    else
      @ss = new StringScanner ''

  p: (s) ->
    @output += s if s
    s

  scan: (r) -> @p @ss.scan r
  discard: (r) -> @ss.scan r

  processInput = (isEnd) -> (data) ->

    # Load the scanner with data.
    unless isEnd
      @ss.concat data
      @discard any_whitespaceFollowedByNewlines_

    # Loop til we're at the end of the string.
    until @ss.eos()

      # Take a look at which state we're in, null if none.
      switch @context.peek()

        # We're either in initial state, or inside one of these braces.
        when null, INDENT

          # Check if we're at the beginning of a line, or if we can
          # discard whitespace til a newline.
          if @ss.bol() or @discard any_whitespaceFollowedByNewlines_

            # We're at the beginning of a line, 

            # Check for empty line.
            if @discard /// [#{ws}]*\r?\n ///
              @p "#{TERM}\n" 
              continue

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

            if @indents.length == 0
              # Haven't established indentation yet. Check if
              # there's whitespace immediately followed by non-(whitespace/comment)
              if @ss.check /// [#{ws}]+ ///
                @p INDENT
                @context.observe INDENT
                @indents.push @scan /// ([#{ws}]+) ///
            else

              indent = @indents[@indents.length - 1]

              # Check for new indents 
              if d = @ss.check /// (#{indent}) ///

                @discard d

                if @ss.check /// ([#{ws}]+) ///
                  # Indentation.
                  @p INDENT
                  @context.observe INDENT
                  @indents.push d + @scan /// ([#{ws}]+) ///

              else
                # We've dedented, walk back through indents.
                while @indents.length
                  indent = @indents[@indents.length - 1]

                  break if @discard /// (?:#{indent}) ///

                  @context.observe DEDENT
                  @p DEDENT

                  @indents.pop()

                # Check for invalid dedent.
                if s = @discard /// [#{ws}]+ ///

                  @output = @output.slice(0,-1)
                  @output += UNMATCHED_DEDENT

                  @p INDENT
                  @context.observe INDENT
                  @indents.push s

          # scan safe characters (anything that doesn't *introduce* context)
          @scan /[^\r\n]+/

          if @discard /\r?\n/
            @p "#{TERM}\n" 

    # Done scanning. Check if we're at the end of the file.
    if isEnd
      @scan anyWhitespaceAndNewlinesTouchingEOF

      # Unravel indents.
      while @context.length and INDENT is @context.peek()
        @context.observe DEDENT
        @p DEDENT
        
      # Check if there's still something unclosed.
      throw new Error 'Unclosed ' + (@context.peek()) + ' at EOF' if @context.length

  processData: processInput no
  processEnd: processInput yes
  @processSync = (input) ->
    input += "\n"
    pre = new Preprocessor
    pre.processData input
    do pre.processEnd
    pre.output


