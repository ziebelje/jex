rocket.ready(function() {
  var $ = rocket.extend(rocket.$, rocket);

  var previous_layer;

  var font_family = 'consolas,"courier new",monospace';
  var style_legend = {
    'font-weight': 'bold',
    'color': '#000088'
  };
  var style_human = {
    'margin': 10,
    'padding': 10,
    'background-color': '#F8F8F8',
    'font-family': 'helvetica'
  };
  var style_type = {
    'color': '#888888',
    'font-style': 'italic'
  };
  var style_fieldset = {
    'border': '1px solid #CCCCCC',
    'margin-bottom': 10
  };
  var style_code = {
    'font-family': font_family,
    'margin': 10
  };
  style_code.comment = {
    'color': 'green'
  };
  style_code.word = {
    'color': 'blue',
    'font-style': 'italic'
  };
  style_code.identifier = {};
  style_code.string = {
    'color': 'gray'
  };
  style_code.number = {
    'color': 'red'
  };
  style_code.regexp = {
    'color': 'purple'
  };
  style_code.operator = {
    'font-size': 13
  };
  style_code.whitespace = {};

  /**
  @param {string} string
  @return {Array.<{type: string, value: string}>}
  */
  var lexeme = function(string) {

    var words = {
      'true': 1,
      'false': 1,
      'break': 1,
      'case': 1,
      'catch': 1,
      'continue': 1,
      'debugger': 1,
      'default': 1,
      'delete': 1,
      'do': 1,
      'else': 1,
      'finally': 1,
      'for': 1,
      'function': 1,
      'if': 1,
      'in': 1,
      'instanceof': 1,
      'new': 1,
      'return': 1,
      'switch': 1,
      'this': 1,
      'throw': 1,
      'try': 1,
      'typeof': 1,
      'var': 1,
      'void': 1,
      'while': 1,
      'with': 1,
      'undefined': 1,
      'prototype': 1,
      'arguments': 1
    };
    var operators = {
      '!': 1,
      '#': 1,
      '%': 1,
      '&': 1,
      '(': 1,
      ')': 1,
      '*': 1,
      '+': 1,
      ',': 1,
      '-': 1,
      '.': 1,
      '/': 1,
      ':': 1,
      ';': 1,
      '<': 1,
      '=': 1,
      '>': 1,
      '?': 1,
      '@': 1,
      '[': 1,
      ']': 1,
      '^': 1,
      '{': 1,
      '|': 1,
      '}': 1
    };

    var position = 0;
    var results = [];
    var character;
    var initial_position;
    var type;
    var value;

    while (character = string.charAt(position++)) {

      initial_position = position;

      if (character >= 'a' && character <= 'z' ||
          character >= 'A' && character <= 'Z' ||
          character === '$' || character === '_') {

        do {
          character = string.charAt(position++);
        } while (character >= 'a' && character <= 'z' ||
            character >= 'A' && character <= 'Z' ||
            character === '$' || character === '_' ||
            character >= '0' && character <= '9');

        type = 'identifier';
        --position;

      } else if (character === '/') {

        if (string.charAt(position) === '*') {

          do {
            character = string.charAt(position++);
          } while (character !== '*' || string.charAt(position) !== '/');

          type = 'comment';
          ++position;

        } else if (string.charAt(position) === '/') {

          do {
            character = string.charAt(position++);
          } while (character !== '\n');

          type = 'comment';
          --position;

        } else {

          do {
            character = string.charAt(position++);
          } while (character !== '\n' &&
              (character !== '/' ||
                  string.charAt(position - 2) === '\\' &&
                      string.charAt(position - 3) !== '\\'));

          if (character === '\n') {
            position = initial_position;
            type = 'operator';
          } else {
            type = 'regexp';
          }

        }
      } else if (character in operators) {

        type = 'operator';

      } else if (character === '\'' || character === '"') {

        var terminator = character;
        do {
          character = string.charAt(position++);
        } while (character !== terminator ||
            string.charAt(position - 2) === '\\' &&
            string.charAt(position - 3) !== '\\');

        type = 'string';

      } else if (character >= '0' && character <= '9' ||
          character === '.' &&
              string.charAt(position + 1) >= '0' &&
                  string.charAt(position + 1) <= '9') {

        do {
          character = string.charAt(position++);
        } while (character >= '0' && character <= '9' ||
            character === '.' || character === 'x' || character === 'e');

        type = 'number';
        --position;

      } else {

        do {
          character = string.charAt(position++);
        } while (character === ' ' ||
            character === '\t' || character === '\r' || character === '\n');

        type = 'whitespace';
        --position;

      }

      value =
          string.substr(initial_position - 1, position - initial_position + 1);

      results.push({
        'type': (type === 'identifier' && value in words) ? 'word' : type,
        'value': value
      });

    }

    return results;

  };


  var left = function(name) {
    this.name = name;
  };
  left.link = function(parent, name) {
    var div = $.createElement('div');
    div.style({'cursor': 'pointer'});
    div.innerHTML(name.replace(docs[name].parent,'').replace('prototype.', '').replace(/^\./, ''));
    div.addClass('name').dataset('name', name);
    parent.appendChild(div);
  };
  left.prototype.render = function(parent) {
    var fieldset = $.createElement('fieldset').style(style_fieldset);
    var legend = fieldset.appendChild($.createElement('legend').style(style_legend).innerHTML(this.legend));
    this.render_links(fieldset);
    if(fieldset.children().length > 1)
      parent.appendChild(fieldset);
  };
  left.prototype.render_links = function(parent) {
    if (docs[this.name].children.length) {
      var name = this.name;
    } else {
      var name = docs[this.name].parent;
    }
    for (var i = 0; docs[name].children[i]; ++i) {
      var child = docs[docs[name].children[i]];
      if(!child.tags.private)
        this.render_link(parent, child);
    }
  };
  left.prototype.render_link = function(parent, child) {
    parent.appendChild($.createElement('div').innerHTML('[todo]'));
  };

  left.parents = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.parents, left);
  left.parents.prototype.legend = 'Parents';
  left.parents.prototype.render_links = function(parent) {
    var i = this.name;
    while(i = docs[i].parent){
      left.link(parent, i);
    }
  };

  left.namespaces = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.namespaces, left);
  left.namespaces.prototype.legend = 'Namespaces';
  left.namespaces.prototype.render_link = function(parent, child) {
    if (child.is_namespace) {
      left.link(parent, child.name);
    }
  };

  left.classes = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.classes, left);
  left.classes.prototype.legend = 'Classes';
  left.classes.prototype.render_link = function(parent, child) {
    if (child.is_constructor) {
      left.link(parent, child.name);
    }
  };

  left.statics = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.statics, left);
  left.statics.prototype.legend = 'Static Properties';
  left.statics.prototype.render_link = function(parent, child) {
    if (child.is_static) {
      left.link(parent, child.name);
    }
  };

  left.prototypes = function(){
    left.apply(this, arguments);
  };
  $.inherits(left.prototypes, left);
  left.prototypes.prototype.legend = 'Prototype Properties';
  left.prototypes.prototype.render_link = function(parent, child) {
    if (child.is_prototype) {
      left.link(parent, child.name);
    }
  };


  var contents = function(name) {
    this.name = name;
  };
  contents.prototype.render = function(parent) {
    var fieldset = $.createElement('fieldset').style(style_fieldset);
    var legend = fieldset.appendChild($.createElement('legend').style(style_legend).innerHTML(this.legend));
    this.render_contents(fieldset);
    if(fieldset.children().length > 1)
      parent.appendChild(fieldset);
  };

  contents.description = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.description, contents);
  contents.description.prototype.legend = 'Description';
  contents.description.prototype.render_contents = function(parent) {
    parent.appendChild($.createElement('div').style(style_human).innerHTML(docs[this.name].description.replace(/\n\s*\n/g, '<br/><br/>')));
  };

  contents.params = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.params, contents);
  contents.params.prototype.legend = 'Arguments';
  contents.params.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.param) {
      for (var i = 0; docs[this.name].tags.param[i]; ++i) {
        var div = $.createElement('div').style({'margin': 10});
        div.appendChild($.createElement('span').style({'font-weight': 'bold'}).innerHTML(docs[this.name].tags.param[i].name));
        div.appendChild($.createElement('span').style(style_type).style({'margin-left':10}).innerHTML($.htmlEntities(docs[this.name].tags.param[i].type)));
        parent.appendChild(div);
        parent.appendChild($.createElement('div').style(style_human).innerHTML(docs[this.name].tags.param[i].description));
      }
    }
  };

  contents.returns = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.returns, contents);
  contents.returns.prototype.legend = 'Return Value';
  contents.returns.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.return) {
      for (var i = 0; docs[this.name].tags.return[i]; ++i) {
        parent.appendChild($.createElement('div').style(style_type).style({'margin': 10}).innerHTML($.htmlEntities(docs[this.name].tags.return[i].type)));
        parent.appendChild($.createElement('div').style(style_human).innerHTML(docs[this.name].tags.return[i].description));
      }
    }
  };

  contents.types = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.types, contents);
  contents.types.prototype.legend = 'Variable Type';
  contents.types.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.type) {
      for (var i = 0; docs[this.name].tags.type[i]; ++i) {
        parent.appendChild($.createElement('div').style(style_type).style({'margin': 10}).innerHTML($.htmlEntities(docs[this.name].tags.type[i])));
      }
    }
  };

  contents.examples = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.examples, contents);
  contents.examples.prototype.legend = 'Examples';
  contents.examples.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.example) {
      for (var i = 0; docs[this.name].tags.example[i]; ++i) {
        var pre = $.createElement('pre').style(style_code);
        var results = lexeme(docs[this.name].tags.example[i]);
        for(var j = 0; results[j]; ++j){
          pre.appendChild($.createElement('span').style(style_code[results[j].type]).innerHTML($.htmlEntities(results[j].value)));
        }
        parent.appendChild(pre);
      }
    }
  };

  contents.sees = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.sees, contents);
  contents.sees.prototype.legend = 'Related';
  contents.sees.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.see) {
      for (var i = 0; docs[this.name].tags.see[i]; ++i) {
        parent.appendChild($.createElement('div').style({'cursor':'pointer','margin':10}).addClass('name').dataset('name',docs[this.name].tags.see[i]).innerHTML(docs[this.name].tags.see[i]));
      }
    }
  };

  contents.links = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.links, contents);
  contents.links.prototype.legend = 'Links';
  contents.links.prototype.render_contents = function(parent) {
    if (docs[this.name].tags.link) {
      for (var i = 0; docs[this.name].tags.link[i]; ++i) {
        parent.appendChild($.createElement('div').style({'margin':10})).appendChild($.createElement('a').setAttribute({'href':docs[this.name].tags.link[i].href}).innerHTML(docs[this.name].tags.link[i].name));
      }
    }
  };

  contents.statics = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.statics, contents);
  contents.statics.prototype.legend = 'Static Properties';
  contents.statics.prototype.render_contents = function(parent) {
    for (var i = 0; docs[this.name].children[i]; ++i) {
      var child = docs[docs[this.name].children[i]];
      if(!child.tags.private) {
        if (child.is_static) {
          parent.appendChild($.createElement('div').innerHTML(child.name + '(' + child.parameters.join(', ') + ')').addClass('name').dataset('name',child.name).style({'cursor':'pointer'}));
          parent.appendChild($.createElement('div').style(style_human).innerHTML(child.summary || '[todo]'));
        }
      }
    }
  };

  contents.prototypes = function(){
    contents.apply(this, arguments);
  };
  $.inherits(contents.prototypes, contents);
  contents.prototypes.prototype.legend = 'Prototype Properties';
  contents.prototypes.prototype.render_contents = function(parent) {
    for (var i = 0; docs[this.name].children[i]; ++i) {
      var child = docs[docs[this.name].children[i]];
      if(!child.tags.private) {
        if (child.is_prototype) {
          parent.appendChild($.createElement('div').innerHTML(child.parent + ' -> ' + child.title + '(' + child.parameters.join(', ') + ')').addClass('name').dataset('name',child.name).style({'cursor':'pointer'}));
          parent.appendChild($.createElement('div').style(style_human).innerHTML(child.summary || '[todo]'));
        }
      }
    }
  };


  var layer = function(name) {
    this.name = document.title = name || 'jex'; // JEZ
  };
  layer.prototype.dispose = function() {
  };
  layer.prototype.render = function(do_not_push_state) {
    if (!do_not_push_state) {
      history[this.name ? 'pushState' : 'replaceState']({'name': this.name}, '', '');
    }

    this.table = $.table(2, 2).setAttribute({'cellspacing': 1, 'cellpadding': 10}).style({'background-color': '#CCCCCC', 'height': '100%'});

    this.table.tbody.style({'font-family': font_family, 'font-size': 12, 'background-color': 'white'});

    this.table.trs[1].removeChild(this.table.trs[1].tds[0]);
    this.table.trs[0].tds[0].setAttribute({'rowspan': 2});

    this.table.trs[0].tds[0].setAttribute({'width': 250, 'valign': 'top'});
    this.render_left(this.table.trs[0].tds[0]);

    this.table.trs[0].tds[1].setAttribute({'height': 30});
    this.render_header(this.table.trs[0].tds[1]);

    this.table.trs[1].tds[1].setAttribute({'valign': 'top'});
    this.render_contents(this.table.trs[1].tds[1]);

    if (previous_layer) {
      $('body').replaceChild(this.table, previous_layer.table);
      previous_layer.dispose();
    } else {
      $('body').appendChild(this.table);
    }

    $('body').scrollIntoView();

    previous_layer = this;
  };
  layer.prototype.render_header = function(parent) {
    parent.appendChild($.createElement('div').style({'font-size':24, 'margin-left': 10, 'color': '#000088'}).innerHTML(this.name));
  };
  layer.prototype.render_left = function(parent) {

    (new left.parents(this.name)).render(parent);
    (new left.namespaces(this.name)).render(parent);
    (new left.classes(this.name)).render(parent);
    (new left.statics(this.name)).render(parent);
    (new left.prototypes(this.name)).render(parent);

  };
  layer.prototype.render_contents = function(parent) {
    var title;

    if (docs[this.name].is_namespace) {
      // [todo?]
    } else if (docs[this.name].is_constructor) {
      title = this.name;
    } else if (docs[this.name].is_static) {
      title = this.name;
    } else {
      title = docs[this.name].parent + ' -> ' + docs[this.name].title;
    }

    if (title && (docs[this.name].is_function || docs[this.name].is_constructor)) {
      title += '(' + docs[this.name].parameters.join(', ') + ')';
    }

    if (title) {
      parent.appendChild($.createElement('div').style({'font-size': 14, 'font-weight': 'bold', 'margin': 10}).innerHTML(title));
    }

    (new contents.description(this.name)).render(parent);
    (new contents.params(this.name)).render(parent);
    (new contents.statics(this.name)).render(parent);
    (new contents.prototypes(this.name)).render(parent);
    (new contents.types(this.name)).render(parent);
    (new contents.returns(this.name)).render(parent);
    (new contents.examples(this.name)).render(parent);
    (new contents.sees(this.name)).render(parent);
    (new contents.links(this.name)).render(parent);
  };

  $('html,body').style({'border': 0, 'margin': 0, 'height': '100%'});

  $(window).addEventListener('popstate', function() {
    (new layer(history.state.name)).render(true);
  });

  $('body').live('div.name', 'click', function() {
    (new layer($(this).dataset('name'))).render();
  });

  (new layer('jex')).render(); // JEZ

});

