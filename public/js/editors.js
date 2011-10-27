
var editors = {}
var theme = 'solarized_light' //'dawn'
editors.createSession = function(id) {
  var editor = ace.edit(id);
  var session = editor.getSession();
  session.setTabSize(2);
  session.setUseSoftTabs(false);
  return session;
}

editors.setPreviewContainer = function(container) {
	editors.previewContainer = $(container);
}

var accessCount = 0
editors.createPreviewDocument = function() {
	if(accessCount % 100 === 0) {
		var iframes = editors.previewContainer.children('iframe')
		iframes.remove()
		var iframe = $('<iframe class="preview" name="preview"></iframe>')
		editors.previewContainer.append(iframe)
		editors.previewDocument = window.frames['preview'].document
		accessCount = 0
	}
	accessCount++;
	return editors.previewDocument
}
var jadeEngine = jade_require('jade')

var layout = '!!!\n' +
'html\n' +
'  head\n' +
'    style\n' +
'      !{css}\n' +
'    script(src="//ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.js")\n' + 
'  body\n' + 
'    !{html}\n' +
'    script(type="text/javascript")\n' +
'      !{javascript}'

var renderLayout = jadeEngine.compile(layout)  
	  
editors.showPreview = function() {
	
	var err
	var json_string, json
	if(editors.json) {
		try {
			json_string = editors.json.getValue().trim()
			json = (json_string === '') ? null : eval('(' + json_string + ')');
		} catch (er) {
			err = er.toString();
		}
	}
	
	var jade = editors.jade.getValue()
	var html
	if(err) {
		html = '<pre style="color: red;">' + err + '</pre>'
	} else if(editors.jade) {
		json = json || {}
		try {
			var fn = jadeEngine.compile(jade)
			html = fn(json)
		}
		catch (er) {
			html = '<pre style="color: red;">' + er.toString() + '</pre>'
		}


	} else {
		html = 'No jade editor defined'
	}
	
	var css = editors.css.getValue()
	var js = editors.javascript.getValue()
	
	var iFrameDoc = editors.createPreviewDocument()
	iFrameDoc.open()
	iFrameDoc.write(renderLayout({
			css: css,
			html: html,
			javascript: js 
		}))
	iFrameDoc.close()		
	
}

editors.create = function(name, element, mode) {
  
	var editor = ace.edit(element);
	editor.setTheme('ace/theme/' + theme)
	
	
	var session = editor.getSession()
	session.setTabSize(2)
	
	if(mode) { session.setMode(mode) }
	
	editors[name] = editor.session
	session.on('change', editors.showPreview)
	
	sharejs.open(name, 'text', function(doc, error) {
	  if(error) { console.log('share js error', error) }
	  console.log('recieved doc for ', name)
      
	  doc.attach_ace(editor);
    });
	
	return editor  
}

editors.createCSS = function(element) {
  
	var CssScriptMode = require("ace/mode/css").Mode
	var editor = editors.create('css', element, new CssScriptMode ());
	
	editor.renderer.setShowGutter(false)

	return editor
}

editors.createJSON = function(element) {
	
	var JsonMode = require("ace/mode/json").Mode
	var editor = editors.create('json', element, new JsonMode ());
	
	editor.renderer.setShowGutter(false)
	
	return editor
}

editors.createJavascript = function(element) {
  
	var JsonMode = require("ace/mode/javascript").Mode
	var editor = editors.create('javascript', element, new JsonMode ());
	
	editor.getSession().setTabSize(4)
	
	return editor  
}


editors.createJade = function(element) {

	var editor = editors.create('jade', element, null);

	var session = editor.getSession().setUseSoftTabs(true);

	return editor;
	
	
}

