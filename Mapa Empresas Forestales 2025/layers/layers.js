ol.proj.proj4.register(proj4);
//ol.proj.get("EPSG:25830").setExtent([149782.747866, 4736231.808259, 385838.258441, 4855104.631007]);
var wms_layers = [];

var format_Disuelto_0 = new ol.format.GeoJSON();
var features_Disuelto_0 = format_Disuelto_0.readFeatures(json_Disuelto_0, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:25830'});
var jsonSource_Disuelto_0 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Disuelto_0.addFeatures(features_Disuelto_0);
var lyr_Disuelto_0 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Disuelto_0, 
                style: style_Disuelto_0,
                popuplayertitle: 'Disuelto',
                interactive: false,
    title: 'Disuelto<br />\
    <img src="styles/legend/Disuelto_0_0.png" /> 1<br />\
    <img src="styles/legend/Disuelto_0_1.png" /> 2<br />\
    <img src="styles/legend/Disuelto_0_2.png" /> 3<br />\
    <img src="styles/legend/Disuelto_0_3.png" /> 4<br />\
    <img src="styles/legend/Disuelto_0_4.png" /> 5<br />\
    <img src="styles/legend/Disuelto_0_5.png" /> 6<br />\
    <img src="styles/legend/Disuelto_0_6.png" /> 7<br />\
    <img src="styles/legend/Disuelto_0_7.png" /> 8<br />\
    <img src="styles/legend/Disuelto_0_8.png" /> 9<br />\
    <img src="styles/legend/Disuelto_0_9.png" /> 10<br />\
    <img src="styles/legend/Disuelto_0_10.png" /> 11<br />\
    <img src="styles/legend/Disuelto_0_11.png" /> 12<br />\
    <img src="styles/legend/Disuelto_0_12.png" /> 13<br />\
    <img src="styles/legend/Disuelto_0_13.png" /> 14<br />\
    <img src="styles/legend/Disuelto_0_14.png" /> 15<br />\
    <img src="styles/legend/Disuelto_0_15.png" /> 16<br />\
    <img src="styles/legend/Disuelto_0_16.png" /> 17<br />\
    <img src="styles/legend/Disuelto_0_17.png" /> 18<br />\
    <img src="styles/legend/Disuelto_0_18.png" /> 19<br />\
    <img src="styles/legend/Disuelto_0_19.png" /> 20<br />\
    <img src="styles/legend/Disuelto_0_20.png" /> 21<br />\
    <img src="styles/legend/Disuelto_0_21.png" /> 22<br />\
    <img src="styles/legend/Disuelto_0_22.png" /> 23<br />\
    <img src="styles/legend/Disuelto_0_23.png" /> 24<br />\
    <img src="styles/legend/Disuelto_0_24.png" /> 25<br />\
    <img src="styles/legend/Disuelto_0_25.png" /> 26<br />\
    <img src="styles/legend/Disuelto_0_26.png" /> 27<br />\
    <img src="styles/legend/Disuelto_0_27.png" /> 28<br />\
    <img src="styles/legend/Disuelto_0_28.png" /> 29<br />\
    <img src="styles/legend/Disuelto_0_29.png" /> 30<br />\
    <img src="styles/legend/Disuelto_0_30.png" /> 31<br />\
    <img src="styles/legend/Disuelto_0_31.png" /> 32<br />\
    <img src="styles/legend/Disuelto_0_32.png" /> 33<br />\
    <img src="styles/legend/Disuelto_0_33.png" /> 34<br />\
    <img src="styles/legend/Disuelto_0_34.png" /> 35<br />\
    <img src="styles/legend/Disuelto_0_35.png" /> <br />' });
var format_CONCEJOSconcejos2024_1 = new ol.format.GeoJSON();
var features_CONCEJOSconcejos2024_1 = format_CONCEJOSconcejos2024_1.readFeatures(json_CONCEJOSconcejos2024_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:25830'});
var jsonSource_CONCEJOSconcejos2024_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_CONCEJOSconcejos2024_1.addFeatures(features_CONCEJOSconcejos2024_1);
var lyr_CONCEJOSconcejos2024_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_CONCEJOSconcejos2024_1, 
                style: style_CONCEJOSconcejos2024_1,
                popuplayertitle: 'CONCEJOS — concejos2024',
                interactive: false,
                title: '<img src="styles/legend/CONCEJOSconcejos2024_1.png" /> CONCEJOS — concejos2024'
            });
var format_EmpresasForestales2025_2 = new ol.format.GeoJSON();
var features_EmpresasForestales2025_2 = format_EmpresasForestales2025_2.readFeatures(json_EmpresasForestales2025_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:25830'});
var jsonSource_EmpresasForestales2025_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_EmpresasForestales2025_2.addFeatures(features_EmpresasForestales2025_2);
var lyr_EmpresasForestales2025_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_EmpresasForestales2025_2, 
                style: style_EmpresasForestales2025_2,
                popuplayertitle: 'Empresas Forestales 2025',
                interactive: true,
                title: '<img src="styles/legend/EmpresasForestales2025_2.png" /> Empresas Forestales 2025'
            });

lyr_Disuelto_0.setVisible(true);lyr_CONCEJOSconcejos2024_1.setVisible(true);lyr_EmpresasForestales2025_2.setVisible(true);
var layersList = [lyr_Disuelto_0,lyr_CONCEJOSconcejos2024_1,lyr_EmpresasForestales2025_2];
lyr_Disuelto_0.set('fieldAliases', {'Code': 'Code', 'Topo_ofi': 'Topo_ofi', 'Concejo': 'Concejo', 'LOTE': 'LOTE', 'M. HUMANOS': 'M. HUMANOS', 'VEHICULOS': 'VEHICULOS', 'EMPRESA': 'EMPRESA', });
lyr_CONCEJOSconcejos2024_1.set('fieldAliases', {'fid': 'fid', 'Code1': 'Code1', 'Topo_ofi': 'Topo_ofi', 'Topo_tra': 'Topo_tra', 'Topo_his': 'Topo_his', 'km2': 'km2', 'year': 'year', 'ZAR': 'ZAR', 'INCENDIO': 'INCENDIO', });
lyr_EmpresasForestales2025_2.set('fieldAliases', {'Code': 'Code', 'Topo_ofi': 'Topo_ofi', 'Concejo': 'Concejo', 'LOTE': 'LOTE', 'M. HUMANOS': 'M. HUMANOS', 'VEHICULOS': 'VEHICULOS', 'EMPRESA': 'EMPRESA', });
lyr_Disuelto_0.set('fieldImages', {'Code': 'TextEdit', 'Topo_ofi': 'TextEdit', 'Concejo': 'TextEdit', 'LOTE': 'TextEdit', 'M. HUMANOS': 'TextEdit', 'VEHICULOS': 'TextEdit', 'EMPRESA': 'TextEdit', });
lyr_CONCEJOSconcejos2024_1.set('fieldImages', {'fid': 'TextEdit', 'Code1': 'TextEdit', 'Topo_ofi': 'TextEdit', 'Topo_tra': 'TextEdit', 'Topo_his': 'TextEdit', 'km2': 'TextEdit', 'year': 'Range', 'ZAR': 'TextEdit', 'INCENDIO': 'TextEdit', });
lyr_EmpresasForestales2025_2.set('fieldImages', {'Code': 'TextEdit', 'Topo_ofi': 'TextEdit', 'Concejo': 'TextEdit', 'LOTE': 'TextEdit', 'M. HUMANOS': 'TextEdit', 'VEHICULOS': 'TextEdit', 'EMPRESA': 'TextEdit', });
lyr_Disuelto_0.set('fieldLabels', {'Code': 'no label', 'Topo_ofi': 'no label', 'Concejo': 'no label', 'LOTE': 'no label', 'M. HUMANOS': 'no label', 'VEHICULOS': 'no label', 'EMPRESA': 'no label', });
lyr_CONCEJOSconcejos2024_1.set('fieldLabels', {'fid': 'no label', 'Code1': 'no label', 'Topo_ofi': 'no label', 'Topo_tra': 'no label', 'Topo_his': 'no label', 'km2': 'no label', 'year': 'no label', 'ZAR': 'no label', 'INCENDIO': 'no label', });
lyr_EmpresasForestales2025_2.set('fieldLabels', {'Code': 'no label', 'Topo_ofi': 'no label', 'Concejo': 'no label', 'LOTE': 'header label - visible with data', 'M. HUMANOS': 'no label', 'VEHICULOS': 'inline label - visible with data', 'EMPRESA': 'inline label - visible with data', });
lyr_EmpresasForestales2025_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});