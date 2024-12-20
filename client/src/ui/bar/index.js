import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

// Fonction principale de la vue BarChart
let BarView = {
    combineDataForGraph: function (totalCandidatsByDepartment, rayon) {
        // Filtrer les départements basés sur le rayon
        let filteredData = totalCandidatsByDepartment.filter(deptData => deptData.rayon === rayon);

        // Filtrer les départements avec des valeurs non nulles
        let data = filteredData.map(deptData => ({
            department: deptData.department,
            postBacs: deptData.postBacs,
            generale: deptData.generale,
            sti2d: deptData.sti2d,
            autre: deptData.autre,
        })).filter(deptData => deptData.postBacs > 0 || deptData.generale > 0 || deptData.sti2d > 0 || deptData.autre > 0);

        return data;
    },

    render: function (id, totalCandidatsByDepartment, rayon) {
        am5.ready(function () {
            let existingRoot = am5.registry.rootElements.find(root => root.dom.id === id);
            if (existingRoot) {
                existingRoot.dispose();
            }

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

            chart.set("scrollbarY", am5.Scrollbar.new(root, { orientation: "vertical" }));

            let data = BarView.combineDataForGraph(totalCandidatsByDepartment, rayon);

            let yAxis = chart.yAxes.push(
                am5xy.CategoryAxis.new(root, {
                    categoryField: "department",
                    renderer: am5xy.AxisRendererY.new(root, {}),
                    tooltip: am5.Tooltip.new(root, {}),
                })
            );

            yAxis.data.setAll(data);
            yAxis.get("renderer").grid.template.setAll({ location: 1 });

            let xAxis = chart.xAxes.push(
                am5xy.ValueAxis.new(root, {
                    min: 0,
                    maxPrecision: 0,
                    renderer: am5xy.AxisRendererX.new(root, { minGridDistance: 40 }),
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

                series.bullets.push(() => {
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
            }

            makeSeries("Post-Bacs", "postBacs");
            makeSeries("Générale", "generale");
            makeSeries("STI2D", "sti2d");
            makeSeries("Autre", "autre");

            let legend = chart.children.push(
                am5.Legend.new(root, {
                    centerX: am5.p50,
                    x: am5.p50,
                })
            );

            chart.appear(1000, 100); // Fade-in animation

            // Gestion de l'événement de redimensionnement pour s'assurer que le graphique reste visible
            window.addEventListener("resize", () => {
                root.resize(); // Redimensionne le graphique si la taille change
            });
        });
    }
};

export { BarView };
