import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Fonction principale de la vue BarChart
let BarView = {
  combineDataForGraph: function (totalCandidatsByDepartment) {
    let data = totalCandidatsByDepartment.map(deptData => ({
      department: deptData.department,
      postBacs: deptData.postBacs, // Utilisation directe des données de postBacs
      generale: deptData.generale,
      sti2d: deptData.sti2d,
      autre: deptData.autre,
    }));

    // Assurez-vous d'ajouter le département 98 même s'il est déjà présent
    if (!data.some((d) => d.department === "98")) {
      data.push({
        department: "98",
        postBacs: 0, // Si non présent, ajouter 0 explicitement
        generale: 0,
        sti2d: 0,
        autre: 0,
      });
    }

    return data;
  },

  render: function (id, totalCandidatsByDepartment) {
    let self = this;
    am5.ready(function () {
      let root = am5.Root.new(id);

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panY",
          wheelY: "zoomY",
          paddingLeft: 0,
          layout: root.verticalLayout,
        })
      );

      chart.set(
        "scrollbarY",
        am5.Scrollbar.new(root, {
          orientation: "vertical",
        })
      );

      let data = self.combineDataForGraph(totalCandidatsByDepartment);

      let yRenderer = am5xy.AxisRendererY.new(root, {});
      let yAxis = chart.yAxes.push(
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

      let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          min: 0,
          maxPrecision: 0,
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 40,
          }),
        })
      );

      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
        })
      );

      function makeSeries(name, fieldName) {
        let series = chart.series.push(
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

      makeSeries("Post-Bacs", "postBacs");
      makeSeries("Générale", "generale");
      makeSeries("STI2D", "sti2d");
      makeSeries("Autre", "autre");

      chart.appear(1000, 100);
    });
  },
};

export { BarView };
