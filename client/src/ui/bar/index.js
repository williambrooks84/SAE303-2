import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

let BarView = {
  render: function (id, lyceesData, totalCandidats, postBacsByDepartment) {
    am5.ready(function () {
      // Create root element
      var root = am5.Root.new(id);

      // Add theme
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      var chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panY",
          wheelY: "zoomY",
          paddingLeft: 0,
          layout: root.verticalLayout,
        })
      );

      // Add scrollbar
      chart.set(
        "scrollbarY",
        am5.Scrollbar.new(root, {
          orientation: "vertical",
        })
      );

      // Map department codes to UAIs
      let departmentMap = {};
      lyceesData.forEach((lycee) => {
        const deptCode = lycee.code_departement;
        const uai = lycee.numero_uai;
        if (!departmentMap[deptCode]) {
          departmentMap[deptCode] = [];
        }
        departmentMap[deptCode].push(uai);
      });

      // Aggregate data for the chart
      let data = postBacsByDepartment.map((dept) => {
        let deptCode = dept.deptCode;
        let postBacs = dept.postBacs || 0;

        let totaleGenerale = 0,
          totaleSTI2D = 0,
          totaleAutre = 0;

        if (departmentMap[deptCode]) {
          departmentMap[deptCode].forEach((uai) => {
            let candidats = totalCandidats[uai] || { generale: 0, sti2d: 0, autre: 0 };
            totaleGenerale += candidats.generale || 0;
            totaleSTI2D += candidats.sti2d || 0;
            totaleAutre += candidats.autre || 0;
          });
        }

        return {
          department: `Dept ${deptCode}`,
          postBacs: postBacs,
          generale: totaleGenerale,
          sti2d: totaleSTI2D,
          autre: totaleAutre,
        };
      });

      console.log("Données finales pour le graphique :", data);

      // Create axes
      var yRenderer = am5xy.AxisRendererY.new(root, {});
      var yAxis = chart.yAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "department",
          renderer: yRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );

      yRenderer.grid.template.setAll({
        location: 1,
      });

      yAxis.data.setAll(data);

      var xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          maxPrecision: 0,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 40,
          }),
        })
      );

      // Add legend
      var legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
        })
      );

      // Add series
      function makeSeries(name, fieldName) {
        var series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: name,
            stacked: true,
            xAxis: xAxis,
            yAxis: yAxis,
            baseAxis: yAxis,
            valueXField: fieldName,
            categoryYField: "department",
          })
        );

        series.columns.template.setAll({
          tooltipText: "{name}, {categoryY}: {valueX}",
          tooltipY: am5.percent(90),
        });
        series.data.setAll(data);

        // Make stuff animate on load
        series.appear();

        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            sprite: am5.Label.new(root, {
              text: "{valueX}",
              fill: root.interfaceColors.get("alternativeText"),
              centerY: am5.p50,
              centerX: am5.p50,
              populateText: true,
            }),
          });
        });

        legend.data.push(series);
      }

      // Add series for each category
      makeSeries("Post-Bacs", "postBacs");
      makeSeries("Générale", "generale");
      makeSeries("STI2D", "sti2d");
      makeSeries("Autre", "autre");

      // Animate chart on load
      chart.appear(1000, 100);
    }); // end am5.ready()
  },
};

export { BarView };
