//*********************************************************************
//* markDown2html.js -- Convert MarkDown syntax to HTML
//*
//* Convert MarkDown markup to HTML
//* https://help.github.com/articles/markdown-basics/
//* https://help.github.com/articles/github-flavored-markdown/
//*
//* NOTE! Not supported: tables and nested lists
//*
//* Uses ActiveX to read from source file and write to target file
//*********************************************************************
//*(c)2015 Erik Bachmann [ErikBachmann@ClicketyClick.dk]
//*********************************************************************

// Use the short hack to load text file I/O 
eval(new ActiveXObject("Scripting.FileSystemObject").
   OpenTextFile("textfile.io.js",1).ReadAll());

//---------------------------------------------------------------------

function markDown2html(myText) {
// https://help.github.com/articles/markdown-basics/

	// Headings Level 1-9
	for (i = 9; i >= 1; i--) {
		// http://stackoverflow.com/questions/874709/converting-user-input-string-to-regular-expression
		var pattern = new RegExp("\r\n"+Array(i+1).join("#")+"([^\r\n]*)", "ig");
		var result="\r\n<h"+i+">$1</h"+i+">"
		myText=myText.replace( pattern, result);
	}
	
	

//---------------------------------------------------------------------
// Tables

/*	
lead|Trail
---|---
arg|Valus
arg|value

*/

// Entire table: 
//	Header + line + body
//  <table>....</table>	(.*)\r\n\r\n
	//var result="\r\n<table>\r\n$1\|$2\r\n</table>"
	
	// Markerer header + skillelinje
	//var pattern = new RegExp("\r\n([^\r\n]+)\r\n([-\|]+)\r\n", "igm");
	//var result="\r\n<TABLE>$1\r\n$2</table>\r\n"
	//                                            ---|---     |	[^\r\n]}{4,}
	//var pattern = new RegExp("\r\n([^\r\n]+)\r\n([-\|]+)\r\n(.*)\r\n", "igm");
	//var result="\r\n<TABLE>$1\r\n$2\r\n[$3]</table>\r\n"
	
	var linebreak="£££"
	var pattern = new RegExp("\r\n", "igm");
	var result=linebreak
	
	myText=myText.replace( pattern, result);
	
	var pattern = new RegExp(linebreak+"([^"+linebreak+"]*)"+linebreak+"([-\|]+)"+linebreak+"(.*)"+linebreak+""+linebreak+"", "igm");
	var result="\r\n<table border='1'>\r\n\t<tr><th>$1<\/th></tr>\r\n$ 2\r\n$3</table>\r\n"
	myText=myText.replace( pattern, result);
	
	var pattern = new RegExp(linebreak, "igm");
	var result="\r\n"
	myText=myText.replace( pattern, result);
	
	
	// Header
	var pattern = new RegExp("<tr>(.*)\\|(.*)<\/tr>", "igm");
	var result="<tr>$1<\/th><th>$2</tr>"
	myText=myText.replace( pattern, result);
	
	//body
	//var pattern = new RegExp("<table>(.*)\\|(.*)<\/table>", "igm");
	//var result="<table>[$1]<\/td><td>[$2]</table>"
	var pattern = new RegExp("\\|", "igm");
	var result="<\/td><td>"
	myText=myText.replace( pattern, result);
	
	var pattern = new RegExp("\n(.*)<\/td><td>(.*)\r", "igm");
	var result="\n<tr><td>$1<\/td><td>$2</td></tr>\r"
	myText=myText.replace( pattern, result);
	//myText=myText.replace( pattern, result);
	

	// paragraphs
	myText=myText.replace(/\r\n\r\n/igm, "\r\n<BR>&nbsp;<BR>\r\n");
		
	var pattern = new RegExp("</tr>\r\n<BR>", "igm");
	var result="</tr>\r\n</table>\r\n<BR>"
	myText=myText.replace( pattern, result);

	var pattern = new RegExp("<BR>\r\n<TR>", "igm");
	var result="<br>\r\n<table border=1>\r\n<TR>"
	myText=myText.replace( pattern, result);


//	<TR><td>Naming </td><td> Description</td></tr>
//	<tr><td>-----</td><td>------------</td></tr>

	//var pattern = new RegExp("<TR>(.*)<\/tr>", "gm");
	//var result="<TR>$1<\/th><th>$2</TR>"
	//myText=myText.replace( pattern, result);


	//return myText;
// each line in table


//---------------------------------------------------------------------
	// Multiple inlines
	myText=myText.replace(/\r\n```([^`]*)```/igm, "\r\n<pre>$1</pre>");

	//  Inline monospace
	myText=myText.replace(/\x60([^\x60]*)\x60/igm, "<tt>$1</tt>");

	// __Strong__
	myText=myText.replace(/\b__([^_]+)__\b/igm, "<strong>$1</strong>");
	// _Italic
	//myText=myText.replace(/\b_([^_]+)_\b/igm, "<i>$1</i>");
	myText=myText.replace(/\b_([^\s]*)_/igm, "<i>$1</i>");

	// **strong**
	myText=myText.replace(/\b\x2A\x2A/ig, "</strong>");
	myText=myText.replace(/\x2A\x2A\b/ig, "<strong>");

	// *Italic*
	myText=myText.replace(/\b\x2A/ig, "</i>");
	myText=myText.replace(/\x2A\b/ig, "<i>");

	// Blockquotes - You can indicate blockquotes with a >.
	myText=myText.replace(/\r\n>([^\r\n]*)/igm, "\r\n<pre>$1</pre>");

	// Links 
	myText=myText.replace(/\x5B([^\x5D]*)\x5D\x28([^\x29]*)\x29/igm, "<a href='$2'>$1</a>");

	// Unordered lists - You can make an unordered list by preceding list items with either a * or a -.
	myText=myText.replace(/\r\n([\s]*)\*([^\r\n]*)/igm, "\r\n$1<ul><li alt='unordered'>$2</li></ul>");
	myText=myText.replace(/\r\n([\s]*)-([^\r\n]*)/igm, "\r\n$1<ul><li alt='Unordered'>$2</li></ul>");

	// Ordered lists - You can make an ordered list by preceding list items with a number.
	myText=myText.replace(/\r\n([\s]*)(\d)\.([^\r\n]*)/igm, "\r\n<ol>$1<li alt='ordered'>$3</li></ol>");

	// Nested lists - You can create nested lists by indenting list items by two spaces.
	// Simple nested
//		//myText=myText.replace(/\<\/ul\>\r\n([\s]*)\<ul\>(.*)\<\/ul\>/igm, "\r\n$1xx<ula>$2yyy");
//		//myText=myText.replace(/\<\/ul\>\r\n([\s]*)\<ul\>(.*)\<\/li\>\r\n\<\/li /igm, "\r\n$1yy$2");
//		//myText=myText.replace(/\<\/ul\>\r\n([\s]*)\<ul\>(.*)\<\/li\>\r\n\<\/li /igm, "\r\n$1yy$2");
//		myText=myText.replace(/\r\n([\s]{2})([\s]*)(\<[uo]l\>)/igm, "\r\n-$2$3");
		myText=myText.replace(/\r\n([\s]{2})([\s]*)(\<[uo]l\>)/igm, "\r\n-$2$3");
		myText=myText.replace(/\r\n([-]*)([\s]{2})(\<[uo]l\>)/ig, "\r\n-$1$3");

	// Remove any combination of ol/ul
//		myText=myText.replace(/\<\/[ou]l\>\r\n\<[ou]l\>/igm, "\r\n");

	// Strikethrough <strike>
	myText=myText.replace(/\s\x7E\x7E\b/igm, "<strike>");
	//myText=myText.replace(/[\b\.]\x7E\x7E/igm, "</strike>");
	myText=myText.replace(/\x7E\x7E/igm, "</strike>");
	
	return myText;
}	//*** markDown2html() ***

//---------------------------------------------------------------------


// Read from source file (first argument)
myText = ReadFromFile(WScript.Arguments.Item(0)); 

// Convert MD to HTML
myText = markDown2html(myText);

// Write to stdout
//WScript.StdOut.Write(myText);

// http://stackoverflow.com/questions/805107/creating-multiline-strings-in-javascript
var header='<HTML>\n'+
'	<HEAD>\n'+
'		<TITLE>[title]</TITLE>\n'+
'		<META NAME=AUTHOR CONTENT="[Author]">\n'+
'	</HEAD>\n\n'+
'<BODY>\n';
var footer='	</BODY>\n</HTML>';

// Update header with file
header=header.replace(/\[title\]/i, WScript.Arguments.Item(0));

// Write to target file
WriteToFile(WScript.Arguments.Item(1), header + myText + footer);

WScript.StdOut.Write(myText);

//*** End of File *****************************************************
