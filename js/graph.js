$(document).ready(function () {

  $("#choose-benchmark select").combobox({ callbackSelectOption: function(val) {
      $('#holder').empty();
      $('#results').empty();
      loadBenchmark(val + "/benchmark.html");
  }});

  // Grab xvalues, yvalues
  function grabValues(xValues, yValues, numLines) {
    for(var i = 0; i < numLines; i++) {
      xValues.push([]);
      yValues.push([]);
    }
    $("tr").each(function(rowId) {
      $("td", this).each(function(colId) {
	if(colId == 0){
	  for(var i = 0; i < numLines; i++) {
	    xValues[i].push(parseFloat($(this).text()));
	  }
	} else {
	  yValues[colId - 1].push(parseFloat($(this).text()));
	}
      });
    });
  }

  function loadBenchmark(name) {

    var xValues = [], yValues = [], labels = [];
    var cols, numLines;

    // $("#holder").height(window.innerHeight - 155);
    var r = Raphael("holder");
    r.g.txtattr.font = "12px 'Fontin Sans', Fontin-Sans, sans-serif";

    $("#results").load(name, function(response, success, request) {

      // Hide meta information
      $("#meta").hide();

      cols = $("table th");
      labels = $("table th");
      numLines = cols.length - 1;

      grabValues(xValues, yValues, numLines);

      // Render the graph
      var graph_x0 = 30;
      var graph_y0 = 30;
      var graph_x1 = r.width - 250;
      var graph_y1 = r.height - 80;

      var lines = r.g.linechart(graph_x0, graph_y0, graph_x1, graph_y1, xValues, yValues,
		    { axisxstep: xValues[0].length, axisystep: xValues[0].length, nostroke: false, axis: "0 0 1 1", symbol: "o" }).hoverColumn(function () {
		      this.tags = r.set();
			for (var i = 0, ii = this.y.length; i < ii; i++) {
				  this.tags.push(r.g.tag(this.x, this.y[i], this.values[i], 160, 10).insertBefore(this).attr([{fill: "#fff"}, {fill: "#000"}]));
				  $($("tr")[this.colId + 1]).animate({backgroundColor: "#b00"});
				}
			      }, function () {
				this.tags && this.tags.remove();
				$($("tr")[this.colId + 1]).animate({backgroundColor: "black"});
			      });

      lines.axis.attr("stroke", "#fff");
      lines.axis[0].text.attr("stroke", "#fff");
      lines.axis[1].text.attr("stroke", "#fff");

      // Render axis labels

      // var xLabel =  $($("th")[0]).text().match(/\((.*)\)/)[1];

      // Grab meta information
      var x_label = $("#meta p#x_label").text() || $($("th")[0]).text();
      var y_label = $("#meta p#y_label").text() ||  $($("th")[1]).text().match(/\((.*)\)/)[1];
      var legend_xpos = parseInt($("#meta p#legend_xpos").text()) || graph_x1 + 50;
      var legend_ypos = parseInt($("#meta p#legend_ypos").text()) || 40;

      r.text((lines.axis[0].getBBox().x + lines.axis[0].getBBox().width)/2, lines.axis[0].getBBox().y + 40, x_label).attr({ fill: "#fff", "font-size": 18 });
      r.text(lines.axis[1].getBBox().x - 30, (lines.axis[1].getBBox().y + lines.axis[1].getBBox().height)/2, y_label).rotate(-90).attr({ fill: "#fff", "font-size": 18 });

      // Render legend
      var st = r.set();
      for (var i = 0; i < numLines; i++) {
	st.push(r.g.disc(legend_xpos + 10, legend_ypos + i * 18, 5).attr({fill: lines.lines[i].attrs.stroke, stroke: "none"}));
	st.push(r.text(legend_xpos + 40, legend_ypos + i * 18, $(labels[i + 1]).text()).attr(r.g.txtattr).attr({fill: lines.lines[i].attrs.stroke, "text-anchor": "start", "font-weight": "bold"}));
      }

      var rect = r.rect(st.getBBox().x - 10, st.getBBox().y - 10, st.getBBox().width + 20, st.getBBox().height + 20, 5);
      rect.attr({stroke: "#fff", fill: "#444", "fill-opacity": "0.5"});

      // !HACK! Re-render the legend after the box (please find a better way to do this)
      for (i = 0; i < numLines; i++) {
		st.push(r.g.disc(legend_xpos + 10, legend_ypos + i * 18, 5).attr({fill: lines.lines[i].attrs.stroke, stroke: "none"}));
	st.push(r.text(legend_xpos + 40, legend_ypos + i * 18, $(labels[i + 1]).text()).attr(r.g.txtattr).attr({fill: lines.lines[i].attrs.stroke, "text-anchor": "start", "font-weight": "bold"}));
      }

      // Apply ceebox to a.ceebox links
      $(function () {
	$('a.ceebox').ceebox();
      });

    });
  }

  loadBenchmark("spawn/benchmark.html");

});
